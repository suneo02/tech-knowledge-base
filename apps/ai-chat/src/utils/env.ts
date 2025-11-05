import { getMainEnv } from '@/config/env'
import { getWSID } from 'gel-util/env'

export const MODE = import.meta.env.MODE
export const isDev = MODE === 'development'
export const isProd = MODE === 'production'

export const getWsidDevProd = () => {
  return isDev ? getMainEnv().sessionId : getWSID(isDev)
}
