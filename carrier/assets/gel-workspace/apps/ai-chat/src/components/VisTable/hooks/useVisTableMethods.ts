import { useMemo } from 'react'
import { useTableActions } from './useTableActions'
import { useVisTableContext } from '../context/VisTableContext'

/**
 * 使用可视化表格实例的常用方法API
 *
 * @deprecated 推荐使用useTableActions替代，这个hook是为了向后兼容而保留的
 */
export const useVisTableMethods = () => {
  // 使用新的基于reducer的操作方法
  const actions = useTableActions()
  const { getCellMeta, getCellMetaById } = useVisTableContext()

  // 为了保持向后兼容，将新的actions包装为原来的接口格式
  return useMemo(() => {
    return {
      // 数据操作方法
      setRecords: actions.setRecords,
      addRecord: actions.addRecord,
      addRecords: actions.addRecords,
      deleteRecords: actions.deleteRecords,
      updateRecords: actions.updateRecords,

      // 表格操作方法
      refresh: actions.refresh,
      refreshWithRecreateCells: actions.refreshWithRecreateCells,
      setCellValue: actions.setCellValue,
      getCellValue: actions.getCellValue,
      getRecordByCell: actions.getRecordByCell,

      // 元数据获取方法
      getCellMeta,
      getCellMetaById,

      // 其他操作方法
      updateColumns: actions.updateColumns,
      selectCell: actions.selectCell,
      clearSelection: actions.clearSelection,
      scrollToCell: actions.scrollToCell,

      // 获取原始表格实例
      getTableInstance: actions.getTableInstance,
    }
  }, [actions, getCellMeta, getCellMetaById])
}
