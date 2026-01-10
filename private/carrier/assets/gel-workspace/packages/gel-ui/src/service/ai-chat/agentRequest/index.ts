import { XRequestClass } from '@/service'
import { AgentMsgOverall, AgentMsgUserOverall, ChatSenderHookResultForStream } from '@/types'
import { XAgentConfig } from '@ant-design/x/es/use-x-agent'
import { message as messageApi } from '@wind/wind-ui'
import { AnyObject } from 'antd/es/_util/type'
import { AxiosInstance } from 'axios'
import { ChatClientType, ChatEntityRecognize } from 'gel-api'
import { ERROR_TEXT } from 'gel-util/config'
import { saveChatItem } from '../saveChatItem'
import {
  createAIResponseDataRetrieval,
  createAIResponseInit,
  createAIResponseStream,
  createAIResponseSubQuestion,
} from './chatHelpers'
import { handleStreamRequest } from './handleStreamRequest'
export {
  createAIResponseDataRetrieval,
  createAIResponseInit,
  createAIResponseStream,
  createAIResponseSubQuestion,
} from './chatHelpers'
export { handleStreamRequest } from './handleStreamRequest'

export interface RequestFnInfo<Message> extends AnyObject {
  messages?: Message[]
  message?: Message
}
/**
 * Create a handler for agent requests that processes AI chat messages
 *
 * TODO 拆分 基础 和 增强 的 请求处理器
 */
export const createAgentRequestHandler = (dependencies: {
  axiosChat: AxiosInstance
  axiosEntWeb: AxiosInstance
  setContent: (content: string) => void
  setIsChating: (isChating: boolean) => void
  sendAndInitializeConversation: ChatSenderHookResultForStream['sendAndInitializeConversation']
  entities: ChatEntityRecognize[] | undefined
  abortControllerRef: React.MutableRefObject<AbortController | null>
  abortStreamControllerRef: React.MutableRefObject<AbortController | null>
  create: XRequestClass['create']
  setEntities: (entities: ChatEntityRecognize[]) => void
  clientType?: ChatClientType
  isFirstQuestionRef: React.MutableRefObject<boolean>
  onRefresh?: () => void
  // stream 流式输出成功时的自定义 transfom 函数
  transformerOnStreamSucces?: (message: AgentMsgOverall) => Promise<AgentMsgOverall>
}): XAgentConfig<AgentMsgOverall, RequestFnInfo<AgentMsgUserOverall>, AgentMsgOverall>['request'] => {
  const {
    axiosChat,
    axiosEntWeb,
    setContent,
    setIsChating,
    sendAndInitializeConversation,
    entities,
    abortControllerRef,
    abortStreamControllerRef,
    create,
    setEntities,
    clientType,
    transformerOnStreamSucces,
    isFirstQuestionRef,
    onRefresh,
  } = dependencies

  return async ({ message }, { onSuccess: onAgentSuccess, onUpdate: onAgentUpdate }) => {
    console.log('🚀 ~ return ~ message:', message)
    if (!message) {
      setIsChating(false)
      return
    }

    // 错处处理
    const handleError = (error) => {
      console.error('handleError： error:', error)
      const { result = {}, errorCode } = error
      setIsChating(false)
      abortControllerRef.current = null
      const content = lines.content || ERROR_TEXT[errorCode]
      const agentMsg = {
        ...createAIResponseStream(message, content, lines.reason, entities || [], result),
        status: 'finish',
        questionStatus: errorCode,
      }
      // @ts-expect-error ttt 这里 ts 要求必须传入数组，但是传入数组会无效
      onAgentSuccess(agentMsg)
      console.log('🚀 ~ handleError ~ message:', result, message)

      saveChatItem({
        axiosChat,
        result: {
          ...result,
          ...message,
          chatId: message.chatId || result.chatId || '',
        },
        questionStatus: errorCode,
        isFirstQuestion: isFirstQuestionRef.current,
      }).finally(() => {
        onRefresh?.()
      })

      // throw error
    }

    setContent('')
    setIsChating(true)

    const lines = {
      content: '',
      reason: '',
    }
    let result
    try {
      // Create new AbortController
      abortControllerRef.current = new AbortController()

      // Initialize with pending state
      onAgentUpdate({
        ...createAIResponseInit(message),
        status: 'pending',
      })

      // Handle sub-questions
      const onReciveQuestion = (question: string[]) => {
        onAgentUpdate({
          ...createAIResponseSubQuestion(message, question),
          status: 'pending',
        })
      }

      if (!message.content) {
        messageApi.error('出了点问题，请稍后再试')
        console.error('chatId is required', message)

        return
      }
      // Send the message
      result = await sendAndInitializeConversation({
        chatId: message.chatId,
        message: message.content,
        options: {
          agentId: message?.agentId,
          think: message?.think || message?.deepSearch, // 坤元临时方案，我加这里，之后删除
          review: message?.think,

          entityType: message?.entityType,
          entityName: message?.entityName,
          deepSearch: message?.deepSearch, // 目前这个字段坤元没有用到，用的是 think 字段，后续他修改
          modelType: message?.modelType,
        },
        signal: abortControllerRef.current?.signal,
        onReciveQuestion,
      }).catch((error) => {
        console.error('sendAndInitializeConversation 异步错误:', error)
        throw error
      })

      abortControllerRef.current = null

      // Create response with references
      const aiResRef = createAIResponseDataRetrieval(
        message,
        // 字句拆解优化 应当保留这份数据
        [],
        entities || [],
        result
      )

      // Update with receiving state
      onAgentUpdate({
        ...aiResRef,
        status: 'receiving',
      })

      // Create new AbortController for stream requests
      abortStreamControllerRef.current = new AbortController()

      // Handle streaming response
      await handleStreamRequest(axiosChat, axiosEntWeb, {
        create,
        message,
        result,
        lines,
        entities,
        abortStreamControllerRef,
        onUpdate: onAgentUpdate,
        onSuccess: (message, entities) => {
          // @ts-expect-error ttt 这里 ts 要求必须传入数组，但是传入数组会无效
          onAgentSuccess(message)
          setEntities(entities || [])
          // 如果存在自定义的 transfom 函数，则调用
          // 用于做一些额外的特殊处理，比如 超级名单 的 问答引导
          if (transformerOnStreamSucces) {
            transformerOnStreamSucces(message).then((message) => {
              // @ts-expect-error ttt 这里 ts 要求必须传入数组，但是传入数组会无效
              onAgentSuccess(message)
            })
          }
        },

        onComplete: () => {
          setIsChating(false)
          // 清理流式控制器引用
          abortStreamControllerRef.current = null
        },

        isFirstQuestionRef,
        onRefresh,
        clientType,
      })
    } catch (error) {
      handleError(error)
    }
  }
}
