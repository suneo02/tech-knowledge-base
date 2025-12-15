// 先从useContext 里面获取chatId，如果有的话就获取

import { processNonStreamingMessage } from '@/service'
import { ChatCreator, ConversationSetupHookResult } from '@/types'
import { AxiosInstance } from 'axios'
import { ChatClientType } from 'gel-api'
import { useAIChatSendState } from './useAIChatSendState'

type UseConversationSetupOptions = {
  isDev: boolean
  // 聊天创建函数
  chatCreator: ChatCreator
  // 客户端类型
  clientType?: ChatClientType
  splVersion?: number // 耿坤元要加的
  getUserQuestionInterval?: number
}
/**
 * 会话设置钩子 - 负责初始化聊天会话和处理非流式消息
 *
 * 该钩子主要完成两项核心功能：
 * 1. 如果没有聊天ID，负责创建新的聊天会话
 * 2. 发送并处理非流式消息（不包含流式输出处理）
 *
 * 内部维护了三个状态：
 * - content: 输入框内容
 * - loadingText: 加载状态文本
 * - isLoading: 是否处于加载状态
 *
 * 当组件卸载时会清理这些状态。
 *
 * @param chatCreator - 创建新聊天会话的函数，当没有chatId时会调用此函数
 * @param onAddConversation - 添加会话到列表的回调函数，创建新会话时会调用
 * @returns {ConversationSetupHookResult} 包含内容管理和消息发送的接口
 */
export const useConversationSetup = (
  axiosInstance: AxiosInstance,
  options: UseConversationSetupOptions,
  maxLength?: number
): ConversationSetupHookResult => {
  const { isDev, chatCreator, clientType, splVersion, getUserQuestionInterval } = options

  // 使用拆分出来的状态管理 hook
  const { content, loadingText, setContent, setCreatingConversationLoading, setAnalyzingLoading, clearLoading } =
    useAIChatSendState(maxLength)

  /**
   * 发送消息的核心方法
   *
   * 处理流程：
   * 1. 设置加载状态
   * 2. 如果没有chatId，先创建会话
   * 3. 调用processNonStreamingMessage处理非流式消息
   * 4. 处理完成后重置加载状态
   *
   * @param chatId - 聊天ID，如果为空则会创建新会话
   * @param message - 用户输入的消息内容
   * @param options - 附加选项，如角色ID等
   * @param signal - 中止信号，用于取消请求
   * @param onReciveQuestion - 接收拆解后问题的回调函数
   * @returns 消息处理的结果
   */
  const sendAndInitializeConversation: ConversationSetupHookResult['sendAndInitializeConversation'] = async ({
    chatId,
    message,
    options,
    isFirstQuestionRef,
    signal,
    onReciveQuestion,
  }) => {
    try {
      let chatIdParsed = chatId || ''

      // 如果没有聊天ID，创建新的会话
      if (!chatId) {
        setCreatingConversationLoading()
        const result = await chatCreator(message, signal)
        isFirstQuestionRef.current = true
        if (result?.chatId) {
          chatIdParsed = result.chatId
        } else {
          console.error('创建会话失败:', result)
        }
      } else {
        isFirstQuestionRef.current = false
      }

      // 有效的聊天ID，处理非流式消息
      if (chatIdParsed) {
        setAnalyzingLoading()
        return processNonStreamingMessage(
          axiosInstance,
          {
            isDev,
            chatId: chatIdParsed,
            message,
            onReciveQuestion,
            signal,
            clientType,
            splVersion,
            getUserQuestionInterval,
          },
          options
        )
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      throw error
    } finally {
      // 无论成功失败，都重置加载状态
      clearLoading()
    }
  }

  // 返回接口，供外部组件使用
  return {
    content, // 当前输入内容
    setContent, // 设置输入内容的方法
    sendAndInitializeConversation, // 发送消息的方法
    loadingText, // 当前加载状态文本
  }
}
