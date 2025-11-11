import { requestToWFCSuperlistFcs } from '@/api'
import { TaskIdentifier } from '@/components/ETable/context/ai-task/types'
import { CellMetadata, ProgressStatusEnum, RowData, SourceTypeEnum } from 'gel-api'
import { isCanceledError } from 'gel-ui'
import { useCallback } from 'react'
import { GENERATE_TEXT } from '../config/status'

export const useGetRecords = () => {
  const getRecords = useCallback(async (rowIds: string[], signal?: AbortSignal): Promise<RowData[]> => {
    try {
      const res = await requestToWFCSuperlistFcs('superlist/excel/getRowsDetail', { rowIds }, { signal })
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
      res.Data.data.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (key.includes('&')) {
            const cellMetadata = item[key] as CellMetadata
            if (cellMetadata?.status === ProgressStatusEnum.RUNNING) {
              item[key.split('&')[0]] = GENERATE_TEXT
              list.push({
                columnId: cellMetadata.columnId,
                rowId: cellMetadata.rowId,
                originalContent: cellMetadata.processedValue,
                status: cellMetadata.status,
              })
            }
          } else {
            const cellMetadata = item?.[`${key}&`] as CellMetadata
            if (
              cellMetadata &&
              (cellMetadata.status === ProgressStatusEnum.SUCCESS ||
                cellMetadata.status === ProgressStatusEnum.FAILED) &&
              (cellMetadata.sourceType === SourceTypeEnum.AI_CHAT ||
                cellMetadata.sourceType === SourceTypeEnum.AI_GENERATE_COLUMN ||
                cellMetadata.sourceType === SourceTypeEnum.CDE ||
                cellMetadata.sourceType === SourceTypeEnum.INDICATOR)
            ) {
              item[key] = item[key] && (item[key] as unknown as number) !== 0 ? item[key] : '--'
            }
          }
        })
      })
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
