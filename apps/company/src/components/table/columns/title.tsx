import { InfoCircleButton } from '@/components/icons/InfoCircle'
import intl from '@/utils/intl'
import { Tooltip } from '@wind/wind-ui/lib'
import React from 'react'

export const handleTableColumnTitle = (column) => {
  const reg = /^\d+$/
  const titleContent = column.titleId
    ? intl(column.titleId, column.title)
    : reg.test(column.title)
      ? intl(column.title)
      : column.title

  if (column.titleTooltip) {
    const tooltipId = column.titleTooltipId || null
    column.title = (
      <>
        {titleContent}
        <Tooltip overlayClassName="corp-tooltip" title={intl(tooltipId, column.titleTooltip)}>
          <InfoCircleButton />
        </Tooltip>
      </>
    )
  } else {
    column.title = titleContent
  }
}
