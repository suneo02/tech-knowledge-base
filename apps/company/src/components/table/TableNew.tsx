/**
 * temp Group Table
 * Created by Calvin
 *
 * @format
 */

import { getGroupDataApi } from '@/api/groupApi'
import TableTitle from '@/components/common/card/header/Header'
import NoData from '@/components/common/noData/NoData.tsx'
import { TOnSearchChange } from '@/components/common/search/type.ts'
import { ConfigDetailContext } from '@/components/layout/ctx.tsx'
import { IApiChangeIndicator } from '@/components/table/type.ts'
import { useTableNewAggregations } from '@/handle/table/aggregation'
import { useGroupStore } from '@/store/group'
import { ICfgDetailTableJson } from '@/types/configDetail/table.ts'
import intl, { intlNoIndex } from '@/utils/intl'
import { useScrollUtils } from '@/utils/scroll'
import { wftCommon } from '@/utils/utils.tsx'
import { Spin } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import _, { cloneDeep, isArray, isNil } from 'lodash'
import React, { FC, memo, useContext, useEffect, useMemo, useRef, useState } from 'react'
import global from '../../lib/global.ts'
import { useTableExpandable } from './components/expandable/expandable.tsx'
import { TableFooterLeft } from './FooterLeft'
import HorizontalTable from './horizontal'
import './table.less'
import { useTableColumns } from './tableColumns'
import { usePreprocessingData } from './utils/processing.ts'

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

