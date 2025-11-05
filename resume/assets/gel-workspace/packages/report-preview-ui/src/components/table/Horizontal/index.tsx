import { HorizontalTableColProps, TablePropsHorizontal } from '@/types/table'
import { tForRPPreview } from '@/utils'
import { Spin } from '@wind/wind-ui'
import { ErrorBoundary } from 'gel-ui'
import React from 'react'
import { instanceTableDefaultOptions } from 'report-util/table'
import { NoDataRow } from '../tableComp'
import styles from './index.module.less'

/**
 * Split array into chunks of specified size
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  if (size <= 0) {
    return [array] // Avoid infinite loop or error for non-positive size
  }
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

interface TableRowProps {
  rowColumns: TablePropsHorizontal['columns'][0]
  dataSource: any
  maxPairsPerVisualRow?: number
}

export const TD: React.FC<{
  column: HorizontalTableColProps
}> = ({ column }) => {
  return (
    <ErrorBoundary>
      <td className={`${styles.labelCell} ${styles.cell} ${column.className || ''}`}>{column.title || ''}</td>
    </ErrorBoundary>
  )
}

export const TDValue: React.FC<{
  column: HorizontalTableColProps
  dataSource: any
  colIndex: number
}> = ({ column, dataSource, colIndex }) => {
  const value = dataSource && column.dataIndex ? dataSource[column.dataIndex] : undefined

  const cellContent = column.render ? column.render(value, dataSource, colIndex) : (value ?? '')

  const colSpan = column.colSpan && column.colSpan > 1 ? column.colSpan : 1

  return (
    <ErrorBoundary>
      <td
        className={`${styles.valueCell} ${styles.cell} ${column.valueClassName || ''}`}
        colSpan={colSpan > 1 ? colSpan : undefined}
      >
        {cellContent}
      </td>
    </ErrorBoundary>
  )
}

const TableRow: React.FC<TableRowProps> = ({ rowColumns, dataSource, maxPairsPerVisualRow = 3 }) => {
  const visualRowsChunks = chunkArray(rowColumns, maxPairsPerVisualRow)

  return (
    <>
      {visualRowsChunks.map((chunk, chunkIndex) => {
        let usedCells = 0

        return (
          <tr key={chunkIndex} className={styles['horizontalTable-TR']}>
            {chunk.map((column, colIndex) => {
              const colSpan = column.colSpan && column.colSpan > 1 ? column.colSpan : 1
              usedCells += 1 + colSpan

              return (
                <React.Fragment key={colIndex}>
                  <TD column={column} />
                  <TDValue column={column} dataSource={dataSource} colIndex={colIndex} />
                </React.Fragment>
              )
            })}
            {/* Fill remaining cells in the visual row */}
            {Array.from({
              length: Math.max(0, Math.floor((maxPairsPerVisualRow * 2 - usedCells) / 2)),
            }).map((_, i) => (
              <React.Fragment key={`empty-${i}`}>
                <td className={`${styles.labelCell} ${styles.cell}`} />
                <td className={`${styles.valueCell} ${styles.cell}`} />
              </React.Fragment>
            ))}
            {/* Handle odd remaining cell if needed */}
            {maxPairsPerVisualRow * 2 - usedCells === 1 && <td className={`${styles.labelCell} ${styles.cell}`} />}
          </tr>
        )
      })}
    </>
  )
}

interface HorizontalTableProps extends Omit<TablePropsHorizontal, 'type'> {
  dataSource?: any
}

export const HorizontalTable: React.FC<HorizontalTableProps> = ({ dataSource = null, ...optionsProp }) => {
  const options: TablePropsHorizontal = {
    ...instanceTableDefaultOptions(tForRPPreview),
    ...optionsProp,
    type: 'horizontalTable',
  }

  const { columns, className, noDataText, loading } = options

  if (loading) {
    return (
      <table className={`${styles.horizontalTable} ${styles.bordered} ${className || ''}`}>
        <tbody>
          <Spin />
        </tbody>
      </table>
    )
  }

  if (!columns || columns.length === 0 || !dataSource || Object.keys(dataSource).length === 0) {
    return (
      <table className={`${styles.horizontalTable} ${styles.bordered} ${className || ''}`}>
        <tbody>
          <NoDataRow colSpan={6} message={noDataText} />
        </tbody>
      </table>
    )
  }

  return (
    <ErrorBoundary>
      <table className={`${styles.horizontalTable} ${styles.bordered} ${className || ''}`}>
        <tbody>
          {columns.map((rowColumns, rowIndex) => (
            <TableRow key={rowIndex} rowColumns={rowColumns} dataSource={dataSource} />
          ))}
        </tbody>
      </table>
    </ErrorBoundary>
  )
}
