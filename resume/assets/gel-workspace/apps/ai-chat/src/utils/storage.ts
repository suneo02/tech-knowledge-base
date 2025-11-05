import { EnvConfigItemProps } from '@/config/env'
import { CDEFilterCategory } from 'gel-api'
import { MessageRaw } from 'ai-ui'

/**
 * Storage 的 key 定义
 */
export interface LocalStorageKeys {
  wsid: string
  lan: string
  mainEnv: EnvConfigItemProps
  devEnv: EnvConfigItemProps
  /**
   * 这个 key 不能随意改！，有别的应用靠这个传递消息
   */
  chat_initial_message:
    | string
    | {
        message: string
        think?: MessageRaw['think']
      }

  // TODO: 添加具体的 key
  // 示例:
  // 'user-info': UserInfo
  // 'settings': AppSettings
  [key: string]: unknown
}

export interface SessionStorageKeys {
  CDE_DATA: {
    columns: {
      field: string
      title: string
    }[]
    data: {
      [key: string]: string
    }[]
  }
  CDE_FILTER_CATEGORIES: CDEFilterCategory[]
  // TODO: 添加具体的 key
  // 示例:
  // 'token': string
  // 'temp-data': TempData
  [key: string]: unknown
}

/**
 * Storage 操作对象类型
 */
type StorageOperations<T extends Record<string, unknown>> = {
  get<K extends keyof T>(key: K): T[K] | null
  set<K extends keyof T>(key: K, value: T[K]): void
  remove(key: keyof T): void
  clear(): void
}

/**
 * 创建存储操作对象
 */
const createStorage = <T extends Record<string, unknown>>(storage: Storage): StorageOperations<T> => ({
  get<K extends keyof T>(key: K): T[K] | null {
    try {
      const value = storage.getItem(String(key))
      if (!value) return null

      // If the value starts and ends with quotes, it's likely a stored string
      // Remove the quotes and return as is
      if (value.startsWith('"') && value.endsWith('"')) {
        return JSON.parse(value) as T[K]
      }

      try {
        return JSON.parse(value) as T[K]
      } catch {
        // If JSON.parse fails, return the raw value
        return value as T[K]
      }
    } catch (error) {
      console.error('Storage get error:', key, storage.getItem(String(key)), error)
      return null
    }
  },

  set<K extends keyof T>(key: K, value: T[K]): void {
    try {
      storage.setItem(String(key), JSON.stringify(value))
    } catch (error) {
      console.error('Storage set error:', error)
    }
  },

  remove(key: keyof T): void {
    storage.removeItem(String(key))
  },

  clear(): void {
    storage.clear()
  },
})

/**
 * localStorage 操作封装
 */
export const local = createStorage<LocalStorageKeys>(localStorage)

/**
 * sessionStorage 操作封装
 */
export const session = createStorage<SessionStorageKeys>(sessionStorage)
