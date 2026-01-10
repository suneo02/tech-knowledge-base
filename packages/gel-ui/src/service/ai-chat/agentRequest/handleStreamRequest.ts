import { isAbortError } from '@/constants/error'
import { createAIResponseStream, XRequestClass } from '@/service'
import { createHandleError, parseStreamThunk } from '@/service/agentRequest/helper'
import { AgentMsgOverall, AgentMsgUserOverall } from '@/types'
import { AxiosInstance } from 'axios'
import {
  BuryAction,
  ChatClientType,
  ChatEntityRecognize,
  ChatQuestionStatus,
  GetResultRequest,
  postPointBuriedWithAxios,
  StreamChunk,
} from 'gel-api'
import { eaglesError } from 'gel-util/errorLogger'
import { ChatSenderRes } from '../saveChatItem'
import { fetchAndUpdateEntities } from './fetchAndUpdateEntities'

// 超时时间设置为10秒
const STREAM_TIMEOUT = 10000

export type HandleStreamRequestOptions = {
  create: XRequestClass['create']
  message: AgentMsgUserOverall
  result: ChatSenderRes | undefined
  lines: { content: string; reason: string }
  entities: ChatEntityRecognize[] | undefined
  abortStreamControllerRef: React.MutableRefObject<AbortController | null>
  onUpdate: (response: AgentMsgOverall) => void
  // 流式输出成功回调，即 DONE
  onSuccess: (response: AgentMsgOverall, entities: ChatEntityRecognize[] | undefined) => void
  // 流式输出 agent 成功回调
  onComplete: () => void
  isFirstQuestionRef: React.MutableRefObject<boolean>
  onRefresh?: () => void
  clientType?: ChatClientType
}

/**
 * Handle the streaming request for chat messages
 */
export async function handleStreamRequest(
  axiosChat: AxiosInstance,
  axiosEntWeb: AxiosInstance,
  options: HandleStreamRequestOptions
) {
  const {
    create,
    message,
    result,
    lines,
    entities,
    abortStreamControllerRef,
    onUpdate,
    onSuccess,
    onComplete,
    isFirstQuestionRef,
    onRefresh,
    clientType,
  } = options

  if (!result) {
    onComplete()
    return
  }

  const aiResRefCreator = () => createAIResponseStream(message, lines.content, lines.reason, entities || [], result)

  // 添加一个标志，表示是否已经获取过实体数据
  let entitiesFetched = false

  // 添加超时检测的计时器引用
  let timeoutRef: number | null = null

  // 重置超时计时器
  const resetTimeout = (timeout: number = STREAM_TIMEOUT) => {
    if (timeoutRef) {
      clearTimeout(timeoutRef)
    }
    timeoutRef = setTimeout(() => {
      console.error(`Stream timeout: No response for ${timeout / 1000} seconds`)
      handleAbort()
    }, timeout)
  }

  // 清理超时计时器
  const clearTimeoutTimer = () => {
    if (timeoutRef) {
      clearTimeout(timeoutRef)
      timeoutRef = null
    }
  }

  // 成功和失败都调用的操作
  const handleFinish = async ({ questionStatus }: { questionStatus: ChatQuestionStatus }) => {
    // 清理超时计时器
    clearTimeoutTimer()
    // 重置 abortStreamControllerRef
    abortStreamControllerRef.current = null
    // 调用回调
    onComplete()

    onUpdate({
      ...aiResRefCreator(),
      gelData: result?.gelData,
      splTable: result?.splTable,
      reportData: result?.reportData,
      status: 'stream_finish',
    })

    if (!entitiesFetched) {
      entitiesFetched = true
      // 获取实体数据
      await fetchAndUpdateEntities({
        questionStatus,
        axiosChat,
        result,
        lines,
        onSuccess,
        aiResRefCreator,
        isFirstQuestionRef,
      })
      onRefresh?.()
    }

    // 上报埋点
    postPointBuriedWithAxios(axiosEntWeb, BuryAction.NORMAL_ANSWER, {
      isDeepThinking: message.think ? true : false,
    })
    if (message.think) {
      postPointBuriedWithAxios(axiosEntWeb, '922610370003')
    }
    if (message.deepSearch) {
      postPointBuriedWithAxios(axiosEntWeb, '922604570280', { question: message.content })
    }
  }

  const handleSuccess = async () => {
    console.warn('Stream Request Sucess')

    handleFinish({
      questionStatus: ChatQuestionStatus.SUCCESS,
    })
  }
  const handleAbort = () => {
    handleFinish({
      questionStatus: ChatQuestionStatus.FAILED,
    })
  }

  // 启动初始超时计时器 20s
  resetTimeout(20000)

  return create<GetResultRequest, StreamChunk>(
    {
      rawSentence: message?.content || '',
      rawSentenceID: result?.rawSentenceID,
      agentId: message?.agentId,
      version: 1,
      think: message.think || message.deepSearch, // 当前这个不仅有深度思考还有 超级名单的深度检索（坤元暂时使用这个字段）
      clientType,
      agentParam: message.agentParam,
      chatId: result?.chatId,
      // @ts-expect-error 临时方案 2025-07-30 兼容后端问题，预计一周后去除
      deepSearch: message.deepSearch, // 目前这个字段坤元没有用到，用的是 think 字段，后续他修改
    },
    {
      onSuccess: handleSuccess,
      onUpdate: (chunk: StreamChunk) => {
        try {
          console.log('🚀 ~ chunk:', chunk)
          resetTimeout() // 重置超时计时器
          const parsedChunk = parseStreamThunk(chunk, abortStreamControllerRef.current)
          if (parsedChunk?.type === 'DONE') {
            if (!entitiesFetched) {
              entitiesFetched = true
              fetchAndUpdateEntities({
                questionStatus: ChatQuestionStatus.SUCCESS,
                axiosChat,
                result,
                lines,
                onSuccess,
                aiResRefCreator,
                isFirstQuestionRef,
              }).finally(() => {
                onRefresh?.()
              })
            }
          } else if (parsedChunk?.type === 'UPDATE') {
            const { content, reasonContent } = parsedChunk.payload
            if (content) {
              lines.content += content
            }
            if (reasonContent) {
              lines.reason += reasonContent
            }

            onUpdate({
              ...aiResRefCreator(),
              status: 'receiving',
            })
          }
        } catch (error) {
          console.error('🚀 ~ handleStreamRequest ~ onUpdate  error:', error, 'chunk', chunk)
          throw Error(
            JSON.stringify({
              error,
              chunk,
            })
          )
        }
      },

      onError: (error) => {
        clearTimeoutTimer() // 清理超时计时器
        console.error('Stream error:', error)

        // 上报流式请求错误日志
        eaglesError(axiosEntWeb, error)
        const isCancel = isAbortError(error)
        const questionStatus = isCancel ? ChatQuestionStatus.CANCELLED : ChatQuestionStatus.FAILED
        throw createHandleError({
          chatId: result?.chatId,
          rawSentenceID: result?.rawSentenceID,
          rawSentence: message?.content || '',
          errorCode: questionStatus,
        })
      },
    }
  )
}
