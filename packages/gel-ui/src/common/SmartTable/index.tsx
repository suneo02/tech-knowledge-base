import React from 'react'
import styles from './index.module.less'
import Table, { TableProps } from '@wind/wind-ui-table'
import { VIPType } from 'gel-types'

const PREFIX = 'smart-table'

export interface SmartTableProps extends TableProps {
  vip: VIPType[]
}
export const SmartTable: React.FC<SmartTableProps> = (props) => {
  return (
    <div className={styles[`${PREFIX}-container`]}>
      <Table {...props} />
    </div>
  )
}
