import { corpInfoApiExecutor } from '@/api/services/corp/baseInfo'
import { CorpBasicInfo } from 'gel-types'
import { ApiResponseForWFC } from 'report-util/types'
import { ApiStore, createApiStore } from './creator/apiStore'

// Corp base info event name
const CORP_BASE_INFO_EVENT = 'rp_corp_base_info_updated'

// Corp base info store type for TypeScript support
interface CorpBaseInfoStore extends ApiStore<CorpBasicInfo, ApiResponseForWFC<CorpBasicInfo>> {}

// Create the corp base info store using ApiStore
const createCorpBaseInfoStore = (): CorpBaseInfoStore => {
  // Create API store with corp base info configuration
  const apiStore = createApiStore<CorpBasicInfo, ApiResponseForWFC<CorpBasicInfo>>({
    // Event name for corp base info updates
    eventName: CORP_BASE_INFO_EVENT,

    // API call implementation
    apiCall: (_options, onSuccess, onError) => {
      corpInfoApiExecutor({
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
export const corpBaseInfoStore = createCorpBaseInfoStore()
