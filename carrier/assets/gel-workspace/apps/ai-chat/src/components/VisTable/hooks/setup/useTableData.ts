import { requestToWFCSuperlistFcs } from '@/api'
import * as VTable from '@visactor/vtable'
import { useRequest } from 'ahooks'
import { handleColumnUtils } from '../../utils/handleColumn'

interface UseTableDataResult {
  columns: VTable.TYPES.ColumnDefine[]
  rowIds: string[]
  rowLength: number
}

export const useTableData = (sheetId: number) => {
  return useRequest(
    async (): Promise<UseTableDataResult> => {
      const [columnsResponse, rowIdsResponse] = await Promise.all([
        requestToWFCSuperlistFcs('superlist/excel/getSheetColumns', { sheetId }),
        requestToWFCSuperlistFcs('superlist/excel/getSheetAllRowIds', { sheetId }),
      ])

      const { Data: columnsResult } = columnsResponse
      const columns = columnsResult ? columnsResult.columns.map((res) => handleColumnUtils(res)) : []

      const { Data: rowIdsResult } = rowIdsResponse
      const rowIds = rowIdsResult?.rowIds || []

      return {
        columns: columns as VTable.TYPES.ColumnDefine[],
        rowIds,
        rowLength: rowIds.length,
      }
    },
    {
      loadingDelay: 500,
      // 只在初始化时自动执行
      manual: false,
      onError: (error) => {
        console.error('获取表格数据失败:', error)
      },
    }
  )
}
