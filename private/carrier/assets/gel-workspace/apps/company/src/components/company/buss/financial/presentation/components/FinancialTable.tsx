/**
 * 财务表格组件：根据 `TableModel` 渲染列与行，支持组头悬停高亮与数值格式化。
 * @author yxlu.calvin
 * @example
 * <FinancialTable model={model} eachTableKey="FinancialData" onRowClick={(row) => console.log(row)} />
 * @remarks
 * - 左侧首列固定显示行标题；组头行使用强调样式并支持悬停高亮整组数据
 * - 数值渲染：根据指标键推断百分比与货币格式，空值统一显示 `--`
 * - 数据平铺：将 `rows.values` 展平为列键，保持与 `columns` 同步
 */
import React, { useMemo } from 'react'
import Table from '@wind/wind-ui-table'
import { getTableLocale } from '@/components/company/table/handle'
import { Formatters } from '../../utils/formatters'
import { TableModel, FinancialTableRow } from '../../types'
import { t } from 'gel-util/intl'
import { Tooltip } from '@wind/wind-ui'
import { InfoCircleO } from '@wind/icons'

export const FinancialTable: React.FC<{
  model: TableModel
  onRowClick?: (row: FinancialTableRow) => void
  title?: string
  eachTableKey?: string
  hoveredGroup?: string | null
  onGroupHover?: (group: string | null) => void
  dataLoaded?: boolean
  className?: string
}> = ({
  model,
  onRowClick,
  eachTableKey = 'FinancialData',
  hoveredGroup,
  onGroupHover,
  dataLoaded = true,
  className,
}) => {
  const { columns, rows, meta } = model

  const STRINGS = {
    DEADLINE_DATE: t('24411', '截止日期'),
    REPORT_PERIOD: t('1794', '报告期'),
  } as const

  const formatValue = (value: number | null, metricKey: string) => {
    if (value == null) return '--'
    if (metricKey.endsWith('_Raw')) return Formatters.formatRatio(value)
    if (metricKey.includes('Ratio') || metricKey.includes('Rate')) return Formatters.formatPercentage(value)
    return Formatters.formatCurrency(value, meta?.unitScale)
  }

  const tableColumns = useMemo(
    () => [
      {
        title: (
          <div>
            <div>{STRINGS.DEADLINE_DATE}</div>
            <div style={{ fontSize: 14, padding: '2px 0', fontWeight: 600 }}>{STRINGS.REPORT_PERIOD}</div>
          </div>
        ),
        dataIndex: 'label',
        key: 'label',
        width: 240,
        fixed: 'left' as const,
        onCell: () => ({
          style: { minWidth: 240, maxWidth: 240 },
        }),
        onHeaderCell: () => ({
          style: { minWidth: 240, maxWidth: 240 },
        }),
        render: (_txt: any, row: any) => {
          console.log('🚀 ~ FinancialTable ~ row:', row)
          if (row?.__rowType === 'title') {
            return <div style={{ fontWeight: 600, padding: '8px 0px', fontSize: 14 }}>{row.label}</div>
          }

          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {row.label}
              {row.tooltip && (
                <Tooltip title={row.tooltip} placement="top">
                  {/* @ts-expect-error wind-icon */}
                  <InfoCircleO style={{ marginLeft: 4, color: 'var(--basic-7)', cursor: 'help' }} />
                </Tooltip>
              )}
            </div>
          )
        },
      },
      ...columns.map((period) => ({
        title: (
          <div>
            <div>{period.split('#')[0] || '--'}</div>
            <div style={{ fontSize: 14, padding: '2px 0', fontWeight: 600 }}>
              {model.periodLabels?.[period] || '--'}
            </div>
          </div>
        ),
        dataIndex: period,
        key: period,
        align: 'right' as const,
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            wordBreak: 'normal',
          },
        }),
        render: (_txt: any, row: any) => {
          if (row?.__rowType === 'title') return ''
          return formatValue(row[period], row.key ?? '')
        },
      })),
    ],
    [columns, model.meta, model.periodLabels]
  )

  const dataSource = useMemo(
    () =>
      rows.map((r: any) => {
        const flat: any = {
          label: r.label,
          key: r.key,
          tooltip: r.tooltip,
          __rowType: r.__rowType,
          __group: r.__group,
          __bg: r.__bg,
          __border: r.__border,
        }
        columns.forEach((p) => {
          flat[p] = r.__rowType === 'title' ? undefined : (r.values?.[p] ?? null)
        })
        return flat
      }),
    [rows, columns]
  )

  return (
    <div className={className} style={{ width: '100%' }}>
      <Table
        columns={tableColumns as any}
        dataSource={dataSource as any}
        pagination={false}
        loading={!dataLoaded}
        locale={getTableLocale(dataLoaded)}
        scroll={{ x: 'max-content' } as any}
        onRow={(record: any) => {
          const isTitle = record?.__rowType === 'title'
          const isHoveredGroup = hoveredGroup && record?.__group === hoveredGroup
          const style: React.CSSProperties = {}
          if (isTitle) {
            style.fontWeight = 600
            style.padding = '8px 10px'
            // @ts-ignore
            style.background = isHoveredGroup ? '#fffbe6' : record.__bg || 'var(--basic-14)'
            if (record.__border) style.borderLeft = `3px solid ${record.__border}`
          } else if (isHoveredGroup) {
            style.background = '#fffbe6'
          }
          return {
            style,
            onMouseEnter: isTitle && onGroupHover ? () => onGroupHover(record.__group) : undefined,
            onMouseLeave: isTitle && onGroupHover ? () => onGroupHover(null) : undefined,
            onClick: () => onRowClick?.(record),
          }
        }}
        style={{ width: '100%' }}
        data-uc-id="pGCQoAAMn"
        data-uc-ct="table"
        data-uc-x={eachTableKey}
      />
    </div>
  )
}
