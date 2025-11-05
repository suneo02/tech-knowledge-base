import { ListTable } from '@visactor/vtable'
import { CellInfo, ColumnDefine } from '@visactor/vtable/es/ts-types'
import React from 'react'

// 自定义渲染参数类型
interface CustomRenderArgs {
  rect: { x: number; y: number; width: number; height: number }
  dataValue: unknown
  table: unknown
  row: number
  col: number
  [key: string]: unknown
}

// 提示框配置类型
interface TooltipConfig {
  style: Record<string, unknown>
  title: string
  placement?: string
}

/**
 * 列定义类型，扩展自VTable的ColumnDefine
 */
export interface ExtendedColumnDefine {
  field: string
  title: string
  width: number
  sort?: boolean
  editor?: string
  cellType?: string
  customRender?: (args: CustomRenderArgs) => unknown
  tooltip?: TooltipConfig
  from?: 'CDE' | 'AI'
  dropDownMenu?: string[]
  [key: string]: unknown
}

/**
 * 合并列配置
 *
 * @param newColumns - 新的列配置
 * @param currentColumns - 当前的列配置
 * @param tableRef - 表格实例引用，用于设置冻结列
 * @returns 合并后的列配置
 */
export const mergeColumns = (
  newColumns: ExtendedColumnDefine[],
  currentColumns: ExtendedColumnDefine[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableRef?: React.RefObject<ListTable & any>
): ExtendedColumnDefine[] => {
  console.log('newColumns', newColumns)
  console.log('currentColumns', currentColumns)
  // 结果数组
  // 结果数组
  const mergedColumns: ExtendedColumnDefine[] = []

  // 用于存储已处理的字段
  const processedFields = new Set<string>()

  // 1. 首先提取 cde-name 和 ai-name 列，确保它们在最左边
  let cdeNameColumn: ExtendedColumnDefine | undefined
  let aiNameColumn: ExtendedColumnDefine | undefined

  // 从新列中查找
  const newCdeNameColumn = newColumns.find((col) => col.field === 'cde-name')
  const newAiNameColumn = newColumns.find((col) => col.field === 'ai-name')

  // 从当前列中查找
  const currentCdeNameColumn = currentColumns.find((col) => col.field === 'cde-name')
  const currentAiNameColumn = currentColumns.find((col) => col.field === 'ai-name')

  // 优先使用新列中的 cde-name，如果没有则使用当前列中的
  if (newCdeNameColumn) {
    cdeNameColumn = newCdeNameColumn
    processedFields.add('cde-name')
  } else if (currentCdeNameColumn) {
    cdeNameColumn = currentCdeNameColumn
    processedFields.add('cde-name')
  }

  // 优先使用新列中的 ai-name，如果没有则使用当前列中的
  if (newAiNameColumn) {
    aiNameColumn = newAiNameColumn
    processedFields.add('ai-name')
  } else if (currentAiNameColumn) {
    aiNameColumn = currentAiNameColumn
    processedFields.add('ai-name')
  }

  // 2. 将 cde-name 和 ai-name 添加到结果数组，cde-name 优先
  if (cdeNameColumn) {
    mergedColumns.push(cdeNameColumn)
  }

  if (aiNameColumn) {
    mergedColumns.push(aiNameColumn)
  }

  // 设置冻结列数量
  let frozenCount = 0
  if (cdeNameColumn) frozenCount += 1
  if (aiNameColumn) frozenCount += 1

  if (frozenCount > 0) {
    tableRef.current?.setFrozenColCount(frozenCount)
  }

  // 3. 处理新增的列，放在剩余列的最左边
  const newAddedColumns: ExtendedColumnDefine[] = []

  // 创建当前列的副本，以便安全地修改
  let currentColumnsCopy = [...currentColumns]

  newColumns.forEach((newCol) => {
    // 跳过已处理的列
    if (processedFields.has(String(newCol.field))) {
      return
    }

    // 检查是否存在于当前列中
    const existingCol = currentColumnsCopy.find((col) => col.field === newCol.field)

    if (!existingCol) {
      // 新增的列
      newAddedColumns.push(newCol)

      processedFields.add(String(newCol.field))
    } else {
      // 如果是 CDE 来源，更新当前列的 from 属性
      if (newCol.from === 'CDE') {
        const updatedCol = { ...existingCol, from: 'CDE' as const }
        currentColumnsCopy = currentColumnsCopy.map((col) => (col.field === updatedCol.field ? updatedCol : col))
      }
    }
  })

  // 4. 将新增的列添加到结果数组
  mergedColumns.push(...newAddedColumns)

  // 5. 添加剩余的当前列（保持原始顺序）
  currentColumnsCopy.forEach((col) => {
    if (!processedFields.has(String(col.field))) {
      mergedColumns.push(col)
      processedFields.add(String(col.field))
    }
  })

  return mergedColumns
}

/** 针对列的一些通用方法 */
export const useColumnsUtils = (multiTableRef: React.RefObject<ListTable>) => {
  // 获取多维表格的列
  const getColumns = (): ColumnDefine[] => {
    return multiTableRef.current?.columns
  }

  /**
   * 获取多维表格的列 (针对已渲染的多维表格列)
   * TODO 暂不考虑多表头
   */
  const getColumnsCells = (): CellInfo[] => {
    return multiTableRef.current?.getAllColumnHeaderCells()[0]
  }

  return {
    getColumns,
    getColumnsCells,
  }
}
