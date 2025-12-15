import { Typography } from '@wind/wind-ui'
import { TableProps } from '@wind/wind-ui-table'
import { CDEFilterResItem, CDEMeasureItem } from 'gel-api'
import { numberFormat } from 'gel-util/format'
import { isEn } from 'gel-util/intl'
import React from 'react'
import { getColumnsWidth, operPeriodFormat } from './utils'

type ColumnConfig = NonNullable<TableProps<CDEFilterResItem>['columns']>[number]

// Common title wrapper component
const ColumnTitle: React.FC<{ name: string }> = ({ name }) => <span>{name}</span>

// Date formatting utility
const formatDate = (text: string): string => {
  if (!text) return ''
  const year = text.substring(0, 4)
  const month = text.substring(4, 6)
  const day = text.substring(6, 8)
  return isEn() ? `${year}/${month}/${day}` : `${year}年${month}月${day}日`
}

// Number formatting utility
const formatNumber = (value: unknown, options?: { decimals?: number; withComma?: boolean }): string => {
  if (value === null || value === undefined || isNaN(Number(value))) return ''
  const num = Number(value)
  if (num === 0) return '0'
  return numberFormat(num, options?.withComma ?? true, options?.decimals ?? 2)
}

// Reusable cell component with tooltip
interface CellProps {
  value: React.ReactNode
  tooltip?: string
  className?: string
}

const Cell: React.FC<CellProps> = ({ value, tooltip, className }) => {
  const displayValue = value ?? '--'
  const tooltipValue = tooltip ?? (typeof displayValue === 'string' ? displayValue : '--')

  return (
    // @ts-expect-error wind ui
    <Typography
      ellipsis={{
        tooltip: tooltipValue,
      }}
      className={className}
    >
      {displayValue}
    </Typography>
  )
}

// Base column configuration
const createBaseConfig = (item: CDEMeasureItem): ColumnConfig => ({
  key: item.field,
  dataIndex: item.field,
  width: getColumnsWidth(item.field),
  title: <ColumnTitle name={item.title} />,
})

// Column render functions
const renderFunctions = {
  // Date column renderer
  renderDate: (text: any) => {
    if (text === undefined) return <Cell value="--" />
    const formattedDate = text ? formatDate(String(text)) : '--'
    return <Cell value={formattedDate} />
  },

  // Operation period renderer
  renderOperPeriod: (_text: any, record: CDEFilterResItem) => {
    if (_text === undefined) return <Cell value="--" />
    const formatted = operPeriodFormat(record) || '--'
    return <Cell value={formatted} />
  },

  // Number renderer with right alignment
  renderNumber: (text: any, options?: { decimals?: number; withComma?: boolean }) => {
    if (text === undefined) return <Cell value="--" className="number" />
    const formattedNum = formatNumber(text, options) || '--'
    return <Cell value={formattedNum} className="number" />
  },

  // Contact renderer
  renderContact: (text: any) => {
    if (text === undefined) return <Cell value="--" />
    const displayText = String(text)
    const className = displayText.includes('***') ? 'marginRight20' : ''
    return <Cell value={displayText} className={className} />
  },

  // Trademark/Patent renderer
  renderTrademarkPatent: (text: any) => {
    if (text === undefined) return <Cell value="--" className="number" />
    const formattedNum = formatNumber(text, { decimals: 0 })
    if (!formattedNum && text !== 0) return <Cell value="--" className="number" />
    return <Cell value={formattedNum || '0'} className="number" />
  },

  // Default renderer
  renderDefault: (text: any) => {
    if (text === undefined) return <Cell value="--" />
    return <Cell value={String(text)} />
  },
}

// Column configuration factory
const createColumnConfig = (baseConfig: ColumnConfig, item: CDEMeasureItem): ColumnConfig => {
  const fieldType = getFieldType(item.field)

  switch (fieldType) {
    case 'date':
      return {
        ...baseConfig,
        render: renderFunctions.renderDate,
      }
    case 'operPeriod':
      return {
        ...baseConfig,
        render: renderFunctions.renderOperPeriod,
      }
    case 'registerCapital':
      return {
        ...baseConfig,
        align: 'right',
        render: (text) => renderFunctions.renderNumber(text, { withComma: true, decimals: 2 }),
      }
    case 'contact':
      return {
        ...baseConfig,
        render: renderFunctions.renderContact,
      }
    case 'scaleNum':
      return {
        ...baseConfig,
        align: 'right',
        render: (text) => renderFunctions.renderNumber(text, { decimals: 0 }),
      }
    case 'trademarkPatent':
      return {
        ...baseConfig,
        align: 'right',
        render: renderFunctions.renderTrademarkPatent,
      }
    default:
      return {
        ...baseConfig,
        render: renderFunctions.renderDefault,
      }
  }
}

// Field type mapping
const getFieldType = (field: string): string => {
  const fieldTypeMap: Record<string, string> = {
    established_time: 'date',
    cancel_time: 'date',
    oper_period_end: 'operPeriod',
    register_capital: 'registerCapital',
    tel: 'contact',
    mail: 'contact',
    industry_gb: 'contact',
    ent_scale_num_indicator: 'scaleNum',
    'count.trademark_num': 'trademarkPatent',
    'count.patent_num': 'trademarkPatent',
  }

  return fieldTypeMap[field] || 'default'
}

// Main export function
export const getColumnConfig = (item: CDEMeasureItem): ColumnConfig => {
  const baseConfig = createBaseConfig(item)
  return createColumnConfig(baseConfig, item)
}
