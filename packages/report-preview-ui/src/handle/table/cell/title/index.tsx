import { ConfigTableCellJsonConfig } from 'gel-types'
import { configDetailIntlHelper } from 'report-util/corpConfigJson'
import { TIntl } from 'report-util/types'

export function parseConfigTableCellTitleConfig(
  title: string,
  titleIntl: ConfigTableCellJsonConfig['titleIntl'],
  titleRenderConfig: ConfigTableCellJsonConfig['titleRenderConfig'],
  t: TIntl
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
      return (
        <span>
          {titleZH}
          {titleRenderConfig.titleLocal && <br />}
          {titleRenderConfig.titleLocal && <small style={{ color: '#aaa' }}>{titleRenderConfig.titleLocal}</small>}
        </span>
      )
    }
    default:
      return titleZH
  }
}
