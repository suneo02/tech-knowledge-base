import { maskName } from '@/utils/mask'
import { Modal } from '@wind/wind-ui'
import Table, { ColumnProps } from '@wind/wind-ui-table'
import { SplTable } from 'gel-api'
import { FC, useMemo } from 'react'
import { ModalHeader } from '../ModalHeader'
import { TableOverlay } from '../TableOverlay'
import styles from './index.module.less'

const PREFIX = 'spl-table-modal'

const PaddedData = (data: Record<string, unknown>[], columns: ColumnProps<Record<string, unknown>>[]) => {
  if (data.length > 10 && data.length < 20) {
    const paddingCount = 20 - data.length
    const padding = Array.from({ length: paddingCount }, () =>
      columns.reduce(
        (acc, col) => {
          if (col.dataIndex) {
            acc[col.dataIndex as string] = ''
          }
          return acc
        },
        {} as Record<string, unknown>
      )
    )
    return [...data, ...padding]
  }
  return data
}

export const SplTableModal: FC<{
  visible: boolean
  onClose: () => void
  tableInfo: SplTable
  tableIndex: number
  onInsert: () => void
  loading: boolean
  enableInsert: boolean
}> = ({ visible, onClose, tableInfo, tableIndex, onInsert, loading, enableInsert }) => {
  const columns: ColumnProps<Record<string, unknown>>[] = useMemo(() => {
    if (!tableInfo.headers) return []
    return tableInfo.headers
      .filter((res) => res.isShow !== false)
      .map((res) => ({
        title: res.title,
        dataIndex: res.columnId.toString(),
        width: 150,
        ellipsis: true,
      }))
  }, [tableInfo.headers])

  const dataSource = useMemo(() => {
    if (!tableInfo?.rows) return []
    return tableInfo.rows.map((row) => {
      const item: Record<string, unknown> = {}
      tableInfo.headers.forEach((header, index) => {
        if (header.isShow === false) {
          return // Skip hidden columns to prevent data misalignment
        }

        const dataIndex = header.columnId.toString()
        const val = row[index]

        if (typeof val === 'string' && (val.includes('Label') || val.includes('answer'))) {
          try {
            item[dataIndex] = JSON.parse(val).Label || JSON.parse(val).answer || '--'
          } catch {
            item[dataIndex] = val || '--'
          }
        } else {
          item[dataIndex] = val || '--'
        }
      })
      return item
    })
  }, [tableInfo.rows, tableInfo.headers])

  const paddedDataSource = useMemo(() => PaddedData(dataSource, columns), [dataSource, columns])
  const finalDataSource = paddedDataSource.slice(0, 20)

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      width={'70%'}
      style={{ minWidth: 900, maxWidth: 1920 }}
      destroyOnClose
      footer={null}
      closable={false}
      bodyStyle={{ padding: '4px 12px 12px 12px' }}
    >
      <ModalHeader title={tableInfo.title} onClose={onClose} />
      <div style={{ position: 'relative' }}>
        {dataSource.length > 10 && (
          <TableOverlay
            totalRows={tableInfo.rows.length}
            tableIndex={tableIndex}
            onInsert={onInsert}
            loading={loading}
            enableInsert={enableInsert}
          />
        )}
        <Table
          columns={columns.map((col) => ({
            ...col,
            render: (text: string, record: Record<string, unknown>, index?: number) =>
              index !== undefined && index > 9 ? maskName(text) : text,
          }))}
          scroll={{ x: '100%' }}
          dataSource={finalDataSource}
          pagination={false}
        />
      </div>
    </Modal>
  )
}
