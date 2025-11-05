import { useChatRoomContext, useConversationsBase } from '@/context'
import { MessageParsedBase, MessageRaw } from '@/types/message'
import { createConfiguredXRequest } from '@/util'
import { useXAgent } from '@ant-design/x'
import useXChat, { XChatConfig } from '@ant-design/x/es/use-x-chat'
import { useRequest } from 'ahooks'
import { AxiosInstance } from 'axios'
import { createChatRequestWithAxios, SessionCompleteResponse } from 'gel-api'
import { useCallback, useRef, useState } from 'react'
import { useConversationSetupBase } from '../conversationSetup'
import { ChatSenderHookResultForStream, ChatSenderRes } from '../conversationSetup/types'
import { createAgentRequestHandler } from './helpers/agentRequestHandler'
import { useCancelChatRequest } from './helpers/cancelChatRequest'
import { useXChatParser } from './XChatParser/base'

/**
 * 基础聊天钩子实现，使用标准聊天解析器
 * 完整的基础聊天功能实现，集成了：
 * - 聊天室上下文管理
 * - 会话列表管理
 * - 会话初始化和设置
 * - 消息处理和交互
 *
 * 处理流程：
 * 1. 获取聊天室上下文和会话列表
 * 2. 初始化API请求函数
 * 3. 创建会话设置钩子，负责新会话创建和非流式消息处理
 * 4. 使用聊天核心来处理整体聊天流程
 *
 * @returns 完整的聊天功能接口
 */
export const useChatBase = (
  axiosChat: AxiosInstance,
  axiosEntWeb: AxiosInstance,
  isDev: boolean,
  wsid: string,
  baseUrl: string,
  defaultMessages?: XChatConfig<MessageRaw, MessageParsedBase>['defaultMessages'],
  roleName?: string,
  entityCode?: string
) => {
  // 从聊天室上下文获取聊天状态和ID管理函数
  const { chatId, setChatId, setIsChating } = useChatRoomContext()
  // 获取会话列表管理函数
  const { addConversationItem, updateConversationsItems } = useConversationsBase()
  const isFirstQuestionRef = useRef(false) // 是否是第一次问句重命名标识

  const requestFuncBase = createChatRequestWithAxios(axiosChat, 'selectChatAIConversation')
  // 初始化API请求，用于获取会话列表
  const { run } = useRequest<Awaited<ReturnType<typeof requestFuncBase>>, Parameters<typeof requestFuncBase>>(
    requestFuncBase,
    {
      onError: console.error,
      onSuccess: (res) => {
        if (res && res.Data) {
          updateConversationsItems(res.Data)
        }
      },
      manual: true,
    }
  )

  // 刷新会话列表的回调
  const onRefresh = () => {
    run({
      pageIndex: 1,
      pageSize: 20,
    })
  }

  /**
   * 在useChatCore外部创建会话设置钩子
   *
   * 该钩子负责：
   * 1. 管理输入内容状态
   * 2. 创建新的聊天会话
   * 3. 处理非流式消息
   *
   * 这里提供了三个重要回调：
   * - setChatId: 设置聊天ID的回调
   * - onRefresh: 刷新会话列表的回调
   * - onAddConversation: 添加会话到列表的回调
   */
  const { content, setContent, sendAndInitializeConversation } = useConversationSetupBase(
    axiosChat,
    isDev,
    // 设置聊天ID的回调
    setChatId,
    // 添加会话到列表的回调，当创建新会话时调用
    (conversation) =>
      addConversationItem({
        questionsNum: 1,
        updateTime: conversation.updateTime,
        groupId: conversation.id,
        questions: conversation.title,
      } as any),
    entityCode
  )

  // 用于存储API响应返回的实体的状态
  const [entities, setEntities] = useState<SessionCompleteResponse[]>()

  // 保存最近的结果，用于取消请求时上报
  const latestResultRef = useRef<ChatSenderRes | null>(null)

  // 控制正在进行的请求（用于取消）的引用
  const abortControllerRef = useRef<AbortController | null>(null)
  const abortStreamControllerRef = useRef<AbortController | null>(null)

  // 配置请求创建器，带有中止信号
  const { create } = createConfiguredXRequest(() => abortStreamControllerRef.current?.signal, wsid, baseUrl)

  /**
   * 取消任何正在进行的聊天请求
   * 这会中止当前请求并更新聊天状态
   */
  const cancelRequest = useCancelChatRequest(
    axiosChat,
    setIsChating,
    latestResultRef,
    abortStreamControllerRef,
    abortControllerRef,
    isFirstQuestionRef,
    onRefresh
  )

  const sendAndInitLocal: ChatSenderHookResultForStream['sendAndInitializeConversation'] = ({
    chatId,
    message,
    options,
    signal,
    onReciveQuestion,
  }) => {
    return sendAndInitializeConversation({
      axiosInstance: axiosChat,
      chatId,
      message,
      options,
      isFirstQuestionRef,
      signal,
      onReciveQuestion,
    }).then((result) => {
      console.log('🚀 ~ returnsendAndInitializeConversation ~ result:', result)
      // 保存结果引用，以便在取消时使用
      if (result) latestResultRef.current = result
      return result
    }).catch((error) => {
      console.error('sendAndInitializeConversation 异步错误:', error)
      // 保存错误信息，用于后续处理
      latestResultRef.current = null
      throw error
    })
  }

  /**
   * 创建具有所有必要依赖项的智能体请求处理器
   * 当发送新消息时将调用此函数
   */
  const agentReqFunc = createAgentRequestHandler({
    axiosChat,
    axiosEntWeb,
    setContent,
    setIsChating,
    sendAndInitializeConversation: sendAndInitLocal,
    entities,
    abortControllerRef,
    abortStreamControllerRef,
    create,
    setEntities,
    isFirstQuestionRef,
    onRefresh,
  })

  // 使用请求处理器初始化智能体
  const [agent] = useXAgent<MessageRaw>({
    request: agentReqFunc,
  })

  /**
   * 使用智能体和解析器初始化聊天功能
   * 这提供了消息处理、状态管理和请求触发
   */
  const parserRef = useRef<NonNullable<XChatConfig<MessageRaw, MessageParsedBase>['parser']>>()

  const { onRequest, parsedMessages, setMessages } = useXChat<MessageRaw, MessageParsedBase>({
    // @ts-expect-error ttt
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
   * @param options - 可选的额外参数，如实体类型和名称
   */
  const sendMessage = useCallback(
    (
      message: string,
      agentId?: MessageRaw['agentId'],
      think?: MessageRaw['think'],
      options?: { entityType?: string; entityName?: string }
    ) => {
      onRequest({
        role: 'user',
        content: message,
        agentId,
        chatId,
        think,
        status: 'finish',
        entityType: options?.entityType,
        entityName: options?.entityName,
      })
    },
    [onRequest, chatId]
  )

  // 使用工厂创建消息解析器，并传入sendMessage
  parserRef.current = useXChatParser(axiosChat, axiosEntWeb, sendMessage, roleName)

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
