import { getWsidProd } from 'gel-util/env'

export const MODE = import.meta.env.MODE
export const isDev = MODE === 'development'
export const isProd = MODE === 'production'
export const isStaging = MODE === 'staging'

export const getWsidDevProd = () => {
  let wsid = getWsidProd()
  if (wsid) {
    return wsid
  }
  return ''
}
