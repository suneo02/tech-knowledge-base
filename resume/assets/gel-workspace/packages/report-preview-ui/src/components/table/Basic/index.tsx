import { TablePropsVertical } from '@/types/table'
import { tForRPPreview } from '@/utils'
import { Spin } from '@wind/wind-ui'
import React from 'react'
import { instanceTableDefaultOptions } from 'report-util/table'
import { NoDataRow } from '../tableComp'
import styles from './index.module.less'

interface BasicTableProps {
  dataSource?: any[]
  options: TablePropsVertical
}

export const BasicTable: React.FC<BasicTableProps> = ({ dataSource = [], options: optionsProp }) => {
  const options: TablePropsVertical = {
    ...instanceTableDefaultOptions(tForRPPreview),
    ...optionsProp,
  }

  const { columns, showHeader, className, loading, noDataText, rowKey, rowClassName } = options

  const renderHeader = () => {
    if (showHeader === false) {
      return null
    }

    return (
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              className={`${column.align ? styles[`align-${column.align}`] : ''} ${column.className || ''}`}
            >
              {column.title || ''}
            </th>
          ))}
        </tr>
      </thead>
    )
  }

  const renderBody = () => {
    if (loading) {
      return (
        <tbody>
          <Spin />
        </tbody>
      )
    }

    if (!dataSource || dataSource.length === 0) {
      return (
        <tbody>
          <NoDataRow colSpan={columns.length || 1} message={noDataText} />
        </tbody>
      )
    }

    return (
      <tbody>
        {dataSource.map((rowData, rowIndex) => {
          let rowId = rowIndex
          if (rowKey && typeof rowData[rowKey] !== 'undefined') {
            rowId = rowData[rowKey]
          }
          return (
            <tr key={rowId} data-row-key={rowId}>
              {columns.map((column, colIndex) => {
                const { dataIndex, render, align, className: colClassName } = column
                const cellValue = dataIndex ? rowData[dataIndex] : undefined
                const cellContent = render ? render(cellValue, rowData, rowIndex) : (cellValue ?? '')

                return (
                  <td key={colIndex} className={`${align ? styles[`align-${align}`] : ''} ${colClassName || ''}`}>
                    {cellContent}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    )
  }

  return (
    <table className={`${styles.table} ${styles.bordered} ${className || ''} ${rowClassName || ''}`}>
      <colgroup>
        {columns.map((column, index) => {
          const width = column.width
            ? typeof column.width === 'number'
              ? `${column.width}px`
              : column.width
            : undefined
          return <col key={index} style={width ? { width, minWidth: width } : undefined} />
        })}
      </colgroup>
      {renderHeader()}
      {renderBody()}
    </table>
  )
}

// For backward compatibility with the old function-based usage
export const TableElementCreator = {
  createTable: (dataSource: any[] = [], options: TablePropsVertical) => (
    <BasicTable dataSource={dataSource} options={options} />
  ),
}
