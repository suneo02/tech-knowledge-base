import { requestToSuperlistFcs } from '@/api'
import { TaskIdentifier } from '@/components/ETable/context/ai-task/types'
import { GENERATE_TEXT } from '@/components/VisTable/config/status'
import { ListTableAll } from '@visactor/vtable/es/ListTable-all'
import { CellMetadata, ProgressStatusEnum, RowData, RunColumnStatus } from 'gel-api'
import { message } from '@wind/wind-ui'
import { postPointBuried } from '@/utils/common/bury'

// 本文件的方法不做具体的容错处理，请务必保证ref的存在再执行

export interface ETableOperationResult {
  runCell: (col: number, row: number) => TaskIdentifier | false
  runColumn: (field: string, sheetId: number, status?: RunColumnStatus) => Promise<TaskIdentifier[] | false>
}

const RUN_COLUMN_API = 'excel/runColumn'
export const eTableOperation = (ref: ListTableAll): ETableOperationResult => {
  /** 获取所有关于当前单元格的数据，包括单元格值、meta信息、列字段、行数据 */
  const _getCellFullInfo = (
    col: number,
    row: number
  ): { value: string; meta: CellMetadata; field: string; record: RowData } => {
    const field = ref.getHeaderField(col, row) as string
    const record = ref.getRecordByCell(col, row)
    return { value: record[field], meta: record[`${field}&`], field, record }
  }

  // 运行单元格
  const runCell: ETableOperationResult['runCell'] = (col, row) => {
    try {
      const { field, record, meta } = _getCellFullInfo(col, row)
      const oriRecordIndex = ref.records?.findIndex((res) => res.rowId === record.rowId)
      const recordIndex = ref.dataSource.currentIndexedData?.findIndex((i) => i === oriRecordIndex)
      if (!record) return false
      const newRecord = {
        ...record,
        [field]: GENERATE_TEXT,
        [`${field}&`]: {
          ...(meta || {}),
          status: ProgressStatusEnum.PENDING,
          processedValue: GENERATE_TEXT,
        },
      }
      if (recordIndex || recordIndex === 0) {
        ref.updateRecords([newRecord], [recordIndex])
      }
      return { columnId: field, rowId: record.rowId }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const runColumn: ETableOperationResult['runColumn'] = async (field, sheetId, status) => {
    const { result } = await requestToSuperlistFcs(RUN_COLUMN_API, {
      columnId: field,
      sheetId,
      statusToRun: status || RunColumnStatus.ALL,
    })
    if (!result?.data?.length) {
      message.warning('没有需要运行的单元格')
      return false
    }
    const records: RowData[] = []
    const recordIndexs: number[] = []
    result.data.forEach((item) => {
      const record = ref.records?.find((res) => res.rowId === item.rowId)

      const oriRecordIndex = ref.records?.findIndex((res) => res.rowId === record?.rowId)
      const recordIndex = ref.dataSource.currentIndexedData?.findIndex((i) => i === oriRecordIndex)
      const newRecord = {
        ...record,
        [item.columnId]: GENERATE_TEXT,
        [`${item.columnId}&`]: {
          ...(record[`${item.columnId}&`] || {}),
          status: ProgressStatusEnum.PENDING,
          processedValue: GENERATE_TEXT,
        },
      }
      if (record && (recordIndex || recordIndex === 0)) {
        records.push(newRecord)
        recordIndexs.push(recordIndex)
      }
    })
    if (records.length) {
      const columnName = ref.columns.find((res) => res.field === field)?.title
      postPointBuried('922604570317', {
        run: status === RunColumnStatus.PENDING ? '运行待处理行' : '运行全部',
        column: columnName,
      })
      ref.updateRecords(records, recordIndexs)
      return result.data.map((item) => ({ columnId: item.columnId, rowId: item.rowId, cellId: item.cellId }))
    }
    return false
  }

  return { runCell, runColumn }
}
