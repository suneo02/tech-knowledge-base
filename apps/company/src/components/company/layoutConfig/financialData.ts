import { corpDetailFinancial, corpDetailFinancialData } from '@/handle/corpModuleCfg/buss/finnancial'
import { corpDetailFinancialAnalysis } from '@/handle/corpModuleCfg/buss/finnancialAnalysis'
import { CorpMenuModuleCfg } from '@/types/corpDetail'
import intl from '@/utils/intl'

export const corpDetailFinancialDataMenu: CorpMenuModuleCfg = {
  title: intl('32428', '财务数据'),
  children: [
    {
      countKey: corpDetailFinancial.modelNum,
      showModule: 'FinancialData',
      showName: corpDetailFinancialData.title,
      hideMenuNum: true,
    },
    {
      countKey: corpDetailFinancialAnalysis.modelNum,
      showModule: 'Financeanalysis',
      showName: corpDetailFinancialAnalysis.title,
      hideMenuNum: true,
    },
  ],
}
