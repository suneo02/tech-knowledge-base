import { PaginationProps, Table, TableColumnType, TableProps, theme } from 'antd'
import { SorterResult } from 'antd/es/table/interface'
import { cloneDeep, isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { ParamsConfig } from '../../../types'
import { AlignTypeEnum, ColumnTypeEnum } from '../../../types/emun'
import { formatCurrency } from '../../../utils/common'
import useColumns from '../../../utils/hooks/table/useColumns'
import { useCrossTable } from '../../../utils/hooks/table/useCrossTable'
import { useExpandable } from '../../../utils/hooks/table/useExpandable'
import { useIndex } from '../../../utils/hooks/table/useIndex'
import './index.scss'

export interface TableOnChangeParams {
  pageNo?: number
  pageSize?: number
  [key: string]: any // 关于sorter类型，没有想到更好的解决方案
}

// todo 需要新增所有column的类型
export interface WindTableColumnType<T> extends TableColumnType<T> {
  id?: string | number
  type?: ColumnTypeEnum
  align?: AlignTypeEnum
  [key: string]: any
}

interface Props extends Omit<TableProps, 'onChange' | 'columns' | 'id'> {
  onChange?: (params: TableOnChangeParams) => void // onChange事件
  showIndex?: boolean // 是否展示序号
  crossList?: { title: string; dataIndex: string; align?: 'left' | 'right' }[] // 交叉报表或者是透视表
  pagination?: PaginationProps
  filterParams?: ParamsConfig
  columns: WindTableColumnType<any>[]
  id?: string | number
}

export type WindTableProps = Props & FilterProps

/** @import 这个专门给FilterContainer传参，其余不能用这个参数 */
interface FilterProps {
  filter?: any
  // updateFilter?: FilterContextType['updateFilter'] // 传递出去的参数
  updateFilter?: any
}

interface TableThemeToken {
  rowEvenBg: string
  rowOddBg: string
}

const DEFAULT_PAGINATION_PAGE_SIZE = 10

/**
 * WTable 组件
 * 该组件用于渲染一个简单的表格，支持交叉报表和透视表功能，同时支持分页、过滤和排序
 * @param props 组件的属性对象，包括数据源、列配置、过滤条件等
 * @returns 返回一个 Table 组件的 JSX 元素
 */
const WindTable = (props: WindTableProps) => {
  const { token } = theme.useToken() as unknown as { token: { Table: TableThemeToken } }
  let _expandable = props?.expandable
  let _dataSource = props.dataSource || []
  let _columns = props.columns || []
  // TODO 这里的any不知道怎么处理
  const infoItem = _columns?.find((res) => (res as any)?.type === ColumnTypeEnum.INFO)
  if (infoItem) {
    const { expandable } = useExpandable(infoItem)
    _expandable = expandable
  }
  // 判断是否需要翻页功能
  const _pagination: PaginationProps | false =
    props?.pagination && props.pagination?.total! > (props.pagination?.pageSize || DEFAULT_PAGINATION_PAGE_SIZE)
      ? props.pagination
      : false

  // 如果是交叉报表或者是透视表不执行任何columns的变换
  if (!isEmpty(props?.crossList)) {
    const [dataSource, columns] = useCrossTable({
      crossList: props.crossList!,
      dataSource: props.dataSource || [],
      columns: props.columns || [],
      filter: props?.filter,
    })
    _dataSource = dataSource
    _columns = columns
  } else {
    const { columns } = useColumns(_columns)
    _columns = columns!
  }

  // 将该对象的 columns 属性解构赋值给 TableColumns 变量

  const [columns, setColumns] = useState<TableProps['columns']>(_columns)

  useEffect(() => setColumns(_columns), [_columns])

  const { indexColumn, getIndexDataSource } = useIndex()

  /**
   * 表格的 onChange 事件处理函数
   * 处理分页、过滤和排序参数，并调用父组件传入的 onChange 回调函数
   * @param pagination 分页信息
   * @param filters 过滤条件
   * @param sorter 排序信息
   */
  const tableOnChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    let params: TableOnChangeParams = {}
    const { current, pageSize } = pagination || {}
    const {} = filters // TODO: 处理过滤条件
    const { field, order } = (sorter as SorterResult<any>) || {}
    if (current) params = { ...params, pageNo: current - 1, pageSize }
    if (field) params = { ...params, [field as string]: order }
    if (typeof props?.onChange === 'function') props.onChange(params)
    return params
  }

  useEffect(() => {
    if (!isEmpty(_dataSource) && props?.filterParams && props?.updateFilter) {
      const { frequency, businessIndex } = _dataSource?.[0]!
      props.updateFilter({ frequency, businessIndex })
    }
  }, [_dataSource, props?.filterParams])

  /** 根据筛选条件更新列配置 */
  useEffect(() => {
    const filter = props.filter
    if (filter?.label) {
      const newC = cloneDeep(_columns)?.map((res: any) => {
        if (res.dataIndex.includes('cross-')) {
          res.render = (txt: string | number) => formatCurrency(txt, filter.label)
        }
        return res
      })
      if (newC) setColumns(newC)
    }
  }, [props.filter])

  /** 单行双行颜色区别 */
  const defaultRowClassName = (_: any, index: number) => {
    return index % 2 !== 0 ? 'even-row' : 'odd-row'
  }

  return (
    <div className="w-table-container">
      <Table
        rowKey={(record, index) => record.id || record.key || `${index}`}
        {...props}
        id={props.id ? String(props.id) : undefined}
        onChange={tableOnChange}
        columns={props?.showIndex ? [...indexColumn, ...(columns || [])] : columns}
        dataSource={getIndexDataSource(_dataSource!, props.pagination)}
        pagination={_pagination}
        expandable={_expandable}
        rowClassName={props?.rootClassName || defaultRowClassName}
        style={
          {
            // 通过行样式应用样式 token
            '--even-row-background': token.Table?.rowEvenBg,
            '--odd-row-background': token.Table?.rowOddBg,
          } as any
        }
      ></Table>
    </div>
  )
}

export default WindTable
