import { ChatSenderHookResultForStream } from '@/hooks/conversationSetup/types'
import { MessageRaw } from '@/types/message'
import { XRequestClass } from '@/util'
import { ERROR_TEXT } from '@/util/errorCode'
import { XAgentConfig } from '@ant-design/x/es/use-x-agent'
import { message as messageApi } from '@wind/wind-ui'
import { AxiosInstance } from 'axios'
import { SessionCompleteResponse } from 'gel-api'
import {
  createAIResponseDataRetrieval,
  createAIResponseInit,
  createAIResponseStream,
  createAIResponseSubQuestion,
} from './chatHelpers'
import { handleStreamRequest } from './chatRequestHandlers'
import { saveChatItem } from './saveChatItem'

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
  entities: SessionCompleteResponse[] | undefined
  abortControllerRef: React.MutableRefObject<AbortController | null>
  abortStreamControllerRef: React.MutableRefObject<AbortController | null>
  create: XRequestClass['create']
  setEntities: (entities: SessionCompleteResponse[]) => void
  clientType?: 'superlist'
  isFirstQuestionRef: React.MutableRefObject<boolean>
  onRefresh?: () => void
  // stream 流式输出成功时的自定义 transfom 函数
  transformerOnStreamSucces?: (message: MessageRaw) => Promise<MessageRaw>
  // @ts-expect-error ttt
}): XAgentConfig<MessageRaw>['request'] => {
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
      // if (!result) {
      //   return
      // }
      setIsChating(false)
      abortControllerRef.current = null
      const content = lines.content || ERROR_TEXT[errorCode]
      onAgentSuccess({
        ...createAIResponseStream(message, content, lines.reason, entities || [], result),
        status: 'finish',
        questionStatus: errorCode,
      })
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
        onRefresh,
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
          think: message?.think,
          review: message?.think,
          entityType: message?.entityType,
          entityName: message?.entityName,
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
      await handleStreamRequest(
        axiosChat,
        axiosEntWeb,
        create,
        message,
        result,
        lines,
        entities,
        abortStreamControllerRef,
        {
          onUpdate: onAgentUpdate,
          onSuccess: (message, entities) => {
            onAgentSuccess(message)
            setEntities(entities)
            // 如果存在自定义的 transfom 函数，则调用
            // 用于做一些额外的特殊处理，比如 超级名单 的 问答引导
            if (transformerOnStreamSucces) {
              transformerOnStreamSucces(message).then((message) => {
                onAgentSuccess(message)
              })
            }
          },

          onComplete: () => {
            setIsChating(false)
            // 清理流式控制器引用
            abortStreamControllerRef.current = null
          },
        },
        isFirstQuestionRef,
        onRefresh,
        clientType
      )

    } catch (error) {
      handleError(error)
    }


  }
}
