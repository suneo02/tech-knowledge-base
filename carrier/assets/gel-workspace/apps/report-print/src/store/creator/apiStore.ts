//==============================================================================
// API STORE - Extended store with API handling capabilities
//==============================================================================

import { Store, createStore } from './createStore'

/**
 * API store interface with API-specific methods
 */
export interface ApiStore<T = any, R = any> extends Store<T> {
  // Additional API methods
  fetchData: (options?: any, callback?: (data: T | null, error?: any) => void) => void
  getRawData: () => R | null
  isLoading: () => boolean
  init: (options?: any) => void
}

/**
 * Configuration for creating an API store
 */
export interface ApiStoreConfig<T = any, R = any> {
  eventName: string
  apiCall: (options: any, onSuccess: (data: R) => void, onError: (error: any) => void) => void
  processData?: (data: R) => T
  initialData?: T | null
}

/**
 * Create an API-connected store with data fetching, caching, and processing
 * Uses the basic store for state management and extends it with API capabilities
 */
export function createApiStore<T = any, R = any>(config: ApiStoreConfig<T, R>): ApiStore<T, R> {
  // Create the base store with the same config
  const baseStore = createStore<T>({
    eventName: config.eventName,
    initialData: config.initialData,
  })

  // Private state for API-specific data
  let rawData: R | null = null
  let loading = false

  // Process response data
  const processResponse = (responseData: R): T => {
    return config.processData ? config.processData(responseData) : (responseData as unknown as T)
  }

  // Execute callback safely
  const safeCallback = (callback: Function | undefined, ...args: any[]): void => {
    if (typeof callback === 'function') {
      try {
        callback(...args)
      } catch (e) {
        console.warn('Error in callback:', e)
      }
    }
  }

  // Original clearData function from base store
  const originalClearData = baseStore.clearData

  // Return API store with extended functionality
  return {
    // Reuse all base store methods
    ...baseStore,

    // Override clearData to also clear rawData
    clearData: () => {
      originalClearData()
      rawData = null
    },

    // API-specific methods
    fetchData: (options = {}, callback) => {
      // Use cache if available and not forcing refresh
      if (baseStore.getData() && !options.forceRefresh) {
        safeCallback(callback, baseStore.getData())
        return
      }

      // Don't start a new request if one is in progress
      if (loading) return

      loading = true

      // Make API call
      config.apiCall(
        options,
        (responseData) => {
          loading = false

          try {
            // Process and cache the data
            rawData = responseData
            const processedData = processResponse(responseData)

            // Use base store to update data and trigger events
            baseStore.updateData(processedData)

            // Execute callback
            safeCallback(callback, processedData)
          } catch (e) {
            console.warn('Error processing data:', e)
            safeCallback(callback, null, e)
          }
        },
        (error) => {
          loading = false
          console.warn('API request failed:', JSON.stringify(error))
          safeCallback(callback, null, error)
        }
      )
    },

    getRawData: () => rawData,

    isLoading: () => loading,

    init: (options = {}) => {
      if (baseStore.getData()) return // Don't initialize if we already have data

      config.apiCall(
        options,
        (responseData) => {
          try {
            rawData = responseData
            const processedData = processResponse(responseData)
            baseStore.updateData(processedData)
          } catch (e) {
            console.warn('Error initializing store:', e)
          }
        },
        (error) => {
          console.warn('Error initializing store:', JSON.stringify(error))
        }
      )
    },
  }
}
