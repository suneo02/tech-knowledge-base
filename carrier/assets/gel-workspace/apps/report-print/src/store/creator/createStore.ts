//==============================================================================
// BASE STORE - Common functionality for all store types
//==============================================================================

import { eventBus } from '../eventBus'

/**
 * Basic store interface defining common store methods
 */
export interface Store<T = any> {
  // Data methods
  getData: () => T | null
  updateData: (newData: T) => void
  clearData: () => void
  updateField: (field: keyof T, value: T[keyof T]) => void
  // Event methods
  eventName: string
  subscribe: (listener: (data: T) => void) => void
  unsubscribe: (listener: (data: T) => void) => void
}

/**
 * Configuration for creating a basic store
 */
export interface StoreConfig<T = any> {
  eventName: string
  initialData?: T | null
}

/**
 * Create a simple data store for state management with event bus integration
 */
export function createStore<T = Record<string, any>>(config: StoreConfig<T>): Store<T> {
  // Private state
  let data: T | null = config.initialData ?? null

  // Trigger event when data changes
  const emitUpdate = (newData: T): void => {
    try {
      eventBus.trigger(config.eventName, newData)
    } catch (e) {
      console.warn('Error triggering event:', e)
    }
  }

  // Return public API
  return {
    // Get current data
    getData: () => data,

    // Update data and notify listeners
    updateData: (newData: T) => {
      data = newData
      emitUpdate(newData)
    },

    updateField: (field: keyof T, value: T[keyof T]) => {
      data = { ...data, [field]: value }
      emitUpdate(data)
    },

    // Clear the data
    clearData: () => {
      data = null
    },

    // Event name for external listeners
    eventName: config.eventName,

    // Subscribe to data updates using eventBus
    subscribe: (listener) => {
      eventBus.on(config.eventName, listener)
    },

    // Unsubscribe from data updates
    unsubscribe: (listener) => {
      eventBus.off(config.eventName, listener)
    },
  }
}
