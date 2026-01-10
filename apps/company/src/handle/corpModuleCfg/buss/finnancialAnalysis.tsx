import { CorpSubModuleCfg } from '@/types/corpDetail'
import { CompanyDetailCustom } from '@/types/corpDetail/node/custom'
import { intlNoNO as intl } from 'src/utils/intl'

export const corpDetailFinancialAnalysis = {
  title: intl('451239', '财务指标'),
  cmd: '/detail/company/financialIndicatorV3',
  modelNum: ['domesticFinancialIndicatorNum', 'overseasFinancialIndicatorNum'],
  custom: CompanyDetailCustom.FinancialIndicators,
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return {
      ...param,
    }
  },
} as CorpSubModuleCfg
