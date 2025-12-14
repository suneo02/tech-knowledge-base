import { t } from '@/utils/lang'
import { ConfigTableCellJsonConfig } from 'gel-types'
import { configDetailIntlHelper } from 'report-util/corpConfigJson'

export function parseConfigTableCellTitleConfig(
  title: string,
  titleIntl: ConfigTableCellJsonConfig['titleIntl'],
  titleRenderConfig: ConfigTableCellJsonConfig['titleRenderConfig']
) {
  const titleZH = configDetailIntlHelper(
    {
      title,
      titleIntl,
    },
    'title',
    t
  )
  if (!titleRenderConfig) {
    return titleZH
  }

  switch (titleRenderConfig.titleRenderName) {
    case 'overseasNonEnglishCorpName': {
      const $element = $(`<span>`)
      $element.append(titleZH)
      if (titleRenderConfig.titleLocal) {
        $element.append(`<br />`)
        $element.append(`<small style="color: #aaa;">${titleRenderConfig.titleLocal}</small>`)
      }
      return $element
    }
    default:
      return titleZH
  }
}