const TableNewRaw: FC<ICfgDetailTableJson> = (props) => {
  const moduleByCtx = useContext(ConfigDetailContext)
  const maxTotal = props.maxTotal || 5000
  const { basicInfo, updateNode } = useGroupStore()

  const ref = useRef(null)
  const { columns, dataSource, api, treeKey, expandable, params, hideTableHeader, titleRender, noExtra } = props

  const columnsSafe = useMemo(() => (isNil(columns) ? [] : columns), [columns])
  const lastAggChangedRef = useRef() // 用户上次点击的聚合，用这个值来判断更新聚合 count 的逻辑
  const [tableType, setTableType] = useState<string>()
  const [tableData, setTableData] = useState<any>()

  if (columns == null) {
    console.error('~ column set error', props)
  }
  const [tableColumns, setTableColumns] = useState(columnsSafe)
  const [loading, setLoading] = useState(true)
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const [pagination, setPagination] = useState<any>({
    pageSize: 10,
    current: 1,
    pageNo: 0,
    showSizeChanger: false,
    showQuickJumper: true,
  })
  const [tableLoading, setTableLoading] = useState(false)
  const [titleRemark, setTitleRemark] = useState(props.titleRemark)
  let filter = {
    pageNo: 0,
    pageSize: 10,
    ...props?.nodes?.filter,
  }
  const [searchFilter, setSearchFilter] = useState<any>()

  const pageOnChange = ({ currentPage, pageSize }) => {
    const oriPageParams = cloneDeep({
      ...pagination,
      ...filter,
      ...searchFilter,
    })
    filter = {
      ...filter,
      pageNo: currentPage - 1,
      pageSize,
      ...searchFilter,
    }

    setPagination({
      ...pagination,
      current: currentPage,
      pageNo: currentPage - 1,
      pageSize: pageSize || filter.pageSize,
    })

    getApiData(false, oriPageParams, 'pagination')
  }
  const { scrollToView } = useScrollUtils()
  const { handleColumns } = useTableColumns()
  const { matchOldData } = usePreprocessingData()
  const { defaultExpandedColumns } = useTableExpandable({
    expandedRowKeys,
    setExpandedRowKeys,
  })

  const { onAggMapChange, searchOptions } = useTableNewAggregations(props?.searchOptions)
  /**
   * 获取api事件
   * @param init
   * @param oriPageParams
   * @param changeIndicator 引起 api 发送数据的情况，现在只有切页时会特殊处理
   */
  const getApiData = async (init?, oriPageParams?, changeIndicator?: IApiChangeIndicator) => {
    if (init) {
      setLoading(true)
    } else {
      setTableLoading(true)
    }

    const apiParams = {}
    if (props.apiExtra) {
      props.apiExtra?.forEach((par) => {
        if (par.type === 'dynamic') {
          if (par?.apiKey && par?.key) apiParams[par.apiKey] = params?.[par.key]
        } else {
          if (par?.apiKey && par?.value) apiParams[par.apiKey] = par.value
        }
      })
    }
    if (props.apiParams) {
      Object.entries(props.apiParams).map(([key, value]) => {
        if (basicInfo[value]) apiParams[key] = basicInfo[value]
      })
    }
    let Data, Page, ErrorCode
    try {
      ;({ Data, Page, ErrorCode } = await getGroupDataApi(
        api,
        _.omitBy(
          {
            ...apiParams,
            ...params,
            ...filter,
          },
          _.isNil
        ),
        noExtra
      ))
      if (moduleByCtx === 'group' && (!Data || Data.length === 0)) {
        // 无数据时隐藏节点 目前只有在集团系中有这个逻辑
        updateNode({
          treeKey,
          display: false,
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      if (init) {
        setLoading(false)
      } else {
        setTableLoading(false)
      }
    }
    if (ErrorCode === global.VIP_OUT_LIMIT) {
      if (oriPageParams) setPagination(oriPageParams)
      return
    }

    setExpandedRowKeys([])

    let _Data = Data
    /** 写所有特殊的数据 */
    if (api.includes('detail/person/getCollaboratePartner')) {
      if (Data) {
        _Data = Data?.map((res) => {
          if (Array.isArray(res?.partnerCompany) && res.partnerCompany.length > 0) {
            const _partnerCompany = res.partnerCompany[0]
            return {
              ...res,
              ..._partnerCompany,
              count: res.partnerCompany.length,
            }
          }
          return res
        })
      }
    }

    if (!init) scrollToView(props.nodeKey)

    if (Page) {
      setPagination((prevState) => ({ ...prevState, total: Page.Records }))
    }
    if (Data?.aggregations) {
      onAggMapChange(Data?.aggregations, lastAggChangedRef.current, changeIndicator)
    }

    const { sourceData: matchedData } = matchOldData(_Data)

    const tableDataComputed =
      matchedData && isArray(matchedData)
        ? matchedData?.map((res, index) => {
            res.index = filter.pageNo * 10 + index + 1
            return res
          })
        : []

    setTableData(tableDataComputed)
    if (window.en_access_config) {
      wftCommon.zh2en(tableDataComputed, (endData) => {
        if (!endData) {
          console.error(`translated data is null \t ${JSON.stringify(endData)}`)
        }
        if (!Array.isArray(endData)) {
          console.error(`translated table data is not an array \t ${JSON.stringify(endData)}`)
        } else {
          setTableData(endData)
        }
      })
    }
  }

  /** init function must need to check isIntersectiong */
  const init = () => {
    if (api) {
      getApiData(true)
    } else {
      setLoading(false)
      if (dataSource) setTableData(dataSource)
    }
    if (columns && columns[0] && Array.isArray(columns[0])) {
      setTableType(TableType.Horizontal)
    } else {
      setTableType(TableType.Normal)
    }

    const changedColumns = handleColumns(props.showIndex ? [indexColumn, ...columnsSafe] : columnsSafe)

    setTableColumns(changedColumns)
  }

  useEffect(() => {
    if (dataSource) return
    const setFilter = () => {
      if (loading) {
        init()
        return
      }
      if (props.nodes?.filter) {
        setPagination({
          ...pagination,
          current: 1,
          pageNo: 0,
        })
        getApiData()
      }
    }
    setFilter()
  }, [props.nodes?.filter])

  useEffect(() => {
    if (dataSource) {
      setLoading(false)
      setTableType(TableType.Normal)
      const changedColumns = handleColumns(props.showIndex ? [indexColumn, ...columnsSafe] : columnsSafe)
      setTableColumns(changedColumns)
      setTableData(dataSource)
    }
  }, [dataSource])

  const expandedRowRender = (row) => {
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
  }

  const handleSearchChanged: TOnSearchChange = (searchValue) => {
    if (searchValue) {
      filter = { ...filter, ...searchFilter, ...searchValue }
      getApiData()
    }
    const filterKeys = Object.keys(searchValue)
    if (filterKeys.length > 0 && props?.searchOptions && Array.isArray(props?.searchOptions)) {
      // 获取该筛选想的 聚合 key
      lastAggChangedRef.current = props.searchOptions.find((item) => item.key === filterKeys[0])?.aggsKey
    } else {
      // 正常情况不会走到这
      console.error('🚀 ~table new handleSearchChanged agg ~ searchValue:', searchValue)
    }
    setSearchFilter({ ...searchFilter, ...searchValue })
  }

  const handlePagination = (p) => {
    return { ...p, total: Math.min(p.total, maxTotal) }
  }

  const TableComponent = () => {
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
            dataSource={tableData || []}
            loading={tableLoading}
            pagination={handlePagination(pagination)}
            onChange={pageOnChange}
            expandable={checkedExpandable}
            empty={<NoData />}
            rowKey="key"
            title={() => titleRender?.(pagination.total)}
            data-uc-id="Epbbkpk7eY"
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
            dataSource={tableData || {}}
            loading={loading}
            empty={<NoData />}
            // @ts-expect-error ttt
            title={() => titleRender?.(pagination.total)}
            data-uc-id="aXUUmXVWU"
            data-uc-ct="table"
          ></Table.HorizontalTable>
        )
      default:
        return null
    }
  }
  return (
    <div key={treeKey} ref={ref}>
      {titleRender ? null : !hideTableHeader ? (
        <div className="table-title">
          <TableTitle
            {...props}
            searchOptions={searchOptions}
            searchFilter={searchFilter}
            num={pagination.total || pagination.total}
            onSearchChange={handleSearchChanged}
            titleRemark={titleRemark}
            data-uc-id="3uAVeDU8-X"
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
        </div>
      )}
    </div>
  )
}
const TableNew = memo(TableNewRaw, (pre, next) => {
  return pre.num === next.num && pre.nodes?.filter === next.nodes?.filter && pre.dataSource === next.dataSource
})
TableNew.displayName = 'TableNew'
export default TableNew
