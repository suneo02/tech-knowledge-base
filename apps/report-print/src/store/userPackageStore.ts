import { requestWfcSecure } from '@/api/services/wfcSecure'
import { ApiResponseForWFC } from '@/api/types/response'
import { UserPackageFlags, UserPackageInfo } from 'gel-types'
import { parseUserPackageInfo } from 'report-util/misc'
import { ApiStore, createApiStore } from './creator/apiStore'

// User package information event name
const USER_INFO_EVENT = 'rp_user_info_updated'

// User package store type for TypeScript support
interface UserPackageStore extends ApiStore<UserPackageFlags, ApiResponseForWFC<UserPackageInfo>> {}

// Create the user package store using ApiStore
const createUserPackageStore = (): UserPackageStore => {
  // Create API store with userPackage configuration
  const apiStore = createApiStore<UserPackageFlags, ApiResponseForWFC<UserPackageInfo>>({
    // Event name for user package updates
    eventName: USER_INFO_EVENT,

    // API call implementation
    apiCall: (_options, onSuccess, onError) => {
      requestWfcSecure('getuserpackageinfo', {
        success: onSuccess,
        error: onError,
      })
    },

    // Data processing function
    processData: (data) => {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data

      return parseUserPackageInfo(parsedData?.Data)
    },
  })

  // Return extended store with user package specific functionality
  return {
    ...apiStore,
  }
}

// Export singleton instance
export const userPackageStore = createUserPackageStore()
