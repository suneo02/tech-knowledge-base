import React, { FC } from 'react'
import intl from '../../../../../utils/intl'
import './index.less'

const StylePrefix = 'company-report'

export const CheckSampleIntl = intl('265681', '查看样例')

export const CompanyReportExportItem: FC<{
  className?: string
  title: string
  tips: string
  buttons: React.ReactNode
  imgSrc: string
  ifSvip?: boolean
}> = ({ className, title, tips, buttons, imgSrc, ifSvip }) => {
  return (
    <div className={`${StylePrefix}--item ${ifSvip ? StylePrefix + '--item--svip' : ''} ${className}`}>
      <div className={`${StylePrefix}--item--left`}>
        <div className={`${StylePrefix}--item--title`}>
          <span>{title}</span>
        </div>
        <div className={`${StylePrefix}--item--tips`}>{tips}</div>
        <div className={`${StylePrefix}--btn-group`}>{buttons}</div>
      </div>
      <img src={imgSrc} alt="" className={`${StylePrefix}--item--right`} />
    </div>
  )
}
