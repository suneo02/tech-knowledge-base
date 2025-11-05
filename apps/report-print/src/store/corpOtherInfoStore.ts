import { corpOtherInfoApiExecutor } from '@/api/services/corp/baseInfo'
import { ApiResponseForWFC } from '@/api/types/response'
import { CorpOtherInfo } from 'gel-types'
import { ApiStore, createApiStore } from './creator/apiStore'

// Corp base info event name
const CORP_OTHER_INFO_EVENT = 'rp_corp_other_info_updated'

// Corp base info store type for TypeScript support
interface CorpOtherInfoStore extends ApiStore<CorpOtherInfo, ApiResponseForWFC<CorpOtherInfo>> {}

// Create the corp base info store using ApiStore
const createCorpOtherInfoStore = (): CorpOtherInfoStore => {
  // Create API store with corp base info configuration
  const apiStore = createApiStore<CorpOtherInfo, ApiResponseForWFC<CorpOtherInfo>>({
    // Event name for corp base info updates
    eventName: CORP_OTHER_INFO_EVENT,

    // API call implementation
    apiCall: (_options, onSuccess, onError) => {
      corpOtherInfoApiExecutor({
        success: onSuccess,
        error: onError,
      })
    },

    // Data processing function
    processData: (data) => {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data

      return parsedData?.Data || null
    },
  })

  // Return extended store with corp base info specific functionality
  return {
    ...apiStore,
  }
}

// Export singleton instance
export const corpOtherInfoStore = createCorpOtherInfoStore()
