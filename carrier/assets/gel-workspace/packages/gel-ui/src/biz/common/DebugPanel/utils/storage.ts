import { WindSessionHeader } from 'gel-util/env'

export type DevLocalStorageKey = typeof WindSessionHeader | 'GEL_API_PREFIX_DEV'

export const loaclDevManager = {
  get(key: DevLocalStorageKey) {
    return localStorage.getItem(key)
  },
  set(key: DevLocalStorageKey, value: string) {
    localStorage.setItem(key, value)
  },
  remove(key: DevLocalStorageKey) {
    localStorage.removeItem(key)
  },
}
