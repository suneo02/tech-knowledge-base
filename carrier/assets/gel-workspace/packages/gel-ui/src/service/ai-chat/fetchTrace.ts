import { AxiosInstance } from 'axios'
import { ChatTraceItem, requestToChatWithAxios } from 'gel-api'

/**
 * Fetch entity information for the given sentence
 */

export const fetchTrace = async (axiosChat: AxiosInstance, rawSentenceID: string): Promise<ChatTraceItem[]> => {
  try {
    console.log('🚀 ~ fetchTrace ~ rawSentenceID:', rawSentenceID)
    const { Data } = await requestToChatWithAxios(axiosChat, 'chat/trace', {
      rawSentenceID,
    })
    if (!Data || !Array.isArray(Data)) {
      return []
    }
    console.log('🚀 ~ fetchTrace ~ result:', Data)
    return Data
  } catch (error) {
    console.error('🚀 ~ fetchTrace ~ error:', error)
    return []
  }
}
