import React, { useMemo } from 'react'
import { Typography } from 'antd'
import styles from './index.module.less'
import type { BasicColumn, BasicRecord } from '@/pages/CompanyDirectory/parts/DataTable/types'
import { TableContext } from '@/pages/CompanyDirectory/parts/DataTable/context'
import { t } from '@/pages/CompanyDirectory/parts/DataTable/common'
import { useCellRender, CellRegistryProvider } from '@/components/CellRegistry'
import { CompanyCell } from '@/pages/CompanyDirectory/parts/DataTable/handleCell/CompanyCell'
import { Button } from '@wind/wind-ui'

export interface CListProps {
  columns: BasicColumn[]
  dataSource: BasicRecord[]
  /** 是否整体展开：用于控制 MD/长文本等展示模式 */
  expandAll?: boolean
  /** 禁止展开的列名集合（与 DataTable 行为保持一致） */
  denyExpandColumns?: string[]
  /** 动态控制某行某列是否允许展开 */
  shouldExpandCell?: (record: BasicRecord, column: BasicColumn) => boolean
  /** 行唯一键（可选） */
  rowKey?: string | ((record: BasicRecord, index: number) => React.Key)
}

const PREFIX = 'clist'

/**
 * CList：列表视图组件
 * - 目标：兼容 DataTable 的单元格渲染结果（内容一致），但在列表中对 `type: 'drawer'` 不展示展开抽屉的入口图标。
 * - 做法：复用 CellRegistry 的渲染器，对特殊类型（company/drawer）做定制；提供 TableContext 以兼容可能的渲染器依赖。
 */
export const CList: React.FC<CListProps> = ({
  columns,
  dataSource,
  expandAll = false,
  denyExpandColumns = [],
  shouldExpandCell,
  rowKey,
}) => {
  const { renderCell } = useCellRender()

  const effectiveColumns = useMemo(() => {
    return (columns ?? []).filter((c) => !!c?.dataIndex)
  }, [columns])

  const getRowKey = (record: BasicRecord, index: number): React.Key => {
    if (typeof rowKey === 'function') return rowKey(record, index)
    if (typeof rowKey === 'string') return (record?.[rowKey] as React.Key) ?? index
    return index
  }

  return (
    <CellRegistryProvider>
      <TableContext.Provider value={{ columns, dataSource }}>
        <div className={styles[`${PREFIX}-container`]}>
          {dataSource?.map((record, idx) => {
            const key = getRowKey(record, idx)
            return (
              <div key={key} className={styles[`${PREFIX}-item`]}>
                {effectiveColumns.map((col) => {
                  const dataIndex = col?.dataIndex || String(col.dataIndex)
                  const isDeniedByName = !!dataIndex && denyExpandColumns.includes(dataIndex)
                  const allowExpandByCell = shouldExpandCell ? shouldExpandCell(record, col) : true
                  const mode: 'inline' | 'expanded' =
                    expandAll && allowExpandByCell && !isDeniedByName ? 'expanded' : 'inline'
                  const rawValue = dataIndex ? (record?.[dataIndex] as unknown) : undefined

                  // label（列标题）
                  const labelNode = col?.title as React.ReactNode

                  // 内容渲染（与表格保持一致的策略，唯一差异：drawer 类型不展示抽屉入口）
                  let valueNode: React.ReactNode

                  if (col?.type === 'company') {
                    // 与表格一致：使用 CompanyCell，code 从 `${dataIndex}&` 的 entityId 获取
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const code = dataIndex ? (record?.[`${dataIndex}&`] as any)?.entityId : undefined
                    valueNode = <CompanyCell name={(rawValue as string) ?? ''} code={String(code ?? '')} />
                  } else if (col?.type === 'drawer') {
                    // 复刻 DrawerCell 的内容/状态，但不渲染抽屉入口图标
                    const statusKey = dataIndex ? `${dataIndex}Status` : 'status'
                    const initialStatus = (record?.[statusKey] as number | undefined) ?? (rawValue ? 2 : 0)
                    const showGenerate = initialStatus === 0
                    const isGenerating = initialStatus === 1
                    const content = (col?.title as React.ReactNode) || ((rawValue ?? '') as React.ReactNode)

                    if (showGenerate) {
                      valueNode = (
                        <div className={styles[`${PREFIX}-cellWrapper`]}>
                          <Button type="primary" size="small">
                            {t('13152', '生成')}
                          </Button>
                        </div>
                      )
                    } else if (isGenerating) {
                      valueNode = <div className={styles[`${PREFIX}-cellWrapper`]}>{t('286699', '生成中')}</div>
                    } else if (mode === 'expanded') {
                      valueNode = <div className={styles[`${PREFIX}-fullText`]}>{content}</div>
                    } else {
                      valueNode = (
                        <Typography.Paragraph
                          className={styles[`${PREFIX}-oneLine`]}
                          ellipsis={{ rows: 1 }}
                          style={{ marginBottom: 0 }}
                        >
                          {content}
                        </Typography.Paragraph>
                      )
                    }
                  } else {
                    // 其他类型：交由 CellRegistry 的渲染器处理，确保与表格的内容一致
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    valueNode = renderCell({ value: rawValue, record, column: col as any, mode })
                  }

                  return (
                    <div
                      key={String(col.dataIndex)}
                      className={styles[`${PREFIX}-row`]}
                      data-col-key={String(col.dataIndex)}
                    >
                      <div className={styles[`${PREFIX}-label`]}>{labelNode}</div>
                      <div className={styles[`${PREFIX}-value`]}>{valueNode}</div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </TableContext.Provider>
    </CellRegistryProvider>
  )
}

export default CList
