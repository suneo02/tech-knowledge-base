import { Empty } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import classNames from 'classnames'
import React from 'react'
import { getTableLocale } from '../../table/handle'
import { ICorpTableCfg } from '../../type'
import styles from './comp.module.less'

interface FinancialTableProps {
  eachTableKey: string
  eachTable: ICorpTableCfg
  dataLoaded: boolean
  tableData: {
    list?: any[]
    columns?: Record<string, any>[]
  }
  className: string
}

export const FinancialTable: React.FC<FinancialTableProps> = ({
  eachTableKey,
  eachTable,
  dataLoaded,
  tableData,
  className,
}) => {
  if (dataLoaded && !tableData?.list) {
    return null
  }

  if (dataLoaded && !tableData?.list?.length) {
    return (
      <div className={classNames(styles.emptyContainer, className)} data-custom-id={eachTableKey}>
        <div className="wind-ui-table-title">{eachTable.titleStr}</div>
        <Empty status="no-data" direction="vertical" />
      </div>
    )
  }

  return (
    <div className={classNames(className)} data-custom-id={eachTableKey}>
      <Table
        key={eachTableKey}
        title={eachTable.titleStr}
        columns={tableData.columns}
        pagination={false}
        loading={!dataLoaded}
        locale={getTableLocale(dataLoaded)}
        dataSource={tableData.list}
        style={{ width: '100%' }}
      />
    </div>
  )
}

export default FinancialTable
