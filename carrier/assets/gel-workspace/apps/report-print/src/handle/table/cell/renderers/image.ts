import { createCompanyTableLogo } from '@/comp/misc/image'
import { getWsid } from '@/utils/env'
import { ConfigTableCellJsonConfig } from 'gel-types'
import { getImageUrl } from 'report-util/misc'

export const renderImage = (value: any, _record: any, options?: ConfigTableCellJsonConfig['renderConfig']) => {
  const url = getImageUrl(options.imageTableId, value, getWsid())
  return createCompanyTableLogo(url, undefined, undefined, options.imageRenderType)
}
