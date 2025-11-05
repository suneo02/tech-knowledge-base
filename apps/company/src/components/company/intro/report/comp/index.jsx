import './index.less'
import intl from '../../../../../utils/intl'
import React from 'react'

const StylePrefix = 'company-report'

export const CheckSampleIntl = intl('265681', '查看样例')

export const CompanyReportExportItem = ({ className, title, tips, buttons, imgSrc, ifSvip }) => {
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
