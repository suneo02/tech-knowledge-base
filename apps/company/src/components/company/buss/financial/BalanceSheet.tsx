import { ICorpTableCfg } from '@/components/company/type'
import { Dispatch, FC, SetStateAction } from 'react'
import intl from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'

interface BalanceInfo {
  defaultList: any[]
  list: any[]
  columns?: Record<string, any>[]
}

interface FinancialSheetProps {
  data: any[]
  setBalanceInfo: Dispatch<SetStateAction<BalanceInfo>>
  setDataLoaded: (loaded: boolean) => void
  eachTable: ICorpTableCfg
}

export const renderFinanceSheet: FC<FinancialSheetProps> = ({ data, setBalanceInfo, setDataLoaded, eachTable }) => {
  // 资产负债表
  const defaultData = [
    { reportDate: intl('437709', '资产总计') },
    { reportDate: intl('437710', '负债合计') },
    { reportDate: intl('417645', '归属母公司股东权益') },
    { reportDate: intl('138784', '股东权益合计') },
  ]

  if (!data?.length) {
    setBalanceInfo({ defaultList: [], list: [], columns: [] })
    return null
  }

  const columns: Record<string, any>[] = [
    {
      title: intl('1794', '报告期'),
      dataIndex: 'reportDate',
      width: '20%',
    },
  ]

  const indexArr = ['_sumOfAsset', '_sumOfDebt', '_sumOfHolderRightsAndInterests1', '_sumOfHolderRightsAndInterests2']

  data.forEach((item) => {
    columns.push({
      title: item['_reportDate'],
      dataIndex: indexArr[columns.length - 1],
      width: 80 / data.length + '%',
      align: 'right',
      render: (txt: any, _row: any, idx: number) => {
        return idx === 4 ? wftCommon.formatCont(txt) : wftCommon.formatMoney(txt, '', null, true)
      },
    })

    delete item['_reportDate']
    delete item['type']
    indexArr.forEach((item1, index1) => {
      defaultData[index1][indexArr[columns.length - 2]] = item[item1]
    })
  })

  setBalanceInfo((prev) => ({ ...prev, columns, defaultList: defaultData }))
  setDataLoaded(true)
  if (eachTable.financialDataFilterFunc) {
    eachTable.financialDataFilterFunc(eachTable.financialDataUnitFilter)
  }

  return null
}

export default renderFinanceSheet
