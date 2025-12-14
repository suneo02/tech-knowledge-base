import { AxiosInstance } from 'axios'
import { requestToChatWithAxios } from 'gel-api'

/**
 * 处理标题摘要（异步处理，不阻塞主流程）
 * 该接口仅用于通知后端生成标题，不需要返回值
 * @param chatId 聊天ID
 * @param message 用户消息
 * @param rawSentenceID 原始句子ID
 * @param signal 中止信号
 * @param onTitleSummaryFinish 刷新会话列表的回调函数，标题生成后刷新会话列表
 */
export const processTitleSummary = (
  axiosInstance: AxiosInstance,
  chatId: string,
  message: string,
  rawSentenceID: string,
  signal?: AbortSignal,
  onTitleSummaryFinish?: () => void
) => {
  requestToChatWithAxios(
    axiosInstance,
    'chat/summarizeTitle',
    {
      groupId: chatId,
      rawSentence: message,
      rawSentenceID: rawSentenceID,
    },
    { signal: signal }
  )
    .then((summarizeTitleResult) => {
      // 如果获取到标题摘要，仅刷新会话列表
      if (summarizeTitleResult && onTitleSummaryFinish) {
        // 标题摘要生成后刷新会话列表，让前端获取最新的标题
        onTitleSummaryFinish()
      }
    })
    .catch((error) => {
      console.error('标题摘要失败:', error)
      // 标题摘要失败不影响主流程
    })
}
