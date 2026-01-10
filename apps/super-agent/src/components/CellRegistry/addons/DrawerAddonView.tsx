import React, { useMemo, useRef, useState } from 'react'
import { Drawer, Popover, Typography } from 'antd'
import { Button } from '@wind/wind-ui'
import { DownO, InfoCircleO, RatiohalfO, UpO } from '@wind/icons'
import { TableContext } from '@/pages/CompanyDirectory/parts/DataTable/context'
import { useCellRender, STRINGS } from '@/components/CellRegistry'
import type { RenderParams } from '@/components/CellRegistry'

// 注意：此文件仅包含组件定义，不导出非组件以遵守 react-refresh 规则

interface DrawerWrapperProps {
  baseNode: React.ReactNode
  params: RenderParams
}

const DrawerWrapper: React.FC<DrawerWrapperProps> = ({ baseNode, params }) => {
  const { value, record, column, mode } = params
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState<number>(() => 0)
  const listRef = useRef<HTMLDivElement>(null)
  const ctx = React.useContext(TableContext)
  const { renderCell } = useCellRender()

  const dataList = useMemo(() => ctx?.dataSource ?? [record], [ctx?.dataSource, record])
  const visibleColumns = useMemo(() => {
    const cols = ctx?.columns ?? [column]
    return cols.filter((c) => c?.dataIndex && c?.disableExpand !== true)
  }, [ctx?.columns, column])

  const currentIndex = Math.min(Math.max(0, index), Math.max(0, dataList.length - 1))
  const currentRecord = useMemo(() => dataList[currentIndex] ?? record, [dataList, currentIndex, record])
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < Math.max(0, dataList.length - 1)

  // 打开时滚动到对应列
  React.useEffect(() => {
    if (!open) return
    const key = column?.dataIndex
    if (!key) return
    const target = listRef.current?.querySelector(`[data-col-key="${key}"]`)
    if (target && 'scrollIntoView' in target) {
      ;(target as HTMLElement).scrollIntoView({ block: 'start' })
    }
  }, [open, column?.dataIndex, currentIndex])

  // expanded 模式：展示全文 + 抽屉入口
  if (mode === 'expanded') {
    return (
      <div style={{ position: 'relative' }}>
        <div>{baseNode}</div>
        <span
          role="button"
          aria-label="open-drawer"
          title="open"
          onClick={(e) => {
            e.stopPropagation()
            setOpen(true)
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget.firstElementChild as HTMLElement | null
            if (el) el.style.color = 'var(--basic-4)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget.firstElementChild as HTMLElement | null
            if (el) el.style.color = 'var(--basic-12)'
          }}
          style={{ position: 'absolute', right: 0, top: 0, cursor: 'pointer' }}
        >
          <RatiohalfO size={16} style={{ color: 'var(--basic-12)', transition: 'color 0.2s ease' }} />
        </span>
        <Drawer open={open} onClose={() => setOpen(false)} placement="right" width={520}>
          <HeaderControls
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPrev={() => setIndex((i) => Math.max(0, i - 1))}
            onNext={() => setIndex((i) => Math.min(dataList.length - 1, i + 1))}
            onClose={() => setOpen(false)}
          />
          <div ref={listRef} style={{ padding: 12 }}>
            {visibleColumns.map((col) => {
              const key = String(col.dataIndex)
              const label = col.title as React.ReactNode
              const rawValue = (currentRecord as Record<string, unknown>)[key]
              return (
                <div
                  key={key}
                  data-col-key={key}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr',
                    gap: 12,
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border-color-split)',
                  }}
                >
                  <div style={{ color: 'var(--font-color-2)' }}>{label}</div>

                  <div>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {renderCell({ value: rawValue, record: currentRecord, column: col as any, mode: 'expanded' })}
                  </div>
                </div>
              )
            })}
          </div>
        </Drawer>
      </div>
    )
  }

  // inline 模式：单行省略 + 信息 Popover（仅 md）+ 抽屉入口
  const maybeInfo = column?.type === 'md'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
      <Typography.Paragraph style={{ marginBottom: 0, flex: 1 }} ellipsis={{ rows: 1 }}>
        {baseNode}
      </Typography.Paragraph>
      {maybeInfo && (
        <Popover
          content={
            <div style={{ maxWidth: 420, maxHeight: '40vh', overflow: 'auto' }}>
              {renderCell({ value, record, column, mode: 'expanded' })}
            </div>
          }
        >
          <InfoCircleO style={{ cursor: 'pointer', color: 'var(--icon-color)' }} />
        </Popover>
      )}
      <span
        role="button"
        aria-label="open-drawer"
        title="open"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget.firstElementChild as HTMLElement | null
          if (el) el.style.color = 'var(--basic-4)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget.firstElementChild as HTMLElement | null
          if (el) el.style.color = 'var(--basic-12)'
        }}
        style={{ cursor: 'pointer' }}
      >
        <RatiohalfO size={16} style={{ color: 'var(--basic-12)', transition: 'color 0.2s ease' }} />
      </span>
      <Drawer open={open} onClose={() => setOpen(false)} placement="right" width={520}>
        <HeaderControls
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={() => setIndex((i) => Math.max(0, i - 1))}
          onNext={() => setIndex((i) => Math.min(dataList.length - 1, i + 1))}
          onClose={() => setOpen(false)}
        />
        <div ref={listRef} style={{ padding: 12 }}>
          {visibleColumns.map((col) => {
            const key = String(col.dataIndex)
            const label = col.title as React.ReactNode
            const rawValue = (currentRecord as Record<string, unknown>)[key]
            return (
              <div
                key={key}
                data-col-key={key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  gap: 12,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border-color-split)',
                }}
              >
                <div style={{ color: 'var(--font-color-2)' }}>{label}</div>

                <div>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {renderCell({ value: rawValue, record: currentRecord, column: col as any, mode: 'expanded' })}
                </div>
              </div>
            )
          })}
        </div>
      </Drawer>
    </div>
  )
}

interface HeaderControlsProps {
  hasPrev: boolean
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}

const HeaderControls: React.FC<HeaderControlsProps> = ({ hasPrev, hasNext, onPrev, onNext, onClose }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottom: '1px solid var(--border-color-split)',
      }}
    >
      <div>
        <Button size="small" onClick={onPrev} type="text" icon={<UpO />} disabled={!hasPrev} />
        <Button size="small" onClick={onNext} type="text" icon={<DownO />} disabled={!hasNext} />
      </div>
      <div>
        <Button size="small" onClick={onClose}>
          {STRINGS.CLOSE}
        </Button>
      </div>
    </div>
  )
}

export default DrawerWrapper
