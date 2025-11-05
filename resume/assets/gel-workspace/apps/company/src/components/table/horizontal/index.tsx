import React, { FC, useEffect, useMemo, useState } from 'react'
import NoData from '@/components/common/noData/NoData'
import Table from '@wind/wind-ui-table'
import { usePreprocessingData } from '../utils/processing'
import './index.less'
import { every, isArray } from 'lodash'
import { useTranslateService } from '../../../hook'
import intl from '@/utils/intl'

function isTwoDimensionalArr(val) {
  if (!isArray(val)) {
    return false
  }
  return every(val, isArray)
}

/**
 * 目前是拓展包
 * @param { columns, dataSource, preprocessing, api } param
 * preprocessing: 是否需要预处理数据
 * api: { url: '', params: {} }
 * errorTitle 这个不是给你们用的，不要管
 * @returns
 */
const HorizontalTable: FC<{
  columns: any[]
  dataSource?: any
  preprocessing: boolean
  api: any
  errorTitle: string
}> = ({ columns, dataSource, preprocessing, api, errorTitle }) => {
  const [tableRowsApi, setTableRowsApi] = useState([])
  const [tableData, setTableData] = useState(null)
  const [tableDataIntl] = useTranslateService(tableData, true, true)
  const [loading, setLoading] = useState(true)

  const { getTableData } = usePreprocessingData()

  // @ts-expect-error ttt
  useEffect(async () => {
    const tableData: any = await getTableData({
      columns,
      dataSource,
      preprocessing,
      api,
    }).finally(() => setLoading(false))
    setTableRowsApi(tableData.columns || [])
    if (Array.isArray(tableData.dataSource)) {
      setTableData(tableData.dataSource[0])
      return
    }
    setTableData(tableData.dataSource)
  }, [])

  const tableRows = useMemo(() => {
    if (tableRowsApi && isTwoDimensionalArr(tableRowsApi)) {
      return tableRowsApi
    }
    if (columns && isTwoDimensionalArr(columns)) {
      return columns
    }
    return []
  }, [columns, tableRowsApi])

  return (
    <div className={errorTitle ? 'horizontal-table-container' : ''}>
      {errorTitle ? errorTitle : null}
      <Table.HorizontalTable
        bordered="vertical"
        rows={tableRows}
        dataSource={tableDataIntl}
        loading={loading}
        locale={{
          emptyText: loading ? (
            <NoData title={window.en_access_config ? 'loading' : '数据加载中，请稍后'} />
          ) : (
            <NoData title={intl('132725', '暂无数据')} />
          ),
        }}
      />
    </div>
  )
}

export default HorizontalTable
