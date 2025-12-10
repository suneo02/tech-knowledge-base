import { CHAT_CONSTANTS } from '@/config'
import { ChatSenderState } from '@/types'
import { useEffect, useState } from 'react'

/**
 * AI聊天发送状态管理钩子
 *
 * 该钩子负责管理聊天发送相关的状态：
 * - content: 输入框内容
 * - loadingText: 加载状态文本
 * - isLoading: 是否处于加载状态
 *
 * 提供了状态更新方法和组件卸载时的状态清理
 *
 * @param maxLength - 输入内容的最大长度限制
 * @returns 状态和状态更新方法
 */
export const useAIChatSendState = (maxLength?: number) => {
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
    if (maxLength && content.length > maxLength) {
      return
    }
    setState((prev) => ({ ...prev, content }))
  }

  /**
   * 设置加载状态
   * 控制是否显示加载指示器
   */
  const setIsLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }))
  }

  /**
   * 重置所有状态到初始值
   * 通常在组件卸载或需要清理状态时使用
   */
  const resetState = () => {
    setState({
      content: '',
      loadingText: '',
      isLoading: false,
    })
  }

  /**
   * 设置创建会话的加载状态
   * 显示创建会话的加载提示
   */
  const setCreatingConversationLoading = () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      loadingText: CHAT_CONSTANTS.LOADING_TEXT.CREATE,
    }))
  }

  /**
   * 设置分析意图的加载状态
   * 显示分析意图的加载提示
   */
  const setAnalyzingLoading = () => {
    setState((prev) => ({
      ...prev,
      loadingText: CHAT_CONSTANTS.LOADING_TEXT.ANALYSIS,
      isLoading: true,
    }))
  }

  /**
   * 清除加载状态
   * 重置加载状态和加载文本
   */
  const clearLoading = () => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      loadingText: '',
    }))
  }

  // 组件卸载时清理状态
  useEffect(() => {
    return () => {
      resetState()
    }
  }, [])

  return {
    // 状态
    content: state.content,
    loadingText: state.loadingText,
    isLoading: state.isLoading,

    // 基础状态更新方法
    setContent,
    setLoadingText,
    setIsLoading,
    resetState,

    // 封装的加载状态方法
    setCreatingConversationLoading,
    setAnalyzingLoading,
    clearLoading,
  }
}
