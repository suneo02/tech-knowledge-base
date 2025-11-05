import { AxiosInstance } from 'axios'
import dayjs from 'dayjs'
import { requestToChatWithAxios } from 'gel-api'

/**
 * 创建聊天会话
 * @param message 用户输入的消息
 * @param onAddConversation 添加会话的回调函数
 * @param onSuccess 设置聊天ID的函数
 * @param signal 中止信号
 * @param entityCode 实体代码
 * @returns 处理后的消息结果
 */
export const createChatBase = async (
  axiosInstance: AxiosInstance,
  message: string,
  onAddConversation: (conversation: { id: string; title: string; updateTime: string }) => void,
  onSuccess: (chatId: string) => void,
  signal?: AbortSignal,
  entityCode?: string
) => {
  try {
    const { result } = await requestToChatWithAxios(
      axiosInstance,
      'chat/addChatGroup',
      {
        rawSentence: message,
        ...(entityCode && { entityCode }),
      },
      { signal: signal }
    )
    onAddConversation({
      id: result.chatId,
      title: message,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
    onSuccess(result.chatId)
    return result
  } catch (error) {
    console.error('创建对话失败:', error)
    throw error
  }
}
