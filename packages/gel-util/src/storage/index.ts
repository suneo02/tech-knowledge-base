/*
 * TypeScript Storage Manager
 * -------------------------
 * A unified wrapper for localStorage and sessionStorage with all storage keys listed.
 */
export * from './helper'

import Cookies from 'js-cookie'
import { usedInClient } from '../env/misc'
import {
  CookieStorageKey,
  CookieStorageValueTypes,
  LocalStorageKey,
  LocalStorageValueTypes,
  SessionStorageKey,
  SessionStorageValueTypes,
} from './type'

export { removeAllDeprecatedStorage } from './deprecated'
export { getLocalStorageWithExpiry, setLocalStorageWithExpiry } from './helper'

// 2. Generic interface for storage operations
export interface IStorageService<KeyType extends string, ValueTypes extends Record<KeyType, any>> {
  get<K extends KeyType>(key: K): ValueTypes[K] | null
  set<K extends KeyType>(key: K, value: ValueTypes[K]): void
  remove(key: KeyType): void
  clear(): void
}

// 3. Factory function to create a storage service
function createStorageService<KeyType extends string, ValueTypes extends Record<KeyType, any>>(
  storage: Storage
): IStorageService<KeyType, ValueTypes> {
  return {
    get<K extends KeyType>(key: K): ValueTypes[K] | null {
      try {
        const item = storage.getItem(key)
        return item ? (JSON.parse(item) as ValueTypes[K]) : null
      } catch (e) {
        console.error(e)
        return null
      }
    },

    set<K extends KeyType>(key: K, value: ValueTypes[K]): void {
      try {
        storage.setItem(key, JSON.stringify(value))
      } catch (e) {
        console.error(e)
      }
    },

    remove(key: KeyType): void {
      storage.removeItem(key)
    },

    clear(): void {
      storage.clear()
    },
  }
}

// 4. Export instances
export const localStorageManager = createStorageService<LocalStorageKey, LocalStorageValueTypes>(window.localStorage)
export const sessionStorageManager = createStorageService<SessionStorageKey, SessionStorageValueTypes>(
  window.sessionStorage
)

/**
 * 只在web端使用的存储键
 * 这些 keys 在 终端无法被 set，可以被读取
 * @author suneo
 */
export const onlyInWebKeys: (LocalStorageKey | SessionStorageKey)[] = ['lanxin_auth_code', 'lanxin_terminal']

export const localStorageSafeSet = (key: LocalStorageKey, value: LocalStorageValueTypes[LocalStorageKey]) => {
  /**
   * 如果 key 在 onlyInWebKeys 中，并且 当前为终端环节，则不设置
   */
  if (onlyInWebKeys.includes(key) && usedInClient()) {
    return
  }
  localStorageManager.set(key, value)
}

// Cookie 操作工具
export const cookieManager = {
  get<K extends CookieStorageKey>(key: K): CookieStorageValueTypes[K] | null {
    const value = Cookies.get(key)
    return value !== undefined ? (value as CookieStorageValueTypes[K]) : null
  },
}
