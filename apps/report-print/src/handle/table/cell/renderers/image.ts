import { createCompanyTableLogo } from '@/comp/misc/image'
import { getImageUrl } from '@/utils/misc/imageBase'
import { ConfigTableCellJsonConfig } from 'gel-types'

export const renderImage = (value: any, _record: any, options?: ConfigTableCellJsonConfig['renderConfig']) => {
  const url = getImageUrl(options.imageTableId, value)
  return createCompanyTableLogo(url, undefined, undefined, options.imageRenderType)
}
