/**
 * Fetch entity information for the given sentence
 */

import { AxiosInstance } from 'axios'
import { requestToChatWithAxios } from 'gel-api'

export const fetchEntities = async (axiosChat: AxiosInstance, rawSentenceID: string) => {
  console.log('🚀 ~ fetchEntities ~ rawSentenceID, text:', rawSentenceID)
  try {
    const { result } = await requestToChatWithAxios(axiosChat, 'chat/sessionComplete', {
      rawSentenceID,
    })
    console.log('🚀 ~ fetchEntities ~ result:', result)
    return result
  } catch (error) {
    console.error('🚀 ~ fetchEntities ~ error:', error)
    return []
  }
}
