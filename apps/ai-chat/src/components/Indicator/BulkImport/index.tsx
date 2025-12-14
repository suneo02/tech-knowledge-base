import { createSuperlistRequestFcs, createWFCSuperlistRequestFcs } from '@/api'
import { fetchPoints, useAppDispatch } from '@/store'
import { useRequest } from 'ahooks'
import { IndicatorCorpMatchItem } from 'gel-api'
import { isEn } from 'gel-util/intl'
import {
  BulkImportModals,
  IndicatorBulkImportData,
  IndicatorImportTransformedData,
  IndicatorProvider,
  transformIndicatorImportData,
} from 'indicator'
import { FC } from 'react'

export interface BulkImportModalLocalProps {
  open: boolean
  handleCancel: () => void
  loading?: boolean
  onFinish?: (result: IndicatorImportTransformedData, clueExcelName?: string) => void
}
export const BulkImportModalLocal: FC<BulkImportModalLocalProps> = ({
  open,
  handleCancel,
  onFinish,
  loading = false,
}) => {
  const handleOk = (data: IndicatorCorpMatchItem[], excelData?: IndicatorBulkImportData[], clueExcelName?: string) => {
    const result = transformIndicatorImportData(data, excelData)
    onFinish?.(result, clueExcelName)
  }
  return (
    <IndicatorProvider>
      <BulkImportModals
        open={open}
        handleOk={handleOk}
        handleCancel={handleCancel}
        isEn={isEn()}
        confirmLoading={loading}
        searchCompanies={createSuperlistRequestFcs('company/search')}
        matchCompanies={createSuperlistRequestFcs('company/match')}
      />
    </IndicatorProvider>
  )
}

const addDataToSheetFunc = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet')
export const BulkImportForChat: FC<
  Omit<BulkImportModalLocalProps, 'onFinish'> & {
    onFinish: () => void
    tableId: string
    sheetId: number
  }
> = ({ onFinish, tableId, sheetId, ...restProps }) => {
  const dispatch = useAppDispatch()
  const { run: addDataToSheet, loading } = useRequest<
    Awaited<ReturnType<typeof addDataToSheetFunc>>,
    Parameters<typeof addDataToSheetFunc>
  >(addDataToSheetFunc, {
    onSuccess: () => {
      onFinish?.()
      dispatch(fetchPoints())
    },
    onError: console.error,
    manual: true,
  })
  const handleFinish = (result: IndicatorImportTransformedData) => {
    addDataToSheet({
      tableId,
      sheetId,
      dataType: 'CLUE_EXCEL',
      clueExcelCondition: result,
      enablePointConsumption: 1,
    })
  }
  return <BulkImportModalLocal onFinish={handleFinish} loading={loading} {...restProps} />
}
