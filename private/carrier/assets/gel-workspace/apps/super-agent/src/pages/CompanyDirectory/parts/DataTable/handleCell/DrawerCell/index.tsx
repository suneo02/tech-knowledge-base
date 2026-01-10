import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Drawer, Popover, Typography } from 'antd'
import { Button } from '@wind/wind-ui'
import { DownO, InfoCircleO, RatiohalfO, UpO } from '@wind/icons'
import styles from './index.module.less'
import type { BasicRecord } from '../../types'
import { TableContext } from '../../context'
import { t } from '../../common'
import { createStockCodeAwareMarkdownRenderer } from '@/utils/md'
import { isDev } from '@/utils/env'
import CList from '@/components/CList'

export interface DrawerCellProps {
  value: unknown
  record: BasicRecord
  title?: React.ReactNode
  dataIndex?: string
  rowIndex?: number
  expandAll?: boolean
  columnType?: string | import('gel-api').ColumnDataTypeEnum
  labels?: {
    openDrawer: string
    generate: string
    generating: string
    view?: string
  }
}

const PREFIX = 'company-directory-drawer-cell'

export const DrawerCell: React.FC<DrawerCellProps> = ({
  value,
  record,
  dataIndex,
  rowIndex = 0,
  expandAll,
  columnType,
  labels,
  title,
}) => {
  const STOCK_MD = useMemo(() => createStockCodeAwareMarkdownRenderer(isDev), [])
  const [open, setOpen] = useState(false)
  const ctx = React.useContext(TableContext)
  const listRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState<number>(rowIndex)
  const statusKey = useMemo(() => (dataIndex ? `${dataIndex}Status` : 'status'), [dataIndex])
  const initialStatus = (record?.[statusKey] as number | undefined) ?? (value ? 2 : 0)
  const [localStatus, setLocalStatus] = useState<number>(initialStatus)

  const showGenerate = localStatus === 0
  const isGenerating = localStatus === 1

  const content = title || ((value ?? '') as React.ReactNode)

  const visibleColumns = useMemo(() => {
    const cols = ctx?.columns ?? []
    return cols.filter((c) => c?.dataIndex && c?.disableExpand !== true)
  }, [ctx?.columns])

  const dataList = useMemo(() => ctx?.dataSource ?? [], [ctx?.dataSource])

  const currentIndex = index
  const currentRecord = useMemo<BasicRecord>(() => {
    return (dataList?.[currentIndex] as BasicRecord) ?? record
  }, [dataList, currentIndex, record])
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < Math.max(0, dataList.length - 1)

  useEffect(() => {
    if (!open) return
    const key = dataIndex
    if (!key) return
    const target = listRef.current?.querySelector(`[data-col-key="${key}"]`)
    if (target && 'scrollIntoView' in target) {
      ;(target as HTMLElement).scrollIntoView({ block: 'start' })
    }
  }, [open, dataIndex, currentIndex])

  if (showGenerate) {
    return (
      <div className={styles[`${PREFIX}-cellWrapper`]} onClick={() => setLocalStatus(1)}>
        <Button type="primary" size="small">
          {labels?.generate}
        </Button>
      </div>
    )
  }

  if (isGenerating) {
    return <div className={styles[`${PREFIX}-cellWrapper`]}>{labels?.generating}</div>
  }

  if (expandAll) {
    return (
      <div className={styles[`${PREFIX}-cellWrapper`]}>
        <div className={`${styles[`${PREFIX}-fullText`]} ${styles[`${PREFIX}-cellExpandedContent`]}`}>{content}</div>
        <span
          className={`${styles[`${PREFIX}-cellActionIcon`]} ${styles[`${PREFIX}-cellActionIconExpanded`]}`}
          role="button"
          aria-label={labels?.openDrawer}
          title={labels?.openDrawer}
          onClick={(e) => {
            e.stopPropagation()
            setOpen(true)
          }}
        >
          <RatiohalfO size={16} />
        </span>
        <Drawer open={open} onClose={() => setOpen(false)} placement="right" width={520}>
          <div className={styles[`${PREFIX}-drawerHeader`]}>
            <div className={styles[`${PREFIX}-drawerHeaderLeft`]}>
              <Button
                size="small"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                type="text"
                icon={<UpO />}
                disabled={!hasPrev}
              />

              <Button
                size="small"
                onClick={() => setIndex((i) => Math.min(dataList.length - 1, i + 1))}
                type="text"
                icon={<DownO />}
                disabled={!hasNext}
              />
            </div>
            <div className={styles[`${PREFIX}-drawerHeaderRight`]}>
              <Button size="small" onClick={() => setOpen(false)}>
                {t('6653', '关闭')}
              </Button>
            </div>
          </div>
          <div ref={listRef} className={styles[`${PREFIX}-drawerList`]}>
            <CList dataSource={[currentRecord]} columns={visibleColumns} expandAll={true} />
          </div>
        </Drawer>
      </div>
    )
  }

  return (
    <div className={`${styles[`${PREFIX}-cellWrapper`]} ${styles[`${PREFIX}-cellInline`]}`}>
      <Typography.Paragraph
        className={styles[`${PREFIX}-oneLine`]}
        ellipsis={{ rows: 1 }}
        style={{ marginBottom: 0, paddingRight: columnType === 'md' ? 120 : 18 }}
      >
        {content}
      </Typography.Paragraph>
      {columnType === 'md' && (
        <Popover
          content={(() => {
            const source = typeof value === 'string' ? value : String(value ?? '')
            const html = STOCK_MD.render(source)
            return (
              <div
                style={{ maxWidth: 420, maxHeight: '40vh', overflow: 'auto' }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )
          })()}
        >
          <InfoCircleO className={styles[`${PREFIX}-cellActionButtonInline`]} />
        </Popover>
      )}
      <span
        className={styles[`${PREFIX}-cellActionIconInline`]}
        role="button"
        aria-label={labels?.openDrawer}
        title={labels?.openDrawer}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <RatiohalfO size={16} />
      </span>
      <Drawer open={open} onClose={() => setOpen(false)} placement="right" width={520}>
        <div className={styles[`${PREFIX}-drawerHeader`]}>
          <div className={styles[`${PREFIX}-drawerHeaderLeft`]}>
            <Button
              size="small"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              type="text"
              icon={<UpO />}
              disabled={!hasPrev}
            />
            <Button
              size="small"
              onClick={() => setIndex((i) => Math.min(dataList.length - 1, i + 1))}
              type="text"
              icon={<DownO />}
              disabled={!hasNext}
            />
          </div>
          <div className={styles[`${PREFIX}-drawerHeaderRight`]}>
            <Button size="small" onClick={() => setOpen(false)}>
              {t('6653', '关闭')}
            </Button>
          </div>
        </div>
        <div ref={listRef} className={styles[`${PREFIX}-drawerList`]}>
          <CList dataSource={[currentRecord]} columns={visibleColumns} expandAll={true} />
        </div>
      </Drawer>
    </div>
  )
}
