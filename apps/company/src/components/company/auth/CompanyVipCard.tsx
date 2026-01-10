import { CorpTableCfg } from '@/types/corpDetail'
import { Card } from '@wind/wind-ui'
import classNames from 'classnames'
import React, { ReactNode } from 'react'
import { VipPurchase } from '../../user'
import { VipPurchaseTableWrapper } from '../../user/vip/VipPurchaseTableWrapper'
import corpTableStyles from './CompanyVipCard.module.less'

interface CompanyVipCardProps {
  dataCustomId?: string
  title: ReactNode
  vipTitle: ReactNode
}

export const CompanyVipCard: React.FC<CompanyVipCardProps> = ({ dataCustomId, title, vipTitle }) => {
  return (
    <Card
      data-custom-id={dataCustomId}
      className="table-custom-module-readyed vtable-container gqct-card"
      divider={'none'}
      title={title}
    >
      <VipPurchase title={vipTitle || ''} />
    </Card>
  )
}

export const CompanyTableVipCard: React.FC<
  CompanyVipCardProps & {
    columns: CorpTableCfg['columns']
  }
> = ({ dataCustomId, title, vipTitle, columns }) => {
  return (
    <Card
      data-custom-id={dataCustomId}
      className={classNames(
        corpTableStyles['company-table-vip-card'],
        'table-custom-module-readyed vtable-container gqct-card'
      )}
      divider={'none'}
      title={title}
    >
      <VipPurchaseTableWrapper title={vipTitle || ''} columns={columns} />
    </Card>
  )
}
