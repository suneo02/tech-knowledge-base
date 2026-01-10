import { useThrottleFn } from 'ahooks'
import { Table } from 'antd'
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { buildColumns } from './buildColumns'
import type { BasicColumn, BasicRecord } from './types'
import styles from './index.module.less'
import { InterestSurvey } from './InterestSurvey'
import { postPointBuried, SUPER_AGENT_BURY_POINTS } from '@/utils/bury'
import { message } from '@wind/wind-ui'
import { CellRegistryProvider } from '@/components/CellRegistry'
import { ColumnDataTypeEnum } from 'gel-api'
import { CompanyRenderer, PhoneRenderer, TagRenderer } from './renderers'
import { t } from 'gel-util/intl'

export interface DataTableProps {
  columns: BasicColumn[]
  dataSource: BasicRecord[]
  loading?: boolean
  height?: number
  expandAll?: boolean
  denyExpandColumns?: string[]
  shouldExpandCell?: (record: BasicRecord, column: BasicColumn) => boolean
  pagingRestricted?: boolean
  totalCount?: number
  pagination?: {
    current: number
    pageSize: number
    onChange?: (page: number, pageSize: number) => void
  }
}

const PREFIX = 'company-directory-data-table'
const DEFAULT_TABLE_FOOTER_HEIGHT = 24 // 页码整体高度24px
const DEFAULT_SCROLL_THRESHOLD = 2 // 滚动安全阈值

export const DataTable: React.FC<DataTableProps> = React.memo(
  ({
    columns,
    dataSource,
    loading,
    height,
    expandAll = false,
    denyExpandColumns = [],
    shouldExpandCell,
    pagingRestricted,
    totalCount,
    pagination: controlledPagination,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [internalPagination, setInternalPagination] = useState<{ current: number; pageSize: number }>({
      current: 1,
      pageSize: 20,
    })
    const [enableYScroll, setEnableYScroll] = useState(true)

    const pagination = useMemo(() => {
      if (controlledPagination) {
        return {
          current: controlledPagination.current,
          pageSize: controlledPagination.pageSize,
          onChange: controlledPagination.onChange,
        }
      }
      return {
        current: internalPagination.current,
        pageSize: internalPagination.pageSize,
        onChange: (page: number, pageSize?: number) =>
          setInternalPagination({ current: page, pageSize: pageSize ?? internalPagination.pageSize }),
      }
    }, [controlledPagination, internalPagination])

    const initialRenderers = useMemo(
      () => [
        { type: 'company', renderer: CompanyRenderer },
        { type: 'phone', renderer: PhoneRenderer },
        { type: String(ColumnDataTypeEnum.TAG), renderer: TagRenderer },
      ],
      []
    )

    // 节流计算滚动条，避免 ResizeObserver 高频触发导致卡顿
    const { run: calculateScroll } = useThrottleFn(
      () => {
        if (!containerRef.current) return
        const tbody = containerRef.current.querySelector('.ant-table-tbody')
        const thead = containerRef.current.querySelector('.ant-table-thead')
        const placeholder = containerRef.current.querySelector('.ant-table-placeholder') // Empty state
        if (height) {
          let contentHeight = 0
          if (tbody) {
            contentHeight += tbody.scrollHeight
          }
          if (thead) {
            contentHeight += thead.clientHeight
          }
          // If empty (placeholder exists), usually we don't need scroll unless placeholder is huge
          if (placeholder) {
            contentHeight = thead ? thead.clientHeight + placeholder.clientHeight : placeholder.clientHeight
          }

          // Add a small threshold (e.g. 2px) to avoid flickering
          const shouldEnable = contentHeight - DEFAULT_TABLE_FOOTER_HEIGHT > height + DEFAULT_SCROLL_THRESHOLD

          setEnableYScroll((prev) => {
            if (prev !== shouldEnable) {
              return shouldEnable
            }
            return prev
          })
        }
      },
      { wait: 100, leading: true, trailing: true }
    )

    useLayoutEffect(() => {
      calculateScroll()

      if (!containerRef.current) return

      // Optional: Add ResizeObserver for more robust handling
      const resizeObserver = new ResizeObserver(() => {
        calculateScroll()
      })

      resizeObserver.observe(containerRef.current)
      const tbody = containerRef.current.querySelector('.ant-table-tbody')

      if (tbody) resizeObserver.observe(tbody)

      return () => {
        resizeObserver.disconnect()
      }
    }, [dataSource, height, columns, loading, calculateScroll, expandAll])

    const processedColumns = useMemo(() => {
      const _columns = buildColumns({ columns, expandAll, denyExpandColumns, shouldExpandCell, pagination })

      return _columns
    }, [columns, expandAll, denyExpandColumns, shouldExpandCell, pagination])

    const tableScroll = useMemo(() => {
      return { x: '100%', y: enableYScroll ? Math.max(0, height ?? 0 - 12) : undefined, scrollToFirstRowOnChange: true }
    }, [enableYScroll, height])

    const showSurvey = pagingRestricted && pagination.current > 1

    return (
      <CellRegistryProvider initialRenderers={initialRenderers}>
        <div ref={containerRef} className={`${styles[`${PREFIX}-container`]}`}>
          <Table
            size="small"
            columns={processedColumns as unknown as Array<Record<string, unknown>>}
            dataSource={showSurvey ? [] : dataSource}
            locale={
              showSurvey
                ? {
                    emptyText: (
                      <InterestSurvey
                        onInterest={() => {
                          postPointBuried(SUPER_AGENT_BURY_POINTS.CO_CREATION, { action: 'click_interest' })
                          message.success(t('482218', '已记录您的意向，感谢您的关注！'))
                        }}
                      />
                    ),
                  }
                : undefined
            }
            loading={loading}
            tableLayout="fixed"
            scroll={tableScroll}
            showSorterTooltip
            pagination={{
              locale: {
                page: t('32047', '页'),
                jump_to: t('134821', '跳至'),
              },
              showSizeChanger: false,
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: totalCount,
              onChange: pagination.onChange,
              showQuickJumper: true,
            }}
            bordered
          />
        </div>
      </CellRegistryProvider>
    )
  }
)
