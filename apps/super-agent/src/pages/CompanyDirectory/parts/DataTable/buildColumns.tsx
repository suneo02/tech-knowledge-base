/* eslint-disable @typescript-eslint/no-explicit-any */
/* */
import React from 'react'
import type { BasicColumn, BasicRecord } from './types'
import { Typography } from 'antd'
import styles from './index.module.less'
import { ColumnDataTypeEnum } from 'gel-api'
import { DEFAULT_ELLIPSIS_WIDTH, t } from './common'
import { DrawerCell } from './handleCell/DrawerCell'
import { CellView } from '@/components/CellRegistry'

export interface BuildColumnsOptions {
  columns: BasicColumn[]
  expandAll: boolean
  denyExpandColumns?: string[]
  shouldExpandCell?: (record: BasicRecord, column: BasicColumn) => boolean
  /**
   * 序号列与分页配置，由上层传入，避免在页面堆功能
   */
  pagination?: { current: number; pageSize: number }
  indexColumn?: {
    enabled?: boolean
    title?: React.ReactNode
    width?: number
    align?: 'left' | 'center' | 'right'
    fixed?: boolean | 'left' | 'right'
    /** 自定义序号计算方式（可用于跨页累计、偏移等） */
    getRowNumber?: (args: { index?: number; pagination?: { current: number; pageSize: number } }) => number
  }
}

//

const STRINGS = {
  GENERATE: t('13152', '生成'),
  GENERATING: t('286699', '生成中'),
  OPEN_DRAWER: t('', '打开抽屉'),
  VIEW: t('257641', '查看'),
} as const

