import { useDebounceEffect, useSize } from 'ahooks'
import { ConfigProvider, Table } from 'antd'
import React, { useMemo, useRef, useState } from 'react'
import { buildColumns } from './buildColumns'
import type { BasicColumn, BasicRecord } from './types'
import styles from './index.module.less'
import { TableContext } from './context'

export interface DataTableProps {
  columns: BasicColumn[]
  dataSource: BasicRecord[]
  loading?: boolean
  height?: number
  expandAll?: boolean
  denyExpandColumns?: string[]
  shouldExpandCell?: (record: BasicRecord, column: BasicColumn) => boolean
}

const PREFIX = 'company-directory-data-table'

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  dataSource,
  loading,
  height,
  expandAll = false,
  denyExpandColumns = [],
  shouldExpandCell,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapSize = useSize(containerRef)
  const [enableYScroll, setEnableYScroll] = useState(true)
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 20 })

  useDebounceEffect(
    () => {
      if (wrapSize?.height && height) {
        const diff = wrapSize?.height - height
        setEnableYScroll(diff > 80)
      }
    },
    [height, wrapSize?.height],
    { wait: 500 }
  )

  const tableScroll = useMemo(() => {
    return { x: '100%', y: enableYScroll ? (height ?? 0) - 12 : undefined, scrollToFirstRowOnChange: true }
  }, [enableYScroll, height])

  const processedColumns = useMemo(() => {
    return buildColumns({ columns, expandAll, denyExpandColumns, shouldExpandCell, pagination })
  }, [columns, expandAll, denyExpandColumns, shouldExpandCell, pagination])
  return (
    <div ref={containerRef} className={`${styles[`${PREFIX}-container`]}`}>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBorderRadius: 0,
              headerBg: 'var(--basic-13)',
            },
            Pagination: {
              borderRadius: 2,
              colorPrimary: 'var(--click-6)',
              colorPrimaryHover: 'var(--click-6)',
              colorPrimaryActive: 'var(--click-6)',
            },
          },
        }}
      >
        <TableContext.Provider value={{ columns, dataSource }}>
          <Table
            size="small"
            columns={processedColumns as unknown as Array<Record<string, unknown>>}
            dataSource={dataSource}
            loading={loading}
            tableLayout="fixed"
            scroll={tableScroll}
            showSorterTooltip
            pagination={{
              showSizeChanger: false,
              current: pagination.current,
              pageSize: pagination.pageSize,
              onChange: (page: number, pageSize?: number) =>
                setPagination({ current: page, pageSize: pageSize ?? pagination.pageSize }),
            }}
            bordered
          />
        </TableContext.Provider>
      </ConfigProvider>
    </div>
  )
}
