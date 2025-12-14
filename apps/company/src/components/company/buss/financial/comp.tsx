import Table from '@wind/wind-ui-table'
import classNames from 'classnames'
import React from 'react'
import { getTableLocale } from '../../table/handle'
import { ICorpTableCfg } from '../../type'

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
        data-uc-id="pGCQoAAMn"
        data-uc-ct="table"
        data-uc-x={eachTableKey}
      />
    </div>
  )
}

export default FinancialTable
