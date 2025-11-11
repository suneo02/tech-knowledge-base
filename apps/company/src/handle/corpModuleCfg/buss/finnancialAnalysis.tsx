import { ICorpSubModuleCfg } from '@/components/company/type'
import { intlNoNO as intl } from 'src/utils/intl'

export const corpDetailFinancialAnalysis: ICorpSubModuleCfg = {
  title: intl('451239', '财务指标'),
  cmd: '/detail/company/financialIndicator',
  modelNum: 'financial_indicator_num',
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return {
      ...param,
    }
  },
}
