import { ICorpTableCfg } from '@/components/company/type'
import intl from '@/utils/intl'
import { FC } from 'react'
import { wftCommon } from '../../../../utils/utils'
import { getEmptyFinanceTableColumns } from './handleFinanceTableEmpty'

interface CashFlowSheetProps {
  data: any[]
  setCashflowInfo: (
    updater: (prev: { defaultList: any[]; list: any[]; columns?: Record<string, any>[] }) => {
      defaultList: any[]
      list: any[]
      columns?: Record<string, any>[]
    }
  ) => void
  setDataLoaded: (loaded: boolean) => void
  eachTable: ICorpTableCfg
}

export const renderCashFlowSheet: FC<CashFlowSheetProps> = ({
  data: res,
  setCashflowInfo,
  setDataLoaded,
  eachTable,
}) => {
  // 现金流表
  const defaultData = [
    { reportDate: intl('454314', '经营活动现金流入小计') },
    { reportDate: intl('437699', '经营活动现金流出小计') },
    { reportDate: intl('437681', '经营活动产生的现金流量净额') },
    { reportDate: intl('437700', '投资活动现金流入小计') },
    { reportDate: intl('437701', '投资活动现金流出小计') },
    { reportDate: intl('437702', '投资活动产生的现金流量净额') },
    { reportDate: intl('454315', '筹资活动现金流入小计') },
    { reportDate: intl('437704', '筹资活动现金流出小计') },
    { reportDate: intl('437705', '筹资活动产生的现金流量净额') },
  ]

  if (!res?.length) {
    const columns = getEmptyFinanceTableColumns()
    setCashflowInfo((prev) => ({ ...prev, columns, defaultList: [], list: [] }))
    setDataLoaded(true)
    return null
  }

  const columns: Record<string, any>[] = [
    {
      title: intl('1794', '报告期'),
      dataIndex: 'reportDate',
      width: '20%',
    },
  ]

  const indexArr = [
    '_sumOfBusinessCash',
    '_sumOfBusinessCashPayout',
    '_netNumberOfBusinessCashPayout2',
    '_sumOfOtherBusinessCashIn',
    '_sumOfInvestmentCashOut',
    '_netCashOfInvestment',
    '_sumOfChipingCapital',
    '_sumForChippingCapital',
    '_netNumberForChippingCapital',
  ]

  res.forEach((item, index) => {
    columns.push({
      title: item['_reportDate'],
      dataIndex: indexArr[index],
      width: 80 / res.length + '%',
      align: 'right',
      render: (txt: any) => {
        return wftCommon.formatMoney(txt, '', null, true)
      },
    })
    delete item['_reportDate']
    delete item['type']
    indexArr.forEach((item1, index1) => {
      defaultData[index1][indexArr[index]] = item[item1]
    })
  })

  setCashflowInfo((prev) => ({ ...prev, columns }))
  setCashflowInfo((prev) => ({ ...prev, defaultList: defaultData }))
  setDataLoaded(true)
  if (eachTable.financialDataFilterFunc) {
    eachTable.financialDataFilterFunc(eachTable.financialDataUnitFilter)
  }

  return null
}

export default renderCashFlowSheet
