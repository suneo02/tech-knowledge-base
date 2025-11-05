import { wftCommon } from '../../../utils/utils.tsx'
import { getPrefixUrl, handleAppendUrlPath } from '../handle'
import { GELSearchParam } from '../config'

/**
 * 拼接 vip url
 */
export const getVipLinkBySubModule = ({ params, ifOversea, env }) => {
  const baseUrl = new URL(
    getPrefixUrl({
      envParam: env,
    })
  )
  baseUrl.pathname = handleAppendUrlPath(baseUrl.pathname)
  let ifOverseaLocal = ifOversea
  if (ifOversea == null) {
    ifOverseaLocal = wftCommon.is_overseas_config
  }

  if (ifOverseaLocal) {
    baseUrl.hash = '#/versionPriceOversea'
  } else {
    baseUrl.hash = '#/versionPrice'
  }
  baseUrl.search = new URLSearchParams({
    ...params,
    [GELSearchParam.NoSearch]: 1,
  }).toString()

  return baseUrl.toString()
}
