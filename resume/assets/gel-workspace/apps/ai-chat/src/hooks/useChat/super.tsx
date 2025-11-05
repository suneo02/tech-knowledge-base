import { axiosInstance } from '@/api/axios'
import { entWebAxiosInstance } from '@/api/entWeb'
import { createConfiguredXRequest } from '@/api/services/chatStream'
import { useChatRoomSuperContext } from '@/contexts/ChatRoom/super'
import { XChatConfig } from '@ant-design/x/es/use-x-chat'
import {
  ChatSenderHookResult,
  createAgentRequestHandler,
  MessageParsedBase,
  MessageParsedSuper,
  MessageRaw,
  MessageRawSuper,
  useCancelChatRequest,
  useConversationsSuper,
} from 'ai-ui'
import { SessionCompleteResponse } from 'gel-api'
import { useConversationSetupSuper } from '../conversationSetup'
import { fetchSuperQuestionGuide } from './helpers/questionGuide'
import { useXChatParserSuper } from './XChatParser/super'
/**
 * 超级聊天钩子实现，使用超级聊天解析器，具有增强功能
 *
 * 完整的超级聊天功能实现，集成了：
 * - 超级聊天室上下文管理
 * - 超级会话列表管理
 * - 复杂会话初始化和设置（包含多ID管理）
 * - 高级消息处理和交互
 *
 * 处理流程：
 * 1. 获取超级聊天室上下文和会话列表
 * 2. 初始化超级API请求函数
 * 3. 创建超级会话设置钩子，负责新会话创建和非流式消息处理
 * 4. 使用聊天核心处理整体聊天流程
 *
 * 与基础版本的区别：
 * - 使用了不同的API端点
 * - 管理更复杂的ID系统（conversationId, tableId, chatId）
 * - 使用了超级聊天解析器，提供更丰富的功能
 *
 * @returns 完整的超级聊天功能接口
 */
export const useChatSuper = (defaultMessages?: XChatConfig<MessageRawSuper, MessageParsedSuper>['defaultMessages']) => {
  // 从超级聊天室上下文获取聊天状态和ID管理函数
  const { chatId, setIsChating, setConversationId } = useChatRoomSuperContext()
  // 获取超级会话列表管理函数
  const { addConversationItem } = useConversationsSuper()
  const isFirstQuestionRef = useRef(false) // 是否是第一次问句重命名标识

  /**
   * 在useChatCore外部创建超级会话设置钩子
   *
   * 该钩子负责：
   * 1. 管理输入内容状态
   * 2. 创建新的超级聊天会话
   * 3. 处理非流式消息
   *
   * 特殊之处：
   * - 使用setSuperId管理更复杂的ID系统
   * - 传递超级会话特有的数据结构
   */
  const { content, setContent, sendAndInitializeConversation } = useConversationSetupSuper(
    // 设置超级ID的回调，包含多个相关ID
    (superIds) => setConversationId(superIds.conversationId),
    // 添加超级会话到列表的回调，当创建新会话时调用
    (conversation) =>
      addConversationItem({
        updateTime: conversation.updateTime,
        conversationId: conversation.id,
        conversationName: conversation.title,
      })
  )

  // 用于存储API响应返回的实体的状态
  const [entities, setEntities] = useState<SessionCompleteResponse[]>()

  // 保存最近的结果，用于取消请求时上报
  const latestResultRef =
    useRef<
      ChatSenderHookResult['sendAndInitializeConversation'] extends (...args: any[]) => Promise<infer R> ? R : never
    >(null)

  // 控制正在进行的请求（用于取消）的引用
  const abortControllerRef = useRef<AbortController | null>(null)
  const abortStreamControllerRef = useRef<AbortController | null>(new AbortController())

  // 配置请求创建器，带有中止信号
  const { create } = createConfiguredXRequest(abortStreamControllerRef.current?.signal)

  /**
   * 取消任何正在进行的聊天请求
   * 这会中止当前请求并更新聊天状态
   */
  const cancelRequest = useCancelChatRequest(
    axiosInstance,
    setIsChating,
    latestResultRef,
    abortStreamControllerRef,
    abortControllerRef,
    isFirstQuestionRef
  )

  /**
   * 创建具有所有必要依赖项的智能体请求处理器
   * 当发送新消息时将调用此函数
   */
  const agentReqFunc = createAgentRequestHandler({
    axiosChat: axiosInstance,
    axiosEntWeb: entWebAxiosInstance,
    setContent,
    setIsChating,
    sendAndInitializeConversation: ({ chatId, message, options, signal, onReciveQuestion }) => {
      return sendAndInitializeConversation({
        axiosInstance,
        chatId,
        message,
        options,
        signal,
        isFirstQuestionRef,
        onReciveQuestion,
      }).then((result) => {
        console.log('🚀 ~ returnsendAndInitializeConversation ~ result:', result)
        // 保存结果引用，以便在取消时使用
        // @ts-expect-error 111
        latestResultRef.current = result
        return result
      })
    },
    entities,
    abortControllerRef,
    abortStreamControllerRef,
    create,
    setEntities,
    isFirstQuestionRef,
    clientType: 'superlist',
    transformerOnStreamSucces: async (message) => {
      if (!message.rawSentence || !message.content) {
        console.error('message.rawSentence or message.content is undefined', message)
        return message
      }
      const questionGuide = await fetchSuperQuestionGuide(message.rawSentence, message.content)
      return {
        ...message,
        questionGuide,
      }
    },
  })

  // 使用请求处理器初始化智能体
  const [agent] = useXAgent<MessageRawSuper>({
    request: agentReqFunc,
  })

  // 使用工厂创建消息解析器
  const parserRef = useRef<NonNullable<XChatConfig<MessageRaw, MessageParsedBase>['parser']>>()

  /**
   * 使用智能体和解析器初始化聊天功能
   * 这提供了消息处理、状态管理和请求触发
   */
  const { onRequest, parsedMessages, setMessages } = useXChat<MessageRawSuper, MessageParsedSuper>({
    agent,
    parser: (message) => {
      if (!parserRef.current) return []
      return parserRef.current(message)
    },
    defaultMessages,
  })

  /**
   * 向聊天发送新的用户消息
   *
   * @param message - 要发送的消息文本
   * @param agentId - 可选的智能体ID，用于定向特定智能体
   * @param think - 可选的思考模式参数
   */
  const sendMessage = useCallback(
    (message: string, agentId?: MessageRaw['agentId'], think?: MessageRaw['think']) => {
      onRequest({ role: 'user', content: message, agentId, chatId, think, status: 'finish' })
    },
    [onRequest, chatId]
  )

  // 使用工厂创建消息解析器，并传入sendMessage
  parserRef.current = useXChatParserSuper(sendMessage)

  // 返回聊天状态和交互功能
  return {
    content, // 当前输入内容
    parsedMessages, // 准备显示的已处理消息
    handleContentChange: setContent, // 更新输入内容
    sendMessage, // 发送新消息功能
    setMessages, // 直接更新消息状态
    cancelRequest, // 取消正在进行的请求
  }
}
