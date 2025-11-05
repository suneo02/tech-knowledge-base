import { filterTracesByValidSource, processTextWithEntities, processTextWithTraces } from '@/md'
import { MessageRaw } from '@/types/message'
import { NEW_WORKFLOW, XRequestClass } from '@/util'
import { AxiosInstance } from 'axios'
import { GetResultRequest, postPointBuriedWithAxios, SessionCompleteResponse, StreamChunk } from 'gel-api'
import { ChatSenderRes } from '../../conversationSetup/useConversationSetup'
import { createAIResponseStream, createHandleError, handleStreamUpdate } from './chatHelpers'
import { fetchEntities } from './fetchEntities'
import { fetchTrace } from './fetchTrace'
import { saveChatItem } from './saveChatItem'

// 超时时间设置为10秒
const STREAM_TIMEOUT = 10000

/**
 * Handle the streaming request for chat messages
 */
export const handleStreamRequest = async (
  axiosChat: AxiosInstance,
  axiosEntWeb: AxiosInstance,
  create: XRequestClass['create'],
  message: MessageRaw,
  result: ChatSenderRes,
  lines: { content: string; reason: string },
  entities: SessionCompleteResponse[] | undefined,
  abortStreamControllerRef: React.MutableRefObject<AbortController | null>,
  callbacks: {
    onUpdate: (response: MessageRaw) => void
    // 流式输出成功回调，即 DONE
    onSuccess: (response: MessageRaw, entities: SessionCompleteResponse[]) => void
    // 流式输出 agent 成功回调
    onComplete: () => void
  },
  isFirstQuestionRef: React.MutableRefObject<boolean>,
  onRefresh?: () => void,
  clientType?: 'superlist'
) => {
  if (!result) {
    callbacks.onComplete()
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

  // 统一获取实体数据的函数
  const fetchAndUpdateEntities = async ({ questionStatus }: { questionStatus: string }) => {
    if (entitiesFetched) return // 避免重复获取
    entitiesFetched = true
    const traces = await fetchTrace(axiosChat, result?.rawSentenceID)

    const dpuTableLength = result?.content?.data?.length || 0
    const suggestItems = result?.suggest?.items || []

    const tracesRes = filterTracesByValidSource(traces, dpuTableLength, suggestItems)

    const tracesContent = processTextWithTraces(lines.content, tracesRes)

    const newEntities = await fetchEntities(axiosChat, result?.rawSentenceID)

    const content = processTextWithEntities(tracesContent, newEntities)

    callbacks.onSuccess(
      {
        ...aiResRefCreator(),
        content,
        entity: newEntities,
        gelData: result?.gelData,
        status: 'finish',
      },
      newEntities
    )
    await saveChatItem({
      axiosChat,
      result,
      isFirstQuestion: isFirstQuestionRef.current,
      questionStatus: questionStatus,
      onRefresh,
    })
    return content
  }

  // 成功和失败都调用的操作
  const handleFinish = async ({ questionStatus }: { questionStatus: string }) => {
    // 清理超时计时器
    clearTimeoutTimer()
    // 重置 abortStreamControllerRef
    abortStreamControllerRef.current = null
    // 调用回调
    callbacks.onComplete()

    callbacks.onUpdate({
      ...aiResRefCreator(),
      gelData: result?.gelData,
      status: 'stream_finish',
    })

    // 获取实体数据
    await fetchAndUpdateEntities({
      questionStatus,
    })

    // 上报埋点
    postPointBuriedWithAxios(axiosEntWeb, '922610370002', {
      isDeepThinking: message.think ? true : false,
    })
    if (message.think) {
      postPointBuriedWithAxios(axiosEntWeb, '922610370003')
    }
  }

  const handleSuccess = async () => {
    console.log('Stream Request Sucess')

    handleFinish({
      questionStatus: '1',
    })
  }
  const handleAbort = () => {
    handleFinish({
      questionStatus: '0',
    })
  }

  // 启动初始超时计时器 20s
  resetTimeout(20000)

  return create<GetResultRequest, StreamChunk>(
    {
      rawSentence: message?.content || '',
      rawSentenceID: result?.rawSentenceID,
      agentId: result?.agentId,
      reAgentId: result?.reAgentId,
      version: NEW_WORKFLOW ? 1 : 3,
      think: message.think,
      clientType,
    },
    {
      onSuccess: handleSuccess,
      onUpdate: (chunk: StreamChunk) => {
        console.log('🚀 ~ chunk:', chunk)
        resetTimeout() // 重置超时计时器
        handleStreamUpdate(chunk, abortStreamControllerRef, {
          onSuccess: async () => {
            console.log('Stream return Done')

            await fetchAndUpdateEntities({
              questionStatus: '1',
            })
          },
          onUpdate: (response: { content: string; reasonContent: string }) => {
            if (response.content) {
              lines.content += response.content
            }
            if (response.reasonContent) {
              lines.reason += response.reasonContent
            }
            callbacks.onUpdate({
              ...aiResRefCreator(),
              status: 'receiving',
            })
          },
          onAbort: () => { },
        })
      },
      onError: (error: Error) => {
        clearTimeoutTimer() // 清理超时计时器
        console.error('Stream error:', error)
        const isCancel = error.name === 'AbortError'

        throw createHandleError({
          chatId: result?.chatId,
          rawSentenceID: result?.rawSentenceID,
          rawSentence: message?.content || '',
          errorCode: isCancel ? '-1' : '0',
        })
      },
    }
  )
}
