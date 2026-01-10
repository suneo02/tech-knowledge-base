import React from 'react'
import type { ColumnProps } from '@wind/wind-ui-table'
import { generateUrlByModule, handleJumpTerminalCompatible, LinkModule } from 'gel-util/link'
import type { HeaderItem, RowItem } from '../types'
import { getIdColumnIndex } from '../utils/getIdColumnIndex'

export const generateCompanyLink = (rawId: unknown): string | null => {
  if (rawId == null) return null
  let companycode: string | number = rawId as string | number
  if (typeof rawId === 'string' && rawId.startsWith('{')) {
    try {
      const parsed = JSON.parse(rawId)
      companycode = parsed.id || parsed.companycode || parsed.Label || parsed.answer || rawId
    } catch {
      // ignore parse error, fallback to raw value
    }
  }
  const companycodeStr = String(companycode)
  const url = generateUrlByModule({ module: LinkModule.COMPANY_DETAIL, params: { companycode: companycodeStr } })
  return url || null
}

export const buildLinkRenderer = (
  header: HeaderItem,
  headers: HeaderItem[],
  rows: RowItem[]
): ColumnProps<Record<string, unknown>>['render'] => {
  const idColumnIndex = getIdColumnIndex(headers, header)

  return function SplTableLinkCellRenderer(text: string, _record: Record<string, unknown>, rowIndex?: number) {
    if (idColumnIndex == null || rowIndex == null) return text

    const rawId = rows?.[rowIndex]?.[idColumnIndex]
    const url = generateCompanyLink(rawId)
    if (!url) return text

    const onLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      handleJumpTerminalCompatible(url, false)
    }

    const displayText = text == null ? '--' : String(text)

    return (
      <div
        title={displayText}
        onClick={onLinkClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--click-6)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = ''
        }}
        style={{
          cursor: 'pointer',
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textDecoration: 'underline',
          textUnderlineOffset: 2,
        }}
      >
        {displayText}
      </div>
    )
  }
}
