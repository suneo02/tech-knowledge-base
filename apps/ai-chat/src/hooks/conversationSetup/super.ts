import { axiosInstance } from '@/api/axios'
import { useChatRoomSuperContext } from '@/contexts/ChatRoom/super'
import { isDev } from '@/utils/env'
import { message as messageApi } from '@wind/wind-ui'
import { ChatCreator, ConversationSetupHookResult, useConversationSetup } from 'gel-ui'
import { useNavigateWithLangSource } from '@/hooks/useLangSource'
import { createChatSuper } from './helpers'

/**
 * 超级聊天会话设置钩子
 *
 * 该钩子是useConversationSetup的高级实现，用于超级聊天场景。
 * 它主要负责：
 * 1. 创建超级聊天会话
 * 2. 管理更复杂的聊天状态（包括conversationId、tableId和chatId）
 * 3. 处理非流式消息
 *
 * 适用于需要更多功能的高级AI聊天场景。
 *
 * @param setSuperId - 设置超级ID的回调函数，包含conversationId、tableId和chatId
 * @param onTitleSummaryFinish - 刷新会话列表的回调函数
 * @param onAddConversation - 添加会话到列表的回调函数
 *
 * @returns {ConversationSetupHookResult} 包含内容管理和消息发送的接口
 */
export const useConversationSetupSuper = (
  setSuperId: ({
    conversationId,
    tableId,
    chatId,
  }: {
    conversationId: string
    tableId: string
    chatId: string
  }) => void,
  onAddConversation: (conversation: { id: string; title: string; updateTime: string }) => void
): ConversationSetupHookResult => {
  const navigate = useNavigateWithLangSource()
  const { setTableId, setChatId, updateRoomId, setConversationId } = useChatRoomSuperContext()

  // 创建超级聊天会话创建器
  const chatCreator: ChatCreator = async (message, signal) => {
    const result = await createChatSuper(message, onAddConversation, setSuperId, signal)
    if (result?.conversationId) {
      // 先设置所有状态
      setTableId(result?.tableId)
      setChatId(result?.chatId)
      setConversationId(result?.conversationId)
      // 使用统一的状态更新方法
      // TODO 此逻辑应该有问题
      updateRoomId(result?.conversationId)

      // 使用同步URL方法更新URL而不触发路由重渲染
      // 超级名单不会走到这个逻辑，创建会话会在外部中创建好
      // TODO 待优化
      navigate(`/super/chat/${result.conversationId}`, { replace: true })
    } else {
      messageApi.error('创建会话失败')
    }
    return { chatId: result?.chatId }
  }

  // 使用通用的会话设置钩子
  return useConversationSetup(axiosInstance, {
    isDev,
    chatCreator, // 刷新超级会话列表的回调，获取最新会话数据
    clientType: 'superlist',
    splVersion: 1,
  })
}
