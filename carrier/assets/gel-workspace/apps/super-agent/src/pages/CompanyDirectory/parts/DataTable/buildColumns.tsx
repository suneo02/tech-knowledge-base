/* */
import React from 'react'
import type { BasicColumn, BasicRecord } from './types'
import { Typography } from 'antd'
import styles from './index.module.less'
import { ColumnDataTypeEnum } from 'gel-api'
import { DEFAULT_ELLIPSIS_WIDTH, formatNumberByType, t } from './common'
import { DrawerCell } from './handleCell/DrawerCell'
import { CompanyCell } from './handleCell/CompanyCell'

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
  GENERATE: t('common.generate', '生成'),
  GENERATING: t('common.generating', '生成中'),
  OPEN_DRAWER: t('common.openDrawer', '打开抽屉'),
  MICRO: t('company.tag.micro', '小微企业'),
  GREEN: t('company.tag.green', '绿色低碳转型产业*'),
  VIEW: t('common.view', '查看'),
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

    // 公司列：统一在这里渲染
    if (col?.type === 'company') {
      return {
        ...col,
        render: (value: unknown, record: BasicRecord) => {
          const name = (value ?? '') as string
          return (
            <CompanyCell
              name={name}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code={(record[`${col.dataIndex}&`] as any)?.entityId}
              labels={{ openDrawer: STRINGS.OPEN_DRAWER, micro: STRINGS.MICRO, green: STRINGS.GREEN }}
            />
          )
        },
      }
    }

    // Markdown 列：打开抽屉与 drawer 一致，内容渲染为 MD
    if (col?.type === 'md') {
      return {
        ...col,
        ellipsis: !expandAll,
        width: !expandAll ? (col?.width ?? DEFAULT_ELLIPSIS_WIDTH) : col?.width,
        render: (value: unknown, record: BasicRecord, index?: number) => {
          const allowExpandByCell = shouldExpandCell ? shouldExpandCell(record, col) : true
          if (!allowExpandByCell) {
            const cellContent = prevRender ? prevRender(value, record, index) : value
            return (
              <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
                {(cellContent as React.ReactNode) ?? null}
              </Typography.Paragraph>
            )
          }
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
        },
      }
    }

    // 抽屉列：支持状态与抽屉打开
    if (col?.type === 'drawer') {
      return {
        ...col,
        render: (value: unknown, record: BasicRecord, index?: number) => {
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
        },
      }
    }

    // 数字类统一靠右 + 千分位
    if (
      col?.type === ColumnDataTypeEnum.FLOAT ||
      col?.type === ColumnDataTypeEnum.INTEGER ||
      col?.type === ColumnDataTypeEnum.PERCENT
    ) {
      return {
        ...col,
        align: 'right',
        render: (value: unknown, record: BasicRecord, index?: number) => {
          if (prevRender) return prevRender(value, record, index)
          return formatNumberByType(value, col?.type)
        },
      }
    }

    if (!expandAll) {
      // 收起：单行省略，列宽兜底，确保表头对齐
      return {
        ...col,
        ellipsis: true,
        width: col?.width ?? DEFAULT_ELLIPSIS_WIDTH,
        render: (value: unknown, record: BasicRecord, index?: number) => {
          const cellContent = prevRender ? prevRender(value, record, index) : value
          return (
            <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
              {(cellContent as React.ReactNode) ?? null}
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
        if (!allowExpandByCell) {
          // 本行不展开时仍旧单行省略
          const cellContent = prevRender ? prevRender(value, record, index) : value
          return (
            <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 1 }}>
              {(cellContent as React.ReactNode) ?? null}
            </Typography.Paragraph>
          )
        }
        const cellContent = prevRender ? prevRender(value, record, index) : value
        return <div className={styles.fullText}>{(cellContent as React.ReactNode) ?? null}</div>
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
  }

  return [indexCol, ...mapped]
}
