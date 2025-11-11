import { AxiosInstance } from 'axios'
import { ChatCreator, ConversationSetupHookResult, createChatCore, useConversationSetup } from 'gel-ui'

/**
 * 基础聊天会话设置钩子
 *
 * 该钩子是useConversationSetup的特定实现，用于基础聊天场景。
 * 它主要负责：
 * 1. 创建基础聊天会话
 * 2. 管理聊天状态
 * 3. 处理非流式消息
 *
 * 适用于普通的AI聊天场景。
 *
 * @param setChatId - 设置聊天ID的回调函数，创建会话后会设置该ID
 * @param onTitleSummaryFinish - 刷新会话列表的回调函数
 * @param onAddConversation - 添加会话到列表的回调函数
 * @param entityCode - 实体代码
 * @returns {ConversationSetupHookResult} 包含内容管理和消息发送的接口
 */

export const useConversationSetupBase = (
  axiosInstance: AxiosInstance,
  isDev: boolean,
  setChatId: (chatId: string) => void,
  onAddConversation: (conversation: { id: string; title: string; updateTime: string }) => void,
  entityCode?: string
): ConversationSetupHookResult => {
  // 创建基础聊天会话创建器
  const chatCreator: ChatCreator = async (message, signal) => {
    const result = await createChatCore(axiosInstance, message, onAddConversation, setChatId, signal, entityCode)
    return result
  }

  // 使用通用的会话设置钩子
  return useConversationSetup(axiosInstance, {
    isDev,
    chatCreator, // 刷新会话列表的回调，获取最新会话数据
  })
}
