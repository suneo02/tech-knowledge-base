import React, { useMemo, useState } from 'react'
import { Drawer, Typography } from 'antd'
import { Button, Popover } from '@wind/wind-ui'
import { RatiohalfO } from '@wind/icons'
import styles from './index.module.less'
import { createStockCodeAwareMarkdownRenderer } from '@/utils/md'
import { isDev } from '@/utils/env'

export interface MarkdownCellProps {
  value: unknown
  title?: React.ReactNode
  expandAll?: boolean
  allowExpand?: boolean
  labels?: {
    openDrawer: string
    view: string
  }
  rawHtml?: boolean
}

const PREFIX = 'company-directory-markdown-cell'

export const MarkdownCell: React.FC<MarkdownCellProps> = ({
  value,
  title,
  expandAll,
  allowExpand = true,
  labels,
  rawHtml,
}) => {
  const [open, setOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const source = ((value ?? '') as string) || ''
  const renderer = useMemo(() => createStockCodeAwareMarkdownRenderer(isDev), [])
  const html = useMemo(() => (rawHtml ? source : renderer.render(source)), [renderer, source, rawHtml])
  const plain = useMemo(() => html.replace(/<[^>]+>/g, ''), [html])

  const expanded = !!expandAll && !!allowExpand

  if (expanded) {
    return (
      <div className={styles[`${PREFIX}-cellWrapper`]}>
        <div
          className={`${styles[`${PREFIX}-fullText`]} ${styles[`${PREFIX}-cellExpandedContent`]}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
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
        <Drawer open={open} onClose={() => setOpen(false)} title={title} placement="right" width={520}>
          <div className={styles[`${PREFIX}-fullText`]} dangerouslySetInnerHTML={{ __html: html }} />
        </Drawer>
      </div>
    )
  }

  return (
    <div className={`${styles[`${PREFIX}-cellWrapper`]} ${styles[`${PREFIX}-cellInline`]}`}>
      <Typography.Paragraph
        className={styles[`${PREFIX}-oneLine`]}
        ellipsis={{ rows: 1 }}
        style={{ marginBottom: 0, paddingRight: 48 }}
      >
        {plain}
      </Typography.Paragraph>
      <Popover
        visible={popoverOpen}
        onVisibleChange={(next: boolean) => setPopoverOpen(next)}
        trigger="click"
        content={
          <div className={styles[`${PREFIX}-fullText`]} style={{ maxWidth: 520, maxHeight: 300, overflow: 'auto' }}>
            <div className={styles[`${PREFIX}-fullText`]} dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        }
      >
        <Button
          size="small"
          type="text"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          style={{ marginRight: 22 }}
        >
          {labels?.view}
        </Button>
      </Popover>
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
      <Drawer open={open} onClose={() => setOpen(false)} title={title} placement="right" width={520}>
        <div className={styles[`${PREFIX}-fullText`]} dangerouslySetInnerHTML={{ __html: html }} />
      </Drawer>
    </div>
  )
}
