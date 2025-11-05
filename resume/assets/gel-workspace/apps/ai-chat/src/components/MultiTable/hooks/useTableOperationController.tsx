import { useTableOperationState } from '@/components/MultiTable/context'
import { useTableUndo } from '@/components/MultiTable/hooks/useTableUndo'
import { useKeyboardShortcuts } from '@/components/MultiTable/hooks/useKeyboardShortcuts'
import { MutableRefObject } from 'react'
import * as VTable from '@visactor/vtable'
import { TableOperation } from '../types'

interface UseTableOperationControllerProps {
  multiTableRef: MutableRefObject<VTable.ListTable | null>
}

/**
 * 用于处理表格操作、撤销和重做功能的控制器
 * @param {UseTableOperationControllerProps} props - 包含表格实例的属性
 * @returns {Object} - 返回包含表格操作处理函数的对象
 */
export const useTableOperationController = ({ multiTableRef }: UseTableOperationControllerProps) => {
  // 解构表格操作相关函数和状态
  const { operations, recordOperation, undo, redo, canUndo, canRedo, markUndoRedoStart, markUndoRedoEnd } =
    useTableOperationState()

  // 使用表格撤销重做
  const { handleUndo, handleRedo, isUndoRedoRef } = useTableUndo({
    multiTableRef,
    onUndo: undo,
    onRedo: redo,
    operations,
    markUndoRedoStart,
    markUndoRedoEnd,
  })

  // 使用键盘快捷键
  const { throttledUndo, throttledRedo } = useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    canUndo,
    canRedo,
  })

  /**
   * 记录表格操作
   * @param {TableOperation} operation - 表格操作类型
   */
  const handleRecordOperation = (operation: TableOperation) => {
    // 如果正在执行撤销/重做操作，不记录变更
    if (isUndoRedoRef.current) return

    // 记录操作
    recordOperation(operation)
  }

  // 返回表格操作处理函数和撤销重做相关状态
  return {
    handleRecordOperation,
    isUndoRedoRef,
    throttledUndo,
    throttledRedo,
  }
}
