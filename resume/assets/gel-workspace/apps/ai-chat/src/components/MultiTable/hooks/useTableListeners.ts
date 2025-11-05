import { useColumnsUtils } from '../utils/columnsUtils'
import { MutableRefObject, useCallback } from 'react'
import type { ListTable } from '@visactor/vtable'
import { DropDownMenuEventArgs, FieldDef } from '@visactor/vtable/es/ts-types'
import { isNullOrEmpty, returnValue } from '@/utils/common/data'
import { MenuKey, TableOperation, TableOperationType } from '../types'
import { CellValue } from '../types/table'

export interface UseTableListenersProps {
  /**
   * 表格实例引用
   */
  multiTableRef: MutableRefObject<ListTable | null>
  /**
   * 表格列配置
   */
  // columns: ColumnDefine[]
  /**
   * 记录操作的回调函数
   */
  onRecordOperation: (operation: TableOperation) => void
  /**
   * 菜单点击处理函数
   */
  onMenuClick: (menuKey: MenuKey, props: { field: FieldDef; row: number; col: number }) => void
}

/**
 * 表格事件监听Hook
 * 专门处理表格的各种事件监听和回调
 */
export const useTableListeners = ({ multiTableRef, onRecordOperation, onMenuClick }: UseTableListenersProps) => {
  const { getColumns } = useColumnsUtils(multiTableRef)
  /**
   * 处理列头移动事件
   */
  const handleColumnMove = useCallback(
    (props: { source: { col: number }; target: { col: number } }) => {
      console.log('列头移动', props)
      const fromIndex = props.source.col
      const toIndex = props.target.col
      const columnId = multiTableRef.current?.getCellInfo(toIndex, 0)?.field as string

      onRecordOperation({
        type: TableOperationType.COLUMN_MOVE,
        columnId,
        oldIndex: fromIndex,
        newIndex: toIndex,
      })
    },
    [getColumns, onRecordOperation]
  )

  /**
   * 处理列宽调整事件
   */
  const handleColumnResize = useCallback((props: Record<string, unknown>) => {
    console.log('列宽调整', props)
    // 可以在这里添加列宽调整的操作记录逻辑
  }, [])

  /**
   * 处理单元格值变更事件
   */
  const handleCellValueChange = useCallback(
    (props: { row: number; col: number; currentValue: CellValue; changedValue: CellValue }) => {
      const editor = multiTableRef.current.getEditor(props.col, props.row)
      if (!editor) return

      if (isNullOrEmpty(props.currentValue) && isNullOrEmpty(props.changedValue)) return
      if (
        typeof props.currentValue === 'string' &&
        typeof props.changedValue === 'string' &&
        props.currentValue.trim() === props.changedValue.trim()
      )
        return
      try {
        if (props.row === 0) {
          const columnId = multiTableRef.current?.getAllColumnHeaderCells()[0][props.col]?.field as string
          // 可以在这里添加表头重命名的操作记录逻辑
          onRecordOperation({
            type: TableOperationType.COLUMN_RENAME,
            columnId,
            oldName: returnValue(props.currentValue),
            newName: returnValue(props.changedValue),
            col: props.col,
          })
        } else {
          console.log('单元格编辑', props)
          const columnId = multiTableRef.current?.getAllColumnHeaderCells()[0][props.col]?.field as string
          const rowId = multiTableRef.current?.getRecordByCell(props.col, props.row)?.rowId // TODO 等待接口修改
          onRecordOperation({
            type: TableOperationType.CELL_EDIT,
            columnId,
            rowId,
            col: props.col,
            row: props.row,
            oldValue: props.currentValue as CellValue,
            newValue: props.changedValue as CellValue,
          })
        }
      } catch (error) {
        console.error('单元格编辑失败:', error)
      }
    },
    [multiTableRef, onRecordOperation]
  )

  /**
   * 处理下拉菜单点击事件
   */
  const handleDropdownMenuClick = useCallback(
    (props: DropDownMenuEventArgs) => {
      const { menuKey, field, row, col } = props
      onMenuClick(menuKey as MenuKey, { field, row, col })
    },
    [onMenuClick]
  )

  /**
   * 获取所有事件处理器
   */
  const getEventHandlers = () => ({
    handleColumnMove,
    handleColumnResize,
    handleCellValueChange,
    handleDropdownMenuClick,
  })

  return {
    getEventHandlers,
  }
}
