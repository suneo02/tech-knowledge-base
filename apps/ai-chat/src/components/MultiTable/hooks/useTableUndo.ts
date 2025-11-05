import { MutableRefObject, useCallback, useRef } from 'react'

import { ColumnDefine, ListTable } from '@visactor/vtable'
import { TableOperation, TableOperationType } from '../types'
import { useColumnsUtils } from '../utils/columnsUtils'
// import { useTableOperationActions } from './useTableOperationActions'

interface TableUndoProps {
  multiTableRef: MutableRefObject<ListTable>
  onUndo: () => void
  onRedo: () => void
  operations: TableOperation[]
  markUndoRedoStart: () => void
  markUndoRedoEnd: () => void
}

/**
 * 表格撤销重做钩子
 * 处理不同类型操作的撤销和重做逻辑
 */
export const useTableUndo = ({
  multiTableRef,
  onUndo,
  onRedo,
  operations,
  markUndoRedoStart,
  markUndoRedoEnd,
}: TableUndoProps) => {
  // const { renameColumn } = useTableOperationActions({ multiTableRef })
  // 添加一个标记来跟踪是否正在执行撤销/重做操作
  const isUndoRedoRef = useRef(false)
  const { getColumns, getColumnsCells } = useColumnsUtils(multiTableRef)
  /**
   * 处理撤销操作
   * 根据操作类型执行相应的撤销逻辑
   */
  const handleUndo = useCallback(() => {
    markUndoRedoStart()

    console.log('🚀 ~ handleUndo ~ operations:', operations)

    // 获取最后一个未被禁用的操作
    const lastOperation = [...operations].reverse().find((op) => !op.disabled)

    if (lastOperation && multiTableRef.current) {
      isUndoRedoRef.current = true

      switch (lastOperation.type) {
        case TableOperationType.CELL_EDIT: {
          // 单元格编辑撤销
          const { col, row, oldValue } = lastOperation
          // 将值转换为字符串，因为 changeCellValue 期望接收字符串类型
          const value = typeof oldValue === 'boolean' ? String(oldValue) : oldValue ? String(oldValue) : ''
          // 还原单元格的值
          multiTableRef.current.changeCellValue(col, row, value)
          break
        }
        case TableOperationType.COLUMN_MOVE: {
          // 列移动撤销
          const { oldIndex, newIndex } = lastOperation
          const table = multiTableRef.current
          if (!table) return
          // 实现列移动撤销逻辑
          const headerCells = getColumns()

          // 创建一个映射，存储每个列的完整信息
          const columnsInfo = headerCells.map((cell) => {
            // 从table.columns中获取其他信息
            const columnConfig = getColumnsCells().find((col) => col.field === cell.field)
            return {
              ...cell,
              ...columnConfig,
              // width: cell.cellRange.bounds.x2 - cell.cellRange.bounds.x1,
            }
          })

          // 直接从newIndex位置取出列，然后插入到oldIndex位置
          const [columnToMove] = columnsInfo.splice(newIndex, 1)
          console.log('🚀 ~ handleUndo ~ columnToMove:', columnToMove)
          columnsInfo.splice(oldIndex, 0, columnToMove)
          console.log('🚀 ~ handleUndo ~ columnsInfo:', columnsInfo)
          // 更新表格列
          table.updateColumns(columnsInfo as ColumnDefine[])
          break
        }

        case TableOperationType.COLUMN_DELETE: {
          // 列删除撤销
          // 需要实现列恢复的逻辑
          console.log('撤销列删除操作', lastOperation)
          const { col, column } = lastOperation
          const table = multiTableRef.current
          if (!table) return
          // 实现列删除撤销逻辑
          const headerCells = table.getAllColumnHeaderCells()[0]

          // 创建一个映射，存储每个列的完整信息
          const columnsInfo = headerCells.map((cell) => {
            // 从table.columns中获取其他信息
            const columnConfig = table.columns.find((c) => c.field === cell.field)
            return {
              field: cell.field,
              title: cell.title,
              width: cell.cellRange.bounds.x2 - cell.cellRange.bounds.x1,
              editor: columnConfig?.editor,
              headerEditor: columnConfig?.headerEditor,
            }
          })

          // 在指定位置插入被删除的列
          columnsInfo.splice(col, 0, {
            field: column.field,
            title: column.title,
            width: typeof column.width === 'string' ? parseInt(column.width, 10) : column.width,
            editor: column.editor,
            headerEditor: column.headerEditor,
          })

          // 更新表格列
          table.updateColumns(columnsInfo)
          break
        }
        case TableOperationType.COLUMN_RENAME: {
          // 列重命名撤销
          // 需要实现列名称恢复的逻辑
          const { oldName, col } = lastOperation
          multiTableRef.current?.changeCellValue(col, 0, oldName)
          break
        }
        case TableOperationType.COLUMN_INSERT: {
          // 列插入撤销
          // 需要实现列删除的逻辑
          const { columnIndex } = lastOperation
          const table = multiTableRef.current
          if (!table) return
          // 实现列移动撤销逻辑
          const headerCells = table.getAllColumnHeaderCells()[0]

          // 创建一个映射，存储每个列的完整信息
          const columnsInfo = headerCells.map((cell) => {
            // 从table.columns中获取其他信息
            const columnConfig = table.columns.find((col) => col.field === cell.field)
            return {
              field: cell.field,
              title: cell.title,
              width: cell.cellRange.bounds.x2 - cell.cellRange.bounds.x1,
              editor: columnConfig?.editor,
              headerEditor: columnConfig?.headerEditor,
            }
          })
          columnsInfo.splice(columnIndex, 1)
          table.updateColumns(columnsInfo)
          break
        }
        case TableOperationType.ROW_DELETE: {
          // 行删除撤销
          // 需要实现行恢复的逻辑
          console.log('撤销行删除操作', lastOperation)
          const { row, rowItem } = lastOperation
          const table = multiTableRef.current
          if (!table) return
          table.addRecord(rowItem, row - 1)
          table.scrollToCell({ row })
          break
        }
        case TableOperationType.ROW_ADD: {
          // 行添加撤销
          // 需要实现行删除的逻辑
          console.log('撤销行添加操作', lastOperation)
          break
        }
        // case TableOperationType.CELL_FILL: {
        //   // AI生成列撤销
        //   // 需要实现恢复原始数据的逻辑
        //   console.log('撤销AI生成列操作', lastOperation)
        //   break
        // }
        // case TableOperationType.CELL_CLEAR: {
        //   // 清除内容撤销
        //   // 需要实现恢复原始数据的逻辑
        //   console.log('撤销清除内容操作', lastOperation)
        //   break
        // }
        default: {
          console.log('未处理的撤销操作类型', lastOperation.type)
          break
        }
      }

      isUndoRedoRef.current = false
      // 在还原值之后执行撤销操作
      onUndo()
    }
    markUndoRedoEnd()
  }, [multiTableRef, onUndo, operations, markUndoRedoStart, markUndoRedoEnd])

  /**
   * 处理重做操作
   * 根据操作类型执行相应的重做逻辑
   */
  const handleRedo = useCallback(() => {
    markUndoRedoStart()
    // 获取第一个被禁用的操作
    const nextOperation = operations.find((op) => op.disabled)

    if (nextOperation && multiTableRef.current) {
      isUndoRedoRef.current = true

      switch (nextOperation.type) {
        case TableOperationType.CELL_EDIT: {
          // 单元格编辑重做
          const { col, row, newValue } = nextOperation
          // 将值转换为字符串
          const value = typeof newValue === 'boolean' ? String(newValue) : newValue ? String(newValue) : ''
          // 还原单元格的值
          multiTableRef.current.changeCellValue(col, row, value)
          break
        }
        case TableOperationType.COLUMN_MOVE: {
          // 列移动重做
          // 这里需要实现列移动的重做逻辑
          console.log('重做列移动操作', nextOperation)
          // multiTableRef.current?.update
          const { columnId, newIndex } = nextOperation
          const table = multiTableRef.current
          if (!table) return

          // 实现列移动重做逻辑
          const headerCells = table.getAllColumnHeaderCells()[0]

          // 创建一个映射，存储每个列的完整信息
          const columnsInfo = headerCells.map((cell) => {
            const field = cell.field
            const width = cell.cellRange.bounds.x2 - cell.cellRange.bounds.x1
            // 从table.columns中获取其他信息
            const columnConfig = table.columns.find((col) => col.field === field)
            return {
              field,
              title: cell.title,
              width,
              editor: columnConfig?.editor,
              headerEditor: columnConfig?.headerEditor,
            }
          })

          // 找到要移动的列
          const columnToMove = columnsInfo.find((col) => col.field === columnId)
          if (!columnToMove) return

          // 从当前位置移除该列
          const currentIndex = columnsInfo.findIndex((col) => col.field === columnId)
          if (currentIndex !== -1) {
            columnsInfo.splice(currentIndex, 1)
          }

          // 将列插入到新位置
          columnsInfo.splice(newIndex, 0, columnToMove)

          // 更新表格列
          table.updateColumns(columnsInfo)
          break
        }
        case TableOperationType.COLUMN_DELETE: {
          // 列删除重做
          // 需要实现列删除的逻辑
          console.log('重做列删除操作', nextOperation)
          const { col } = nextOperation
          const table = multiTableRef.current
          if (!table) return

          // 实现列删除重做逻辑
          const headerCells = table.getAllColumnHeaderCells()[0]

          // 创建一个映射，存储每个列的完整信息
          const columnsInfo = headerCells.map((cell) => {
            // 从table.columns中获取其他信息
            const columnConfig = table.columns.find((c) => c.field === cell.field)
            return {
              field: cell.field,
              title: cell.title,
              width: cell.cellRange.bounds.x2 - cell.cellRange.bounds.x1,
              editor: columnConfig?.editor,
              headerEditor: columnConfig?.headerEditor,
            }
          })

          // 删除指定位置的列
          columnsInfo.splice(col, 1)

          // 更新表格列
          table.updateColumns(columnsInfo)
          break
        }
        case TableOperationType.COLUMN_RENAME: {
          // 列重命名重做
          // 需要实现列重命名的逻辑
          console.log('重做列重命名操作', nextOperation)
          const { newName, col } = nextOperation
          multiTableRef.current?.changeCellValue(col, 0, newName)
          // renameColumn({ row: nextOperation.row, col: nextOperation.col })
          break
        }
        case TableOperationType.COLUMN_INSERT: {
          // 列插入重做
          // 需要实现列插入的逻辑
          const { columnIndex, columnId, columnName, editor, headerEditor, width } = nextOperation
          const table = multiTableRef.current
          if (!table) return
          // 实现列插入重做逻辑
          const headerCells = table.getAllColumnHeaderCells()[0]
          console.log('headerCells', headerCells)
          const columnsInfo = headerCells.map((cell) => {
            const field = cell.field
            // 从table.columns中获取其他信息
            const columnConfig = table.columns.find((col) => col.field === field)
            return {
              field,
              title: cell.title,
              width: cell.cellRange.bounds.x2 - cell.cellRange.bounds.x1,
              editor: columnConfig?.editor,
              headerEditor: columnConfig?.headerEditor,
            }
          })
          columnsInfo.splice(columnIndex, 0, {
            field: columnId,
            title: columnName,
            width,
            editor,
            headerEditor,
          })
          table.updateColumns(columnsInfo)
          break
        }
        case TableOperationType.ROW_DELETE: {
          // 行删除重做
          // 需要实现行删除的逻辑
          // console.log('重做行删除操作', nextOperation)
          const { row } = nextOperation
          multiTableRef.current?.deleteRecords([row - 1])
          break
        }
        case TableOperationType.ROW_ADD: {
          // 行添加重做
          // 需要实现行添加的逻辑
          console.log('重做行添加操作', nextOperation)
          break
        }
        // case TableOperationType.CELL_FILL: {
        //   // AI生成列重做
        //   // 需要实现AI生成列的逻辑
        //   console.log('重做AI生成列操作', nextOperation)
        //   break
        // }
        // case TableOperationType.CELL_CLEAR: {
        //   // 清除内容重做
        //   // 需要实现清除内容的逻辑
        //   console.log('重做清除内容操作', nextOperation)
        //   break
        // }
        default: {
          console.log('未处理的重做操作类型', nextOperation.type)
          break
        }
      }

      isUndoRedoRef.current = false
      // 在还原值之后执行重做操作
      onRedo()
    }
    markUndoRedoEnd()
  }, [multiTableRef, onRedo, operations, markUndoRedoStart, markUndoRedoEnd])

  return {
    handleUndo,
    handleRedo,
    isUndoRedoRef,
  }
}
