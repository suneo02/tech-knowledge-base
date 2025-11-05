import { useCallback } from 'react'
import { useVisTableContext } from '../context/VisTableContext'
import { TableActionType } from '../context/VisTableContext'
import { ColumnDefine } from '@visactor/vtable'
import { SortState } from '@visactor/vtable/es/ts-types'
import { generateUniqueName } from '@/utils/common/data'
import { CellMetadata, Column, RowData, SourceTypeEnum } from 'gel-api'
import { nanoid } from 'nanoid'
import { useTableAITask } from '@/components/MultiTable/context'
import { GENERATE_TEXT } from '../config/status'
import { handleColumnUtils } from '../utils/handleColumn'

export const useTableActions = () => {
  const { dispatch, getTableInstance, getCellMeta, getAllColumns, getDisplayRow, getColumnByCol } = useVisTableContext()
  const { updateTask } = useTableAITask()

  const addColumn = useCallback(
    (col: number, column: Column = {} as Column): Column | false => {
      const columns = getAllColumns()
      column.columnId = column.columnId || column.field || nanoid(14)
      column.columnName = generateUniqueName({ name: (column.title as string) || '列', list: columns, key: 'title' })
      column.width = column.width || 120
      column.initSourceType = column.initSourceType || SourceTypeEnum.USER
      console.log('🚀 ~ addColumn ~ column:', column.initSourceType, handleColumnUtils(column))
      columns.splice(col, 0, handleColumnUtils(column))
      console.log('🚀 ~ addColumn ~ columns:', columns)
      try {
        dispatch({
          type: TableActionType.UPDATE_COLUMNS,
          payload: { columns },
        })
        console.log('🚀 ~ useTableActions ~ column:', column)
        return column
      } catch (error) {
        console.error('设置表格数据失败:', error)
        return false
      }
    },
    [dispatch]
  )

  const runCell = useCallback(
    (col: number, row: number): boolean => {
      try {
        const cellMeta = getCellMeta<CellMetadata>(col, row)
        if (cellMeta) {
          dispatch({
            type: TableActionType.SET_CELL_VALUE,
            payload: { col, row, value: GENERATE_TEXT },
          })
          updateTask([
            {
              columnId: cellMeta.columnId,
              rowId: cellMeta.rowId,
              originalContent: cellMeta.processedValue,
            },
          ])
        }
        return true
      } catch (error) {
        console.error('运行单元格失败:', error)
        return false
      }
    },
    [dispatch]
  )

  const runColumn = useCallback(
    ({ col, columnId }: { col?: number; columnId?: string }): boolean => {
      try {
        const colId: string = columnId || (getColumnByCol(col!)?.field as string)
        const rowData = getDisplayRow()
        const allRecords = [...rowData]
        const newRecords = allRecords?.map((record) => ({ ...record, [colId]: GENERATE_TEXT }))
        updateRecords(
          newRecords,
          newRecords.map((_, i) => i)
        )
        updateTask(
          allRecords.map((record) => ({
            columnId: colId,
            rowId: record.rowId,
            originalContent: record[colId] as string,
          }))
        )
        // console.log('🚀 ~ useTableActions ~ displayRowIds:', displayRowIds)
        // if (displayRowIds?.length && column) {
        //   displayRowIds.forEach((rowId, index) => {
        //     dispatch({
        //       type: TableActionType.SET_CELL_VALUE,
        //       payload: { col, row: index + 1, value: PENDING_TEXT },
        //     })
        //     updateTask([
        //       {
        //         columnId: cellMeta.columnId,
        //         rowId: cellMeta.rowId,
        //         originalContent: cellMeta.processedValue,
        //       },
        //     ])
        //   })
        // }
        // if (cellMeta) {
        //   dispatch({
        //     type: TableActionType.SET_CELL_VALUE,
        //     payload: { col, row, value: PENDING_TEXT },
        //   })
        //   updateTask([
        //     {
        //       columnId: cellMeta.columnId,
        //       rowId: cellMeta.rowId,
        //       originalContent: cellMeta.processedValue,
        //     },
        //   ])
        // }
        return true
      } catch (error) {
        console.error('运行单元格失败:', error)
        return false
      }
    },
    [dispatch]
  )
  const deleteColumn = useCallback(
    (col: number): boolean => {
      const columns = getAllColumns()

      columns.splice(col - 1, 1)
      try {
        dispatch({
          type: TableActionType.UPDATE_COLUMNS,
          payload: { columns },
        })
        return true
      } catch (error) {
        console.error('设置表格数据失败:', error)
        return false
      }
    },
    [dispatch]
  )

  /** 数据操作与管理相关 */
  /**
   * 设置表格数据
   * @param records 数据记录数组
   * @param option 选项
   * @returns 是否设置成功
   */
  const setRecords = useCallback(
    <T extends Record<string, unknown>>(
      records: T[],
      option?: {
        sortState?: SortState | SortState[] | null
      }
    ): boolean => {
      try {
        dispatch({
          type: TableActionType.SET_RECORDS,
          payload: { records, option },
        })
        return true
      } catch (error) {
        console.error('设置表格数据失败:', error)
        return false
      }
    },
    [dispatch]
  )

  /**
   * 添加数据记录
   * @param records 数据记录数组
   * @param recordIndex 插入位置索引
   * @returns 是否添加成功
   */
  const addRecords = useCallback(
    <T extends Record<string, unknown>>(records: T[], recordIndex?: number | number[]): boolean => {
      try {
        console.log('添加数据记录:', records, recordIndex)
        dispatch({
          type: TableActionType.ADD_RECORDS,
          payload: { records, recordIndex },
        })
        return true
      } catch (error) {
        console.error('添加数据记录失败:', error)
        return false
      }
    },
    [dispatch]
  )

  /**
   * 添加单条数据记录
   * @param record 数据记录
   * @param recordIndex 插入位置索引
   * @returns 是否添加成功
   */
  const addRecord = useCallback(
    (recordIndex?: number): CellMetadata | false => {
      const record = {} as CellMetadata
      const rowId = nanoid(14)
      const table = getTableInstance()
      recordIndex = recordIndex || table?.dataSource.length
      const recordInfo = getRecordByCell(1, 1)
      if (recordInfo) {
        Object.keys(recordInfo).forEach((key) => {
          if (key.includes('&')) {
            const { columnId, sourceType } = (recordInfo[key] as CellMetadata) || {}
            record[key] = {
              columnId,
              rowId,
              sourceType,
            }
          } else {
            record[key] = null
          }
        })
      }
      record.rowId = rowId
      // table?.selectCell(0, rowIndex + 1)
      try {
        dispatch({
          type: TableActionType.ADD_RECORD,
          payload: { record, recordIndex: recordIndex },
        })
        return record
      } catch (error) {
        console.error('添加单条数据记录失败:', error)
        return false
      }
    },
    [dispatch]
  )

  /**
   * 删除数据记录
   * @param recordIndexes 要删除的记录索引数组
   * @returns 是否删除成功
   */
  const deleteRecords = useCallback(
    (recordIndexes: number[]): boolean => {
      try {
        dispatch({
          type: TableActionType.DELETE_RECORDS,
          payload: { recordIndexes },
        })
        return true
      } catch (error) {
        console.error('删除数据记录失败:', error)
        return false
      }
    },
    [dispatch]
  )

  /**
   * 更新数据记录
   * @param records 新的数据记录数组
   * @param recordIndexes 要更新的记录索引数组
   * @returns 是否更新成功
   */
  const updateRecords = useCallback(
    (records: Omit<RowData, 'rowId'>[], recordIndexes: number[]): boolean => {
      try {
        console.log('更新数据记录:', records, recordIndexes)
        const allRecords = getDisplayRow()
        const rowData = [...allRecords]

        // 将传入的records按照recordIndexes更新到rowData对应位置
        recordIndexes.forEach((index, i) => {
          if (index >= 0 && index < rowData.length && i < records.length) {
            rowData[index] = {
              ...rowData[index],
              ...records[i],
            }
          }
        })
        console.log('更新数据记录:', rowData)

        dispatch({
          type: TableActionType.UPDATE_RECORDS,
          payload: { records: rowData, recordIndexes },
        })
        return true
      } catch (error) {
        console.error('更新数据记录失败:', error)
        return false
      }
    },
    [dispatch, getDisplayRow]
  )

  /** 表格操作相关方法 */
  /**
   * 刷新表格
   * @returns 是否刷新成功
   */
  const refresh = useCallback((): boolean => {
    try {
      dispatch({
        type: TableActionType.REFRESH,
      })
      return true
    } catch (error) {
      console.error('刷新表格失败:', error)
      return false
    }
  }, [dispatch])

  /**
   * 重新创建单元格并刷新表格
   * @returns 是否刷新成功
   */
  const refreshWithRecreateCells = useCallback((): boolean => {
    try {
      dispatch({
        type: TableActionType.REFRESH_WITH_RECREATE_CELLS,
      })
      return true
    } catch (error) {
      console.error('重新创建单元格并刷新表格失败:', error)
      return false
    }
  }, [dispatch])

  /**
   * 修改单元格的值
   * @param col 列索引
   * @param row 行索引
   * @param value 新值
   * @param workOnEditableCell 是否只在可编辑单元格上操作
   * @returns 是否修改成功
   */
  const setCellValue = useCallback(
    (col: number, row: number, value: string | number, workOnEditableCell: boolean = false): boolean => {
      try {
        dispatch({
          type: TableActionType.SET_CELL_VALUE,
          payload: { col, row, value, workOnEditableCell },
        })
        return true
      } catch (error) {
        console.error('设置单元格值失败:', error)
        return false
      }
    },
    [dispatch]
  )

  /**
   * 获取单元格值
   * @param col 列索引
   * @param row 行索引
   * @param skipCustomMerge 是否跳过自定义合并
   * @returns 单元格值
   */
  const getCellValue = useCallback(
    (col: number, row: number, skipCustomMerge?: boolean): string | number | null => {
      const table = getTableInstance()
      return table?.getCellValue(col, row, skipCustomMerge) || null
    },
    [getTableInstance]
  )

  /**
   * 根据单元格位置获取记录
   * @param col 列索引
   * @param row 行索引
   * @returns 数据记录对象
   */
  const getRecordByCell = useCallback(
    <T extends Record<string, unknown>>(col: number, row: number): T => {
      const table = getTableInstance()
      return table?.getRecordByCell(col, row) || ({} as T)
    },
    [getTableInstance]
  )

  /**
   * 更新表格列配置
   * @param columns 新的列配置
   * @returns 是否更新成功
   */
  const updateColumns = useCallback(
    (columns: ColumnDefine[]): boolean => {
      try {
        dispatch({
          type: TableActionType.UPDATE_COLUMNS,
          payload: { columns },
        })
        return true
      } catch (error) {
        console.error('更新列配置失败:', error)
        return false
      }
    },
    [dispatch]
  )

  /**
   * 选择单元格
   * @param col 列索引
   * @param row 行索引
   * @returns 是否选择成功
   */
  const selectCell = useCallback(
    (col: number, row: number): boolean => {
      try {
        dispatch({
          type: TableActionType.SELECT_CELL,
          payload: { col, row },
        })
        return true
      } catch (error) {
        console.error('选择单元格失败:', error)
        return false
      }
    },
    [dispatch]
  )

  /**
   * 清除所有选择
   * @returns 是否清除成功
   */
  const clearSelection = useCallback((): boolean => {
    try {
      dispatch({
        type: TableActionType.CLEAR_SELECTION,
      })
      return true
    } catch (error) {
      console.error('清除选择失败:', error)
      return false
    }
  }, [dispatch])

  /**
   * 滚动到指定单元格位置
   * @param col 列索引
   * @param row 行索引
   * @returns 是否滚动成功
   */
  const scrollToCell = useCallback(
    (col: number, row: number): boolean => {
      try {
        dispatch({
          type: TableActionType.SCROLL_TO_CELL,
          payload: { col, row },
        })
        return true
      } catch (error) {
        console.error('滚动到单元格失败:', error)
        return false
      }
    },
    [dispatch]
  )

  return {
    // 数据操作方法
    setRecords,
    addRecord,
    addRecords,
    deleteRecords,
    updateRecords,

    // 表格操作方法
    refresh,
    refreshWithRecreateCells,
    setCellValue,
    getCellValue,
    getRecordByCell,
    runCell,
    runColumn,
    deleteColumn,

    // 其他操作方法
    addColumn,
    updateColumns,
    selectCell,
    clearSelection,
    scrollToCell,

    // 获取原始表格实例
    getTableInstance,
  }
}
