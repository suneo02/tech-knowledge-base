import { AxiosInstance } from 'axios'
import { GetUserQuestionRequest, requestToChatWithAxios } from 'gel-api'

/**
 * 问句拆解
 * @param rawSentence 原始用户输入
 * @param rawSentenceID 原始句子ID
 * @param signal 中止信号
 * @returns 拆解后的问题数组
 */
export const getUserQuestion = async (
  axiosInstance: AxiosInstance,
  params: GetUserQuestionRequest,
  signal?: AbortSignal
) => {
  return await requestToChatWithAxios(
    axiosInstance,
    'chat/getUserQuestion',
    {
      version: 3,
      ...params,
    },
    {
      signal: signal,
    }
  )
}
