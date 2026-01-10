import Table, { ColumnProps } from '@wind/wind-ui-table'
import { ErrorBoundary } from 'gel-ui'
import React, { ComponentProps, FC } from 'react'
import { VipPurchase } from '../../company/VipModuleNew'
import styles from './VipPurcaseTableWrapper.module.less'

type VipProps = React.ComponentProps<typeof VipPurchase>

const Inner: React.FC<{ columns?: ColumnProps[] } & Partial<VipProps>> = ({ columns, ...vipProps }) => {
  const hasColumns = Array.isArray(columns) && columns.length > 0
  if (!hasColumns) return <VipPurchase {...vipProps} />
  return (
    <div className={styles['vip-purchase-table-wrapper']}>
      <Table columns={columns!} dataSource={[]} pagination={false} empty={<VipPurchase {...vipProps} />} />
    </div>
  )
}

export const VipPurchaseTableWrapper: FC<ComponentProps<typeof Inner>> = (props) => {
  return (
    <ErrorBoundary>
      <Inner {...props} />
    </ErrorBoundary>
  )
}
