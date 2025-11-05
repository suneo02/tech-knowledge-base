import { AxiosInstance } from 'axios'
import { ApiResponseForChat, GetUserQuestionResponse, requestToChatWithAxios } from 'gel-api'

/**
 * 问句拆解
 * @param rawSentence 原始用户输入
 * @param rawSentenceID 原始句子ID
 * @param signal 中止信号
 * @returns 拆解后的问题数组
 */
export const questionDisassembly = async (
  axiosInstance: AxiosInstance,
  rawSentence: string,
  rawSentenceID: string,
  signal?: AbortSignal
): Promise<ApiResponseForChat<GetUserQuestionResponse>> => {
  try {
    return await requestToChatWithAxios(
      axiosInstance,
      'chat/getUserQuestion',
      {
        version: 3,
        rawSentence,
        rawSentenceID,
      },
      {
        signal: signal,
      }
    )
  } catch (error) {

    throw error
  }
}
