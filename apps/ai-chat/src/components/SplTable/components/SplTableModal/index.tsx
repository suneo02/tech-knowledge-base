import { maskName } from '@/utils/mask'
import { Modal } from '@wind/wind-ui'
import Table, { ColumnProps } from '@wind/wind-ui-table'
import { SplTable } from 'gel-api'
import { FC, useMemo } from 'react'
import { ModalHeader } from '../ModalHeader'
import { TableOverlay } from '../TableOverlay'
import type { HeaderItem, RowItem } from '@/components/ChatRoles/RolesSuperChat/SplTable/components'
import {
  buildColumns,
  buildDataSource,
  DEFAULT_COLUMN_WIDTH,
} from '@/components/ChatRoles/RolesSuperChat/SplTable/components'

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
    const headers = (tableInfo.headers || []) as HeaderItem[]
    const rows = (tableInfo.rows || []) as RowItem[]
    const baseColumns = buildColumns(headers, rows, { enableLinking: true, defaultWidth: DEFAULT_COLUMN_WIDTH })
    // Desensitization for rows beyond index > 9, while keeping link rendering
    return baseColumns.map((col) => ({
      ...col,
      render: (text: string, record: Record<string, unknown>, index?: number) => {
        const display = index !== undefined && index > 9 ? maskName(text) : text
        return col.render ? col.render(display, record, index) : display
      },
    }))
  }, [tableInfo.headers, tableInfo.rows])

  const dataSource = useMemo(() => {
    if (!tableInfo?.rows || !tableInfo.headers) return []
    const headers = (tableInfo.headers || []) as HeaderItem[]
    const rows = (tableInfo.rows || []) as RowItem[]
    return buildDataSource(headers, rows)
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
        <Table columns={columns} scroll={{ x: '100%' }} dataSource={finalDataSource} pagination={false} />
      </div>
    </Modal>
  )
}
