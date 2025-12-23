import { requestToSuperlistFcs } from '@/api/requestFcs'
import dayjs from 'dayjs'
import { ApiCodeForWfc } from 'gel-api'

/**
 * 创建聊天会话
 * @param message 用户输入的消息
 * @param onAddConversation 添加会话的回调函数
 * @param onSuccess 设置 会话 id ，table id，对话 id
 * @param signal 中止信号
 * @returns 处理后的消息结果
 */
export const createChatSuper = async (
  message: string,
  onAddConversation: (conversation: { id: string; title: string; updateTime: string }) => void,
  onSuccess: ({ conversationId, tableId, chatId }: { conversationId: string; tableId: string; chatId: string }) => void,
  signal?: AbortSignal
) => {
  try {
    // TODO super list 创建会话不同
    const result = await requestToSuperlistFcs(
      'conversation/addConversation',
      { conversationType: 'AI_CHAT', rawSentence: message },
      { signal: signal }
    )
    if (!result || result.ErrorCode !== ApiCodeForWfc.SUCCESS) {
      console.error('创建对话失败:', result.ErrorMessage)
      return
    }
    const data = result?.Data?.data
    if (data) {
      onAddConversation({
        id: data?.conversationId,
        title: message,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })

      onSuccess({
        conversationId: data?.conversationId,
        tableId: data?.tableId,
        chatId: data?.chatId,
      })
    }
    return data
  } catch (error) {
    console.error('创建对话失败:', error)
    throw error
  }
}
