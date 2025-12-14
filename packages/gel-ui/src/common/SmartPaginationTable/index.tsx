import Table, { TableProps } from '@wind/wind-ui-table'
import React, { ReactNode } from 'react'
import './index.less'
const PREFIX = 'smart-pagination-table'

export interface SmartPaginationTableProps extends TableProps {
  total: number
  showTotal?: boolean
  paginationLabel?: ReactNode
}

export const SmartPaginationTable: React.FC<SmartPaginationTableProps> = (props) => {
  const pagination = props.total < 10 ? false : props.pagination
  return (
    <div className={`${PREFIX}-container`}>
      <Table {...props} pagination={pagination}></Table>
      {props.showTotal && pagination && (
        <div className={`${PREFIX}-label`}>
          共 <span className="strong">{props.total}</span> 条数据
        </div>
      )}
      {props.paginationLabel && <div className={`${PREFIX}-label`}>{props.paginationLabel}</div>}
    </div>
  )
}
