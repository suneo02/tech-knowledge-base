import { corpDetailFinancialData } from '@/handle/corpModuleCfg/buss/finnancial.tsx'
import { corpDetailFinancialAnalysis } from '@/handle/corpModuleCfg/buss/finnancialAnalysis.tsx'
import { CorpPrimaryModuleCfg } from '@/types/corpDetail'
import { intlNoNO as intl } from '@/utils/intl'

export const financialDataPrimary: CorpPrimaryModuleCfg = {
  moduleTitle: {
    title: intl('32428', '财务数据'),
    moduleKey: 'financialData',
    noneData: intl('132725', '暂无数据'),
  },
  FinancialData: corpDetailFinancialData,
  Financeanalysis: corpDetailFinancialAnalysis,
}
