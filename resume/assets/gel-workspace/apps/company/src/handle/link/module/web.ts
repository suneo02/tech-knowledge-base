import { GELSearchParam } from '../config'
import { getPrefixUrl } from '@/handle/link/handle/prefixUrl.ts'

/**
 * 拼接 vip url
 */
export const getWebLinkBySubModule = ({ params, url }) => {
  const baseUrl = new URL(
    getPrefixUrl({
      isLoginIn: true,
    }) + url
  )
  baseUrl.search = new URLSearchParams({
    ...params,
    [GELSearchParam.NoSearch]: 1,
  }).toString()

  return baseUrl.toString()
}
