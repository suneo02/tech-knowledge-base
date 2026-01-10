import { CorpSubModuleCfg } from '@/types/corpDetail'
import { CompanyDetailCustom } from '@/types/corpDetail/node/custom'
import { intlNoNO as intl } from 'src/utils/intl'

export const corpDetailFinancial: CorpSubModuleCfg = {
  modelNum: ['domesticFinancialReportNum', 'overseasFinancialReportNum'],
}

export const corpDetailFinancialData: CorpSubModuleCfg = {
  title: intl('2295', '财务报表'),
  numHide: true,
  modelNum: corpDetailFinancial.modelNum,
  custom: CompanyDetailCustom.FinancialStatements,
}
