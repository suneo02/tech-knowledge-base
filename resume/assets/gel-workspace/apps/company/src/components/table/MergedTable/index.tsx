import React, { useMemo } from 'react'
import Table, { TableProps } from '@wind/wind-ui-table'
import { get } from 'lodash'

/**
 * @file MergedTable - 可根据数据结构自动合并单元格的表格组件
 */

/**
 * MergedTable 组件的 Props 定义
 * @interface MergedTableProps
 * @extends {TableProps}
 * @template T - dataSource 中单条数据的类型
 * @property {string} mergeKey - 指定 dataSource 中用于行合并的数组字段名，例如 'contentItems'
 * @property {string[]} mergedColumnDataIndexes - 需要应用行合并效果的列的 dataIndex 数组
 */
export interface MergedTableProps<T extends object> extends TableProps<T> {
  mergeKey: string
  mergedColumnDataIndexes: string[]
}

/**
 * 根据 dataSource 和 mergeKey，处理数据，为每一行添加 rowSpan 标记
 * @param dataSource - 原始数据源
 * @param mergeKey - 用于行合并的数组字段名
 * @returns {any[]} - 处理后的、可供 Table 渲染的数据
 */
const useMergedTableData = (dataSource: readonly any[] | undefined, mergeKey: string) => {
  return useMemo(() => {
    if (!dataSource) {
      return []
    }
    return dataSource
      .map((record, recordIndex) => {
        const itemsToMerge = get(record, mergeKey)

        if (!Array.isArray(itemsToMerge) || itemsToMerge.length === 0) {
          return [
            {
              ...record,
              key: record.key ?? `${recordIndex}-0`,
              rowSpan: 1,
            },
          ]
        }
        return itemsToMerge.map((item, itemIndex) => ({
          ...record,
          ...item,
          key: record.key ?? `${recordIndex}-${itemIndex}`,
          rowSpan: itemIndex === 0 ? itemsToMerge.length : 0,
        }))
      })
      .flat()
  }, [dataSource, mergeKey])
}

/**
 * 一个可以根据数据结构自动合并单元格的表格组件。
 *
 * @template T
 * @param {MergedTableProps<T>} props - 组件的 props
 * @returns {React.ReactElement}
 *
 * @example
 * // dataSource = [{ id: 1, name: '主记录1', contentItems: [{ detail: '详情A' }, { detail: '详情B' }] }]
 * // columns = [{ title: '名称', dataIndex: 'name' }, { title: '详情', dataIndex: 'detail' }]
 *
 * <MergedTable
 *   dataSource={dataSource}
 *   columns={columns}
 *   mergeKey="contentItems"
 *   mergedColumnDataIndexes={['name']}
 * />
 */
function MergedTable<T extends object>({
  dataSource,
  columns,
  mergeKey,
  mergedColumnDataIndexes,
  ...rest
}: MergedTableProps<T>): React.ReactElement {
  const processedData = useMergedTableData(dataSource, mergeKey)

  const augmentedColumns = useMemo(() => {
    if (!columns) {
      return []
    }
    return columns.map((col) => {
      // 如果当前列的 dataIndex 在需要合并的列表中
      if (col.dataIndex && mergedColumnDataIndexes.includes(String(col.dataIndex))) {
        const originalRender = col.render

        // 重写 render 方法以注入 rowSpan
        const newRender = (value: any, record: any, index: number) => {
          const children = originalRender ? originalRender(value, record, index) : value

          return {
            children,
            props: {
              rowSpan: record.rowSpan,
            },
          }
        }
        return { ...col, render: newRender }
      }
      return col
    })
  }, [columns, mergedColumnDataIndexes])

  return <Table dataSource={processedData} columns={augmentedColumns} {...rest} />
}

export default MergedTable
