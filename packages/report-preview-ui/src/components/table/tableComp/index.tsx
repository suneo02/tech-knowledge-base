/**
 * tableComp.tsx
 * 共享表格组件
 */

import classNames from 'classnames'
import React from 'react'
import styles from './index.module.less'

interface NoDataElementProps {
  message?: string
  className?: string
}

/**
 * 无数据提示组件
 */
export const NoDataElement: React.FC<NoDataElementProps> = ({ message = '暂无数据', className = '' }) => (
  <div className={classNames(styles.tableNoData, className)}>
    <span className={styles.noDataInner}>{message}</span>
  </div>
)

interface NoDataRowProps {
  colSpan: number
  message?: string
}

/**
 * 表格中的无数据提示行组件
 */
export const NoDataRow: React.FC<NoDataRowProps> = ({ colSpan, message = '暂无数据' }) => (
  <tr className={styles.noDataRow}>
    <td colSpan={colSpan} className={styles.noDataCell}>
      <div className={styles.noDataInner}>{message}</div>
    </td>
  </tr>
)

// For backward compatibility with the old function-based usage
export function createNoDataElement(message: string = '暂无数据', className: string = ''): React.ReactElement {
  return <NoDataElement message={message} className={className} />
}

export function createNoDataRow(colSpan: number, message: string = '暂无数据'): React.ReactElement {
  return <NoDataRow colSpan={colSpan} message={message} />
}
