import { requestToWFCSuperlistFcs } from '@/api'
import { ColumnReturnType, handleColumnUtils } from '@/components/VisTable/utils/handleColumn'
import { isCanceledError } from 'gel-ui'
import { useEffect, useState } from 'react'

export const useSheetInfo = (sheetId: string, version: number = 0) => {
  // console.log('🚀 ~ useSheetInfo ~ version:', sheetId, version)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [columns, setColumns] = useState<ColumnReturnType[]>([])
  const [rowIds, setRowIds] = useState<string[]>([])

  useEffect(() => {
    const sheetIdNum = Number(sheetId)
    if (!sheetIdNum) {
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const { signal } = controller

    const getSheetInfo = async () => {
      setLoading(true)
      setError(null)
      try {
        const [columnsResponse, rowIdsResponse] = await Promise.all([
          requestToWFCSuperlistFcs('superlist/excel/getSheetColumns', { sheetId: sheetIdNum }, { signal }),
          requestToWFCSuperlistFcs('superlist/excel/getSheetAllRowIds', { sheetId: sheetIdNum }, { signal }),
        ])

        const { Data: columnsResult } = columnsResponse
        if (!columnsResult) {
          return
        }
        const fetchedColumns = columnsResult.columns.map((res) => handleColumnUtils(res))
        setColumns(fetchedColumns)

        const { Data: rowIdsResult } = rowIdsResponse
        setRowIds(rowIdsResult?.rowIds ?? [])
      } catch (err) {
        if (!isCanceledError(err)) {
          console.error('获取表格数据失败:', err)
          setError(err as Error)
        }
      } finally {
        setLoading(false)
      }
    }

    getSheetInfo()

    return () => {
      controller.abort()
    }
  }, [sheetId, version])

  return { loading, error, columns, rowIds }
}
