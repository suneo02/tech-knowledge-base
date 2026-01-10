import { intl, isEn } from 'gel-util/intl'
import React from 'react'

export interface VipMarketingEditionProps {
  selected?: boolean
  onClick?: () => void
}

export const VipMarketingEdition: React.FC<VipMarketingEditionProps> = ({ selected, onClick }) => {
  return (
    <div className={`gel-vipR-prices-item ${selected ? 'gel-vipR-prices-sel' : ''} `} onClick={onClick}>
      <div className="type">{intl('479176', '营销版（百分企业）')}</div>
      <div className="contact">
        <span>{isEn() ? 'Contact Your Account Manager' : '联系客户经理咨询采购'}</span>
      </div>
    </div>
  )
}