export const buildColumns = (opts: BuildColumnsOptions): BasicColumn[] => {
  const { columns, expandAll, denyExpandColumns = [], shouldExpandCell } = opts

  const withIndexColumn = opts?.indexColumn?.enabled ?? true
  const indexTitle = opts?.indexColumn?.title ?? null
  const indexAlign = opts?.indexColumn?.align ?? 'center'
  const indexWidth = opts?.indexColumn?.width ?? 54
  const indexFixed = opts?.indexColumn?.fixed ?? true
  const getRowNumber =
    opts?.indexColumn?.getRowNumber ??
    ((args: { index?: number; pagination?: { current: number; pageSize: number } }) => {
      const base = ((opts?.pagination?.current ?? 1) - 1) * (opts?.pagination?.pageSize ?? 20)
      return base + (args.index ?? 0) + 1
    })

  const mapped = (columns ?? []).map((col: BasicColumn) => {
    const dataIndex = col?.dataIndex
    const isDeniedByName = !!dataIndex && denyExpandColumns.includes(dataIndex)

    // 跳过特殊类型或显式禁用的列：完全不改动
    if (col?.disableExpand === true || isDeniedByName) {
      return col
    }

    const prevRender = col?.render

    // 公司、标签、电话列：使用统一渲染器
    // company: 附加 drawer 增强
    if (col?.type === 'company' || col?.type === 'phone' || col?.type === ColumnDataTypeEnum.TAG) {
      return {
        ...col,
        render: (value: unknown, record: BasicRecord) => {
          return (
            <CellView
              value={value}
              record={record}
              column={col as any}
              mode={expandAll ? 'expanded' : 'inline'}
              addons={col?.type === 'company' ? ['drawer'] : []}
            />
          )
        },
      }
    }

    // Markdown 列：统一渲染为 MD；允许展开时由 drawer 增强负责交互
    if (col?.type === 'md') {
      return {
        ...col,
        ellipsis: !expandAll,
        width: !expandAll ? (col?.width ?? DEFAULT_ELLIPSIS_WIDTH) : col?.width,
        render: (value: unknown, record: BasicRecord, index?: number) => {
          const allowExpandByCell = shouldExpandCell ? shouldExpandCell(record, col) : true
          // 计算生成状态：0 待生成 / 1 生成中 / 2 正常
          const statusKey = dataIndex ? `${dataIndex}Status` : 'status'
          const initialStatus = (record?.[statusKey] as number | undefined) ?? (value ? 2 : 0)
          if (!allowExpandByCell || initialStatus < 2) {
            // 不允许展开或处于生成态：沿用旧的 DrawerCell 逻辑
            const cellContent = prevRender ? prevRender(value, record, index) : value
            if (!allowExpandByCell) {
              return (
                <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
                  {(cellContent as React.ReactNode) ?? null}
                </Typography.Paragraph>
              )
            }
            return (
              <DrawerCell
                value={cellContent}
                record={record}
                title={col?.title}
                dataIndex={dataIndex}
                rowIndex={index ?? 0}
                expandAll={expandAll}
                columnType={col?.type as string}
                labels={{
                  openDrawer: STRINGS.OPEN_DRAWER,
                  generate: STRINGS.GENERATE,
                  generating: STRINGS.GENERATING,
                  view: STRINGS.VIEW,
                }}
              />
            )
          }
          // 正常态：统一走 CellView + drawer 增强
          return (
            <CellView
              value={prevRender ? prevRender(value, record, index) : value}
              record={record}
              column={col as any}
              mode={expandAll ? 'expanded' : 'inline'}
              addons={['drawer']}
            />
          )
        },
      }
    }

    // 抽屉列：支持状态与抽屉打开，正常态走统一渲染 + drawer 增强
    if (col?.type === 'drawer') {
      return {
        ...col,
        render: (value: unknown, record: BasicRecord, index?: number) => {
          const statusKey = dataIndex ? `${dataIndex}Status` : 'status'
          const initialStatus = (record?.[statusKey] as number | undefined) ?? (value ? 2 : 0)
          if (initialStatus < 2) {
            return (
              <DrawerCell
                value={value}
                record={record}
                title={col?.title}
                dataIndex={dataIndex}
                rowIndex={index ?? 0}
                expandAll={expandAll}
                columnType={col?.type as string}
                labels={{
                  openDrawer: STRINGS.OPEN_DRAWER,
                  generate: STRINGS.GENERATE,
                  generating: STRINGS.GENERATING,
                  view: STRINGS.VIEW,
                }}
              />
            )
          }
          return (
            <CellView
              value={prevRender ? prevRender(value, record, index) : value}
              record={record}
              column={col as any}
              mode={expandAll ? 'expanded' : 'inline'}
              addons={['drawer']}
            />
          )
        },
      }
    }

    // 数字类统一靠右 + 使用统一渲染器
    if (
      col?.type === ColumnDataTypeEnum.FLOAT ||
      col?.type === ColumnDataTypeEnum.INTEGER ||
      col?.type === ColumnDataTypeEnum.PERCENT
    ) {
      return {
        ...col,
        align: 'right',
        render: (value: unknown, record: BasicRecord, index?: number) => {
          return (
            <CellView
              value={prevRender ? prevRender(value, record, index) : value}
              record={record}
              column={col as any}
              mode={expandAll ? 'expanded' : 'inline'}
            />
          )
        },
      }
    }

    if (!expandAll) {
      // 如果配置了 ellipsis: true，则保持默认展示（Antd Table 原生 ellipsis），不强制包裹 Typography
      if (col.ellipsis) {
        return {
          ...col,
          width: col?.width ?? DEFAULT_ELLIPSIS_WIDTH,
        }
      }

      // 收起：单行省略，列宽兜底，确保表头对齐
      return {
        ...col,
        ellipsis: true,
        width: col?.width ?? DEFAULT_ELLIPSIS_WIDTH,
        render: (value: unknown, record: BasicRecord, index?: number) => {
          const cellContent = prevRender ? prevRender(value, record, index) : value
          return (
            <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
              <CellView value={cellContent} record={record} column={col as any} mode={'inline'} />
            </Typography.Paragraph>
          )
        },
      }
    }

    // 展开：多行展示
    return {
      ...col,
      ellipsis: false,
      render: (value: unknown, record: BasicRecord, index?: number) => {
        const allowExpandByCell = shouldExpandCell ? shouldExpandCell(record, col) : true
        const cellContent = prevRender ? prevRender(value, record, index) : value
        if (!allowExpandByCell) {
          // 本行不展开时仍旧单行省略
          return (
            <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
              <CellView value={cellContent} record={record} column={col as any} mode={'inline'} />
            </Typography.Paragraph>
          )
        }
        return (
          <div className={styles.fullText}>
            <CellView value={cellContent} record={record} column={col as any} mode={'expanded'} />
          </div>
        )
      },
    }
  })

  if (!withIndexColumn) return mapped

  const indexCol: BasicColumn = {
    title: indexTitle ?? undefined,
    dataIndex: '__index__',
    width: indexWidth,
    fixed: indexFixed,
    disableExpand: true,
    align: indexAlign,
    render: (_: unknown, __: BasicRecord, index?: number) => {
      return getRowNumber({ index, pagination: opts?.pagination })
    },
    columnId: '',
  }

  return [indexCol, ...mapped]
}
