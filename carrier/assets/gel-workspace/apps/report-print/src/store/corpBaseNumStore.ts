import {
  corpBasicNumApiExecutor,
  corpPatentBasicNumApiExecutor,
  corpTrademarkBasicNumApiExecutor,
} from '@/api/services/corp/baseInfo'
import { CorpBasicNumFront } from 'gel-types'
import { mergeCorpBasicNum } from 'report-util/misc'
import { ApiResponseForWFC } from 'report-util/types'
import { ApiStore, createApiStore } from './creator/apiStore'

// Corp base info event name
const CORP_BASE_NUM_EVENT = 'rp_corp_base_num_updated'

// Corp base info store type for TypeScript support
interface CorpBaseNumStore extends ApiStore<Partial<CorpBasicNumFront>, any> {}

// Create the corp base info store using ApiStore
const createCorpBaseNumStore = (): CorpBaseNumStore => {
  // Create API store with corp base info configuration
  const apiStore = createApiStore<Partial<CorpBasicNumFront>, any>({
    // Event name for corp base info updates
    eventName: CORP_BASE_NUM_EVENT,

    // API call implementation
    apiCall: (_options, onSuccess, onError) => {
      let basicNumData: ApiResponseForWFC<CorpBasicNumFront> | null = null
      let patentNumData: ApiResponseForWFC<CorpBasicNumFront> | null = null
      let trademarkNumData: ApiResponseForWFC<CorpBasicNumFront> | null = null
      let requestsFinished = 0
      let hasError = false
      const totalRequests = 3

      const handleFinish = () => {
        requestsFinished++
        if (requestsFinished === totalRequests && !hasError) {
          onSuccess({ basicNumData, patentNumData, trademarkNumData })
        }
      }

      const handleError = (error: any) => {
        if (!hasError) {
          hasError = true
          onError(error)
        }
      }

      corpBasicNumApiExecutor({
        success: (data) => {
          basicNumData = typeof data === 'string' ? JSON.parse(data) : data
        },
        error: handleError,
        finish: handleFinish,
      })

      corpPatentBasicNumApiExecutor({
        success: (data) => {
          patentNumData = typeof data === 'string' ? JSON.parse(data) : data
        },
        error: handleError,
        finish: handleFinish,
      })

      corpTrademarkBasicNumApiExecutor({
        success: (data) => {
          trademarkNumData = typeof data === 'string' ? JSON.parse(data) : data
        },
        error: handleError,
        finish: handleFinish,
      })
    },

    // Data processing function
    processData: (data) => {
      return mergeCorpBasicNum(data.basicNumData?.Data, data.patentNumData?.Data, data.trademarkNumData?.Data)
    },
  })

  // Return extended store with corp base info specific functionality
  return {
    ...apiStore,
  }
}

// Export singleton instance
export const corpBaseNumStore = createCorpBaseNumStore()
