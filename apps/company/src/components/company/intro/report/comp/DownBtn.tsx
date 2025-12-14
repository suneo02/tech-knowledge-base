import { DocExcelIcon, DocPdfIcon } from '@/components/common/Icon'
import { Button } from '@wind/wind-ui'
import React, { FC } from 'react'
import intl from '../../../../../utils/intl'
import './DownBtn.less'

const StylePrefix = 'DownBtn'

export const ReportDownBtn: FC<{
  onClick: () => void
  Icon?: FC<{
    className?: string
  }>
}> = ({ onClick, Icon = DocPdfIcon }) => {
  return (
    <Button className={StylePrefix} onClick={onClick} data-uc-id="n3Aqu9oLw" data-uc-ct="button">
      <Icon className={`${StylePrefix}--icon`} />
      <span>{intl('437448', '下载报告')}</span>
    </Button>
  )
}

export const ReportPdfDownBtn: FC<{
  onClick: () => void
}> = ({ onClick }) => {
  return <ReportDownBtn onClick={onClick} Icon={DocPdfIcon} data-uc-id="RxgtqIeCQl" data-uc-ct="reportdownbtn" />
}

export const ReportExcelDownBtn: FC<{
  onClick: () => void
}> = ({ onClick }) => {
  return <ReportDownBtn onClick={onClick} Icon={DocExcelIcon} data-uc-id="z9Lo8eTt9t" data-uc-ct="reportdownbtn" />
}
