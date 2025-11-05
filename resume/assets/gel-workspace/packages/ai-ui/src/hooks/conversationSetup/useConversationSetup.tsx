// 先从useContext 里面获取chatId，如果有的话就获取

import { AxiosInstance } from 'axios'
import { useEffect, useState } from 'react'
import { processNonStreamingMessage } from './helpers'
import { CHAT_CONSTANTS, ChatCreator, ChatSenderHookResult, ChatSenderState } from './types'

export type { ChatSenderHookResult, ChatSenderOptions, ChatSenderRes } from './types'

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
 * @param onTitleSummaryFinish - 刷新会话列表的回调函数，消息处理完成后会调用
 * @param onAddConversation - 添加会话到列表的回调函数，创建新会话时会调用
 * @returns {ChatSenderHookResult} 包含内容管理和消息发送的接口
 */
export const useConversationSetup = (
  axiosInstance: AxiosInstance,
  isDev: boolean,
  // 聊天创建函数
  chatCreator: ChatCreator,
  // 刷新会话列表
  onTitleSummaryFinish: () => void,
  // 客户端类型
  clientType?: 'superlist'
): ChatSenderHookResult => {
  // 初始化状态，包含输入内容、加载文本和加载状态
  const [state, setState] = useState<ChatSenderState>({
    content: '',
    loadingText: '',
    isLoading: false,
  })

  /**
   * 设置加载状态文本
   * 在会话创建和消息分析阶段会显示不同的加载提示
   */
  const setLoadingText = (text: string) => {
    setState((prev) => ({ ...prev, loadingText: text }))
  }

  /**
   * 设置输入框内容
   * 当用户输入或系统需要清空输入框时使用
   */
  const setContent = (content: string) => {
    setState((prev) => ({ ...prev, content }))
  }

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
  const sendAndInitializeConversation: ChatSenderHookResult['sendAndInitializeConversation'] = async ({
    chatId,
    message,
    options,
    isFirstQuestionRef,
    signal,
    onReciveQuestion,
  }) => {
    try {
      // 设置为加载状态
      setState((prev) => ({ ...prev, isLoading: true }))

      let chatIdParsed = chatId || ''

      // 如果没有聊天ID，创建新的会话
      if (!chatId) {
        setLoadingText(CHAT_CONSTANTS.LOADING_TEXT.CREATE)
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
        setLoadingText(CHAT_CONSTANTS.LOADING_TEXT.ANALYSIS)
        return processNonStreamingMessage(
          axiosInstance,
          isDev,
          chatIdParsed,
          message,
          onReciveQuestion,
          options,
          signal,
          onTitleSummaryFinish,
          clientType
        )
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      throw error
    } finally {
      // 无论成功失败，都重置加载状态
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  // 组件卸载时清理状态
  useEffect(() => {
    return () => {
      setState({
        content: '',
        loadingText: '',
        isLoading: false,
      })
    }
  }, [])

  // 返回接口，供外部组件使用
  return {
    content: state.content, // 当前输入内容
    setContent, // 设置输入内容的方法
    sendAndInitializeConversation, // 发送消息的方法
    loadingText: state.loadingText, // 当前加载状态文本
  }
}
