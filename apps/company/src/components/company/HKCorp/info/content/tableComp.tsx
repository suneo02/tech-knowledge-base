/**
 * temp Group Table
 * Created by Calvin
 *
 * @format
 */

import TableTitle from '@/components/common/card/header/Header'
import NoData from '@/components/common/noData/NoData.tsx'
import { TOnSearchChange } from '@/components/common/search/type.ts'
import { HKCorpInfoBoughtTip } from '@/components/company/HKCorp/info/content/comp.tsx'
import { useHKCorpInfoApiData } from '@/components/company/HKCorp/info/content/handle.tsx'
import { useTableExpandable } from '@/components/table/components/expandable/expandable'
import { TableFooterLeft } from '@/components/table/FooterLeft'
import HorizontalTable from '@/components/table/horizontal'
import { useTableColumns } from '@/components/table/tableColumns.tsx'
import { ICfgDetailTableJson } from '@/types/configDetail/table.ts'
import intl, { intlNoIndex } from '@/utils/intl'
import { Spin } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { cloneDeep, isNil } from 'lodash'
import React, { FC, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import '../../../../table/table.less'
import { usePagination } from './usePagination'
import { useFilter } from './useFilter'

const TableType = {
  Normal: 'Normal',
  Horizontal: 'Horizontal',
}

const indexColumn = {
  dataIndex: 'index',
  title: '',
  width: 60,
  align: 'center',
}

const useTableType = (columns: any) => {
  return useMemo(() => {
    if (!columns) return TableType.Normal

    if (columns[0] && Array.isArray(columns[0])) {
      return TableType.Horizontal
    }

    return TableType.Normal
  }, [columns])
}

export const TableForHKCorp: FC<ICfgDetailTableJson> = (props) => {
  const { maxTotal = 5000 } = props

  const ref = useRef(null)
  const { columns, dataSource, api, treeKey, expandable, params, hideTableHeader, titleRender } = props

  const columnsSafe = useMemo(() => (isNil(columns) ? [] : columns), [columns])
  const tableType = useTableType(columnsSafe)
  const [tableColumns, setTableColumns] = useState(columnsSafe)
  const [expandedRowKeys, setExpandedRowKeys] = useState([])

  // 使用 filter hook
  const { combinedFilter, searchFilter, updateSearchFilter } = useFilter({
    nodesFilter: props?.nodes?.filter,
  })

  const { pagination, handlePageChange, updateTotal, resetPagination } = usePagination({ maxTotal })

  const { tableData, loading, setLoading, tableLoading, getApiData, lastAggChangedRef, searchOptions } =
    useHKCorpInfoApiData({
      api,
      apiExtra: props.apiExtra,
      apiParams: props.apiParams,
      apiOptions: props.apiOptions,
      params,
      pagination,
      updateTotal,
      searchOptionsProp: props.searchOptions,
      filter: combinedFilter,
    })

  const handleSearchChanged: TOnSearchChange = useCallback(
    (searchValue) => {
      if (searchValue) {
        updateSearchFilter(searchValue)
      }

      if (Object.keys(searchValue).length > 0 && props?.searchOptions && Array.isArray(props?.searchOptions)) {
        lastAggChangedRef.current = props.searchOptions.find(
          (item) => item.key === Object.keys(searchValue)[0]
        )?.aggsKey
      }
    },
    [props.searchOptions]
  )

  const { handleColumns } = useTableColumns()
  const { defaultExpandedColumns } = useTableExpandable({
    expandedRowKeys,
    setExpandedRowKeys,
  })

  // init 函数被 useEffect 依赖，需要 useCallback
  const init = useCallback(() => {
    if (api) {
      getApiData(true)
    }

    const changedColumns = handleColumns(props.showIndex ? [indexColumn, ...columnsSafe] : columnsSafe)
    setTableColumns(changedColumns)

    setLoading(false)
  }, [api, getApiData, handleColumns, props.showIndex, columnsSafe, setLoading])

  // expandedRowRender 被用作 prop，需要 useCallback
  const expandedRowRender = useCallback(
    (row) => {
      const params = expandable.params || {}
      if (expandable.paramKeys)
        Object.entries(expandable.paramKeys).map(([key, value]) => {
          // @ts-expect-error ttt
          params[key] = row[value]
        })
      if (expandable.apiParams) {
        Object.entries(expandable.apiParams).map(([key, value]) => {
          // @ts-expect-error ttt
          if (basicInfo[value]) params[key] = basicInfo[value]
        })
      }
      return (
        <HorizontalTable
          columns={expandable.columns}
          errorTitle={expandable.errorTitle}
          api={{
            url: row.ob_object_id ? `${expandable.api}/${row.ob_object_id}` : expandable.api,
            params,
            noExtra: expandable.noExtra,
          }}
          preprocessing={true}
        />
      )
    },
    [expandable]
  )

  // TableComponent 被用作 JSX，需要 useCallback
  const TableComponent = useCallback(() => {
    const checkedColumns: any = tableColumns
      ? expandable
        ? [...tableColumns, defaultExpandedColumns]
        : tableColumns
      : null
    const checkedExpandable = expandable ? { expandedRowKeys, expandedRowRender, expandIcon: false } : null

    switch (tableType) {
      case TableType.Normal:
        return (
          <Table
            size="small"
            bordered="dotted"
            className="content-container"
            columns={checkedColumns}
            dataSource={dataSource || tableData || []}
            loading={tableLoading}
            pagination={pagination}
            onChange={handlePageChange}
            expandable={checkedExpandable}
            empty={<NoData />}
            rowKey="key"
            title={() => titleRender?.(pagination.total)}
            data-uc-id="xFsjfGtxFn"
            data-uc-ct="table"
          />
        )
      case TableType.Horizontal:
        return (
          <Table.HorizontalTable
            className="content-container"
            bordered="vertical"
            // @ts-expect-error ttt
            rows={tableColumns}
            dataSource={dataSource || tableData || []}
            loading={loading}
            empty={<NoData />}
            // @ts-expect-error ttt
            title={() => titleRender?.(pagination.total)}
            data-uc-id="pg1juroFcO"
            data-uc-ct="table"
          />
        )
      default:
        return null
    }
  }, [
    tableColumns,
    expandable,
    defaultExpandedColumns,
    expandedRowKeys,
    expandedRowRender,
    tableType,
    dataSource,
    tableData,
    tableLoading,
    pagination,
    handlePageChange,
    titleRender,
  ])

  // Effect for initial loading
  useEffect(() => {
    if (dataSource) {
      setLoading(false) // 如果有 dataSource，直接设置 loading 为 false
      return
    }

    if (!props.nodes?.filter) {
      init()
      return
    }

    resetPagination()
    setLoading(false)
  }, [props.nodes?.filter, dataSource])

  return (
    <div className="hk-corp-table-container" key={treeKey} ref={ref}>
      {titleRender ? null : !hideTableHeader ? (
        <div className="table-title">
          <TableTitle
            {...props}
            searchOptions={searchOptions}
            searchFilter={searchFilter}
            num={pagination.total}
            onSearchChange={handleSearchChanged}
            data-uc-id="r-Or2Xq7Dc"
            data-uc-ct="tabletitle"
          />
        </div>
      ) : null}
      {loading ? (
        // @ts-expect-error ttt
        <Spin tip={`${intl(props?.titleId, props?.title) || ''}${intlNoIndex('132761', 'Loading')}`}>
          <div style={{ height: 300, width: '100%' }}></div>
        </Spin>
      ) : (
        <div className="table-container">
          <TableComponent />
          <TableFooterLeft
            footerLeftRender={props.footerLeftRender}
            total={pagination.total}
            ifRecentThreeYears={props.ifRecentThreeYears}
          />
          <HKCorpInfoBoughtTip />
        </div>
      )}
    </div>
  )
}
