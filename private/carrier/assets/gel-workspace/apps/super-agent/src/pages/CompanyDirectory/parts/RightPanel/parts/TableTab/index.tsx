import { useDebounceFn } from 'ahooks'
import { t } from 'gel-util/intl'
import { useLayoutEffect, useRef, useState } from 'react'
import { DataTable } from '../../../DataTable'
import type { BasicColumn, BasicRecord } from '../../../DataTable/types'
import { SearchToolbar } from '../../../SearchToolbar'
import styles from './index.module.less'

const PREFIX = 'company-directory-table-tab'

export interface TableTabProps {
  columns: BasicColumn[]
  columnsLoading: boolean
  selectedId?: number
  dataSource: BasicRecord[]
  onSearch?: (query: string) => void
  totalCount?: number
  pagingRestricted?: boolean
  pagination?: {
    current: number
    pageSize: number
    onChange?: (page: number, pageSize: number) => void
  }
  totalCandidateCount?: number
  toolbarLoading?: boolean
}

export const TableTab: React.FC<TableTabProps> = (props) => {
  const STRINGS = {
    EXPAND_ALL: t('464124', '展开每行'),
    COLLAPSE_ALL: t('464157', '收起每行'),
  } as const
  const {
    columns,
    columnsLoading,
    dataSource,
    onSearch,
    totalCount,
    totalCandidateCount,
    pagingRestricted = false,
    pagination,
    toolbarLoading,
  } = props
  console.log('🚀 ~ TableTab ~ pagingRestricted:', pagingRestricted)
  const [expandAll, setExpandAll] = useState(false)
  const [search, setSearch] = useState('')
  const [tableKey, setTableKey] = useState(0)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [debouncedHeight, setDebouncedHeight] = useState<number>(0)

  const { run: handleResize } = useDebounceFn(
    (height: number) => {
      console.log('[TableTab] handleResize', height)
      setDebouncedHeight(height)
    },
    { wait: 200 }
  )

  useLayoutEffect(() => {
    if (!tableContainerRef.current) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        handleResize(entry.contentRect.height)
      }
    })
    observer.observe(tableContainerRef.current)
    return () => observer.disconnect()
  }, [handleResize])

  return (
    <div className={`${styles[`${PREFIX}-container`]}`}>
      <div className={`${styles[`${PREFIX}-top`]}`}>
        <SearchToolbar
          value={search}
          onChange={setSearch}
          totalCount={totalCount}
          onSearch={(val) => {
            const q = typeof val === 'string' ? val : search
            onSearch?.(q)
            // 通过重新挂载表格实例确保分页重置到第一页
            setTableKey((k) => k + 1)
          }}
          onExpandAll={() => setExpandAll((v) => !v)}
          expandButtonText={expandAll ? STRINGS.COLLAPSE_ALL : STRINGS.EXPAND_ALL}
          totalCandidateCount={totalCandidateCount}
          loading={toolbarLoading}
        />
        <div className={`${styles[`${PREFIX}-top-divider`]}`} />
      </div>
      <div className={`${styles[`${PREFIX}-tableWrap`]}`} style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            inset: '0',
            display: 'flex',
            // alignItems: 'flex-end',
            overflow: 'hidden',
          }}
          ref={tableContainerRef}
        >
          <DataTable
            key={tableKey}
            columns={columns}
            dataSource={dataSource}
            loading={columnsLoading}
            height={debouncedHeight ? debouncedHeight - 80 : 0}
            expandAll={expandAll}
            pagingRestricted={pagingRestricted}
            totalCount={totalCount}
            pagination={pagination}
          />
          {/* 我在底部 */}
        </div>
      </div>
    </div>
  )
}

export default TableTab
