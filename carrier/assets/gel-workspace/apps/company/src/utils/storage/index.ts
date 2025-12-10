/*
 * TypeScript Storage Manager
 * -------------------------
 * A unified wrapper for localStorage and sessionStorage with all storage keys listed.
 */
import {
  cookieManager as cookieManagerFromUtil,
  localStorageManager as localStorageManagerFromUtil,
  localStorageSafeSet as localStorageSafeSetFromUtil,
  sessionStorageManager as sessionStorageManagerFromUtil,
} from 'gel-util/storage'

// 4. Export instances
export const localStorageManager = localStorageManagerFromUtil
export const sessionStorageManager = sessionStorageManagerFromUtil

export const localStorageSafeSet = localStorageSafeSetFromUtil
// Cookie 操作工具
export const cookieManager = cookieManagerFromUtil
