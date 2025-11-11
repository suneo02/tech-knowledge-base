import { requestToWFCSuperlistFcs } from '@/api'
import { useTableAITask } from '@/components/ETable/context/TableAITaskContext'
import { TaskIdentifier } from '@/components/ETable/context/ai-task/types'
import { GENERATE_TEXT } from '@/components/VisTable/config/status'
import big from 'big.js'
import { CellMetadata, ColumnDataTypeEnum, ProgressStatusEnum, RowData } from 'gel-api'
import { isCanceledError } from 'gel-ui'
import { useCallback } from 'react'

export const useETableRecords = () => {
  const { addTasksOnly } = useTableAITask()
  const getRecords = useCallback(async (rowIds: string[], signal?: AbortSignal): Promise<RowData[]> => {
    try {
      const res = await requestToWFCSuperlistFcs('superlist/excel/getRowsDetail', { rowIds }, { signal }).catch(
        (err) => {
          console.error('getRecords failed:', err)
          return { Data: { data: [] } }
        }
      )

      if (!res.Data) {
        return []
      }

      if (rowIds.length !== res.Data.data.length) {
        console.error(`传入的数据和返回的数据长度不一致， 传入长度${rowIds.length}，输出长度${res.Data.data.length}`)
        const mixture = Array.from(
          { length: Math.abs(rowIds.length - res.Data.data.length) },
          () => ({ rowId: '', id: '' }) as RowData
        )
        return [...res.Data.data, ...mixture]
      }

      const list: TaskIdentifier[] = []
      res.Data.data.map((item) => {
        Object.keys(item).forEach((key) => {
          if (key.includes('&')) {
            const cellMetadata = item[key] as CellMetadata
            const cellValue = item[key.split('&')[0]]
            // 如果是数字，则转换为千分位格式
            if (
              cellMetadata?.columnDataType === ColumnDataTypeEnum.INTEGER ||
              cellMetadata?.columnDataType === ColumnDataTypeEnum.FLOAT
            ) {
              if (cellValue && cellValue !== '--') {
                item[key.split('&')[0]] = Number(cellValue).toLocaleString()
              }
            }
            if (cellMetadata?.columnDataType === ColumnDataTypeEnum.PERCENT) {
              if (cellValue !== '--') {
                item[key.split('&')[0]] = `${big(cellValue).times(100)}%`
              }
            }
            if (cellMetadata?.status === ProgressStatusEnum.RUNNING) {
              item[key.split('&')[0]] = GENERATE_TEXT
              list.push({
                columnId: cellMetadata.columnId,
                rowId: cellMetadata.rowId,
                originalContent: cellMetadata.processedValue,
                status: cellMetadata.status,
              })
            }
          }
        })
        return item
      })
      addTasksOnly(list)
      return res.Data.data
    } catch (error) {
      if (!isCanceledError(error)) {
        console.error('getRecords failed:', error)
      }
      return [] as RowData[]
    }
  }, [])

  return { getRecords }
}
