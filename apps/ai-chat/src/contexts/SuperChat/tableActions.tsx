// import { ColumnDefine } from '@visactor/vtable'
import { CellMetadata, Column, ProgressStatusEnum } from 'gel-api'
import { useCallback } from 'react'
import { useSuperChatRoomContext } from '.'
import { ColumnConfig, handleColumnUtils } from '@/components/VisTable/utils/handleColumn'
import { GENERATE_TEXT } from '@/components/VisTable/config/status'
import { useTableAITask } from '@/components/ETable/context/TableAITaskContext'
import { TaskIdentifier, TaskStatusItem } from '@/components/ETable/context/ai-task/types'

/**
 * 所有针对表格的操作
 * @important 不允许使用任何借口，这个只针对表格的静态操作
 * @
 * @returns
 */
export const useTableOperations = (tabKey?: string) => {
  const { sheetRefs, activeSheetId } = useSuperChatRoomContext()
  const { updateTask } = useTableAITask()

  const currentSheetRef = sheetRefs?.[tabKey || activeSheetId]

  const addColumn = useCallback(
    (column: Column) => {
      const newColumn = handleColumnUtils(column as ColumnConfig)
      currentSheetRef?.addColumn(newColumn)
      setTimeout(() => {
        currentSheetRef?.selectCell(currentSheetRef?.columns.length, 0)
      }, 30)
    },
    [currentSheetRef]
  )

  const updateColumn = useCallback(
    (field: string, value: string) => {
      const columns = currentSheetRef?.columns
      if (columns) {
        currentSheetRef?.updateColumns(
          columns.map((res) => {
            if (res.field === field) {
              return {
                ...res,
                title: value,
              }
            }
            return res
          })
        )
      }
    },
    [currentSheetRef]
  )

  // 更新区域单元格（除列头）
  const updateCells = useCallback(
    (startCol: number, startRow: number, values: (string | number)[][], workOnEditableCell?: boolean) => {
      currentSheetRef?.changeCellValues(startCol, startRow, values, workOnEditableCell, false)
    },
    [currentSheetRef]
  )

  // 更新整列单元格（除列头）
  //   const updateColumnCells = useCallback(
  //     (col: number, values: (string | number)[][], workOnEditableCell?: boolean) => {
  //       const rowCount = currentSheetRef?.recordsCount
  //       currentSheetRef?.changeCellValues(col, 0, values, workOnEditableCell, false)
  //     },
  //     [currentSheetRef]
  //   )

  const updateRecordsStatus = useCallback(
    (columnId: string) => {
      const oriRecords = currentSheetRef?.records
      const taskList: TaskIdentifier[] = []
      const newRecords: CellMetadata[] = []
      oriRecords?.forEach((res) => {
        res[columnId] = GENERATE_TEXT
        const defaultCellMetadata = res[`${columnId}&`] || ({} as CellMetadata)
        res[`${columnId}&`] = {
          ...defaultCellMetadata,
          status: ProgressStatusEnum.PENDING,
          processedValue: defaultCellMetadata?.processedValue || GENERATE_TEXT,
          columnId,
          rowId: res.rowId,
        } as CellMetadata
        taskList.push({
          columnId,
          rowId: res.rowId,
          originalContent: res[`${columnId}&`]?.processedValue,
        })
        newRecords.push(res)
      })
      currentSheetRef?.updateRecords(
        newRecords,
        Array.from({ length: oriRecords?.length || 0 }, (_, index) => index)
      )
      updateTask(taskList, taskList.length)
    },
    [currentSheetRef, updateTask]
  )

  const updateRecord = useCallback(
    (columnId: string, rowId: string, value: TaskStatusItem) => {
      const record = currentSheetRef?.records?.find((res) => res.rowId === rowId)
      const recordIndex = currentSheetRef?.records?.findIndex((res) => res.rowId === rowId)
      if (record) {
        record[columnId] = value.content
        record[`${columnId}&`] = {
          ...(record[`${columnId}&`] || {}),
          rowId,
          columnId,
          cellId: value.cellId,
          status: value.status,
          processedValue: value.content,
        }
        currentSheetRef?.updateRecords([record], recordIndex ? [recordIndex] : [])
      }
    },
    [currentSheetRef]
  )

  // 运行任务专属更新单元格
  const updateRunTaskRecords = useCallback(
    (records: TaskStatusItem[]) => {
      console.log('🚀 ~ updateRunTaskRecords ~ records:', records)
      const newRecords: CellMetadata[] = []
      const recordIndexs: number[] = []
      const oriRecords = currentSheetRef?.records
      console.log('🚀 ~ useTableOperations ~ oriRecords:', oriRecords)
      console.log('🚀 ~ updateRunTaskRecords ~ test:', currentSheetRef)
      records.forEach((record) => {
        const info: CellMetadata = currentSheetRef?.records?.find((res) => res.rowId === record.rowId)
        const oriRecordIndex = currentSheetRef?.records?.findIndex((res) => res.rowId === record.rowId) // 原始索引
        const recordIndex = currentSheetRef?.dataSource.currentIndexedData?.findIndex((i) => i === oriRecordIndex) // 转换成当前排序的索引
        if (info) {
          info[record.columnId] = record.content
          info[`${record.columnId}&`] = {
            ...(info[`${record.columnId}&`] || {}),
            rowId: record.rowId,
            columnId: record.columnId,
            cellId: record.cellId,
            status: record.status,
            processedValue: record.content,
            sourceId: record.sourceId,
          }
          newRecords.push(info)
        }

        if (recordIndex || recordIndex === 0) recordIndexs.push(recordIndex)
      })
      currentSheetRef?.updateRecords(newRecords, recordIndexs)
    },
    [currentSheetRef]
  )

  const runCell = useCallback(
    (col, row) => {
      const field = currentSheetRef?.getHeaderField(col, row) as string
      const record = currentSheetRef?.getRecordByCell(col, row)
      const oriRecordIndex = currentSheetRef?.records?.findIndex((res) => res.rowId === record.rowId) // 原始索引
      const recordIndex = currentSheetRef?.dataSource.currentIndexedData?.findIndex((i) => i === oriRecordIndex) // 转换成当前排序的索引
      if (record) {
        record[field] = GENERATE_TEXT
        record[`${field}&`] = {
          ...(record[`${field}&`] || {}),
          status: ProgressStatusEnum.PENDING,
          processedValue: GENERATE_TEXT,
        }
      }
      currentSheetRef?.updateRecords([record], recordIndex || recordIndex === 0 ? [recordIndex] : [])
    },
    [currentSheetRef]
  )

  return {
    // 列操作
    addColumn,
    updateColumn,
    // 单元格操作
    runCell,
    updateCells,
    updateRecordsStatus,
    updateRecord,
    updateRunTaskRecords,

    updateTask,
  }
}
