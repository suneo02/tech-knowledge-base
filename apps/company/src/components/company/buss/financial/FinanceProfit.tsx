import { ICorpTableCfg } from '@/components/company/type'
import intl from '@/utils/intl'
import { FC } from 'react'
import { wftCommon } from '../../../../utils/utils'
import { getEmptyFinanceTableColumns } from './handleFinanceTableEmpty'

interface ProfitBasicInfoProps {
  _businessProfit: number
  _netProfit2: number
  _sumBusinessIncome: number
  _sumProfit: number
}

interface FinanceProfitProps {
  data: any[]
  setProfitBasicInfo: (
    updater: (prev: {
      defaultList: ProfitBasicInfoProps[]
      list: ProfitBasicInfoProps[]
      columns?: Record<string, any>[]
    }) => { defaultList: ProfitBasicInfoProps[]; list: ProfitBasicInfoProps[]; columns?: Record<string, any>[] }
  ) => void
  setDataLoaded: (loaded: boolean) => void
  eachTable: ICorpTableCfg
}

export const renderFinanceProfit: FC<FinanceProfitProps> = ({
  data: res,
  setProfitBasicInfo,
  setDataLoaded,
  eachTable,
}) => {
  // 利润表
  const defaultData = [
    {
      reportDate: intl('35216', '营业总收入'),
      _businessProfit: 0,
      _netProfit2: 0,
      _sumBusinessIncome: 0,
      _sumProfit: 0,
    },
    {
      reportDate: intl('437706', '营业利润'),
      _businessProfit: 0,
      _netProfit2: 0,
      _sumBusinessIncome: 0,
      _sumProfit: 0,
    },
    {
      reportDate: intl('437707', '税前利润'),
      _businessProfit: 0,
      _netProfit2: 0,
      _sumBusinessIncome: 0,
      _sumProfit: 0,
    },
    {
      reportDate: intl('417696', '归属母公司股东净利润'),
      _businessProfit: 0,
      _netProfit2: 0,
      _sumBusinessIncome: 0,
      _sumProfit: 0,
    },
  ]

  if (!res?.length) {
    const columns = getEmptyFinanceTableColumns()
    setProfitBasicInfo((prev) => ({ ...prev, columns, defaultList: [], list: [] }))
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

  const indexArr = ['_sumBusinessIncome', '_businessProfit', '_sumProfit', '_netProfit2']

  res.forEach((item, index) => {
    columns.push({
      title: item['_reportDate'],
      dataIndex: indexArr[index],
      width: 80 / res.length + '%',
      align: 'right',
      render: (txt: any, _row: any, idx: number) => {
        return idx === 4 ? wftCommon.formatCont(txt) : wftCommon.formatMoney(txt, '', null, true)
      },
    })
    delete item['_reportDate']
    delete item['type']
    indexArr.forEach((item1, index1) => {
      defaultData[index1][indexArr[index]] = item[item1]
    })
  })

  setProfitBasicInfo((prev) => ({ ...prev, columns }))
  setProfitBasicInfo((prev) => ({ ...prev, defaultList: defaultData }))
  setDataLoaded(true)
  if (eachTable.financialDataFilterFunc) {
    eachTable.financialDataFilterFunc(eachTable.financialDataUnitFilter)
  }

  return null
}

export default renderFinanceProfit
