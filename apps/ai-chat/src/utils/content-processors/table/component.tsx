import React from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TablePaginationConfig } from 'antd/es/table'
import type { MarkdownTable } from './types'
import './styles.less'

interface AntTableDataType {
  key: string
  [key: string]: unknown
}

/**
 * 将 Markdown 表格数据转换为 Antd Table 组件所需的数据格式
 */
const convertToAntTable = (tableData: MarkdownTable) => {
  if (!tableData.isTable || !tableData.headers.length) {
    return {
      columns: [],
      dataSource: [],
    }
  }

  // 生成列定义
  const columns: ColumnsType<AntTableDataType> = tableData.headers.map((header, index) => ({
    title: header,
    dataIndex: `col${index}`,
    key: `col${index}`,
    align: tableData.alignments?.[index] || 'left',
    // 自动判断列的数据类型
    render: (text: string) => {
      // 如果是数字，右对齐
      if (!isNaN(Number(text)) && text.trim() !== '') {
        return <div style={{ textAlign: 'right' }}>{text}</div>
      }
      return text
    },
  }))

  // 生成数据源
  const dataSource: AntTableDataType[] = tableData.rows.map((row, rowIndex) => {
    const rowData: AntTableDataType = { key: `row${rowIndex}` }
    row.forEach((cell, colIndex) => {
      rowData[`col${colIndex}`] = cell
    })
    return rowData
  })

  return {
    columns,
    dataSource,
  }
}

/**
 * 获取表格属性配置
 */
const getTableProps = (tableData: MarkdownTable) => {
  const pagination: false | TablePaginationConfig =
    tableData.rows.length > 10
      ? {
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }
      : false

  return {
    size: 'middle' as const,
    bordered: true,
    pagination,
    scroll: tableData.headers.length > 5 ? { x: '100%' } : undefined,
    // 自适应列宽
    tableLayout: 'auto' as const,
    // 斑马纹
    rowClassName: (_record: unknown, index: number) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark'),
  }
}

/**
 * Markdown 表格组件
 * 将 Markdown 表格数据渲染为美观的 Antd Table 组件
 */
export const MarkdownTableComponent: React.FC<{
  tableData: MarkdownTable
}> = ({ tableData }) => {
  const { columns, dataSource } = convertToAntTable(tableData)
  const tableProps = getTableProps(tableData)

  if (!tableData.isTable || columns.length === 0) {
    return null
  }

  return (
    <div className="markdown-table-container">
      <Table<AntTableDataType> {...tableProps} columns={columns} dataSource={dataSource} />
    </div>
  )
}
