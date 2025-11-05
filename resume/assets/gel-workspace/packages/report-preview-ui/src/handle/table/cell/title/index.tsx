import { ConfigTableCellJsonConfig } from 'gel-types'
import React from 'react'
import { configDetailIntlHelper } from 'report-util/corpConfigJson'
import { tForRPPreview } from '../../../../utils'

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
    tForRPPreview
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
