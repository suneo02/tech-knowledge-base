/**
 * Fetch entity information for the given sentence
 */

import { AxiosInstance } from 'axios'
import { requestToChatWithAxios } from 'gel-api'

export const fetchEntities = async (axiosChat: AxiosInstance, rawSentenceID: string) => {
  try {
    const { result } = await requestToChatWithAxios(axiosChat, 'chat/sessionComplete', {
      rawSentenceID,
    })
    return result
  } catch (error) {
    return []
  }
}
