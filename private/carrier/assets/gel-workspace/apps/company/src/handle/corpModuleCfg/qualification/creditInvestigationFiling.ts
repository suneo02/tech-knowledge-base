import { CorpSubModuleCfg } from '@/types/corpDetail'

/**
 * 征信备案
 *
 */
export const corpDetailInvestigationFiling: CorpSubModuleCfg = {
  modelNum: ['companyCreditNum', 'personCreditNum'],
}

export const corpDetailInvestigationFilingCorp: CorpSubModuleCfg = {
  modelNum: 'companyCreditNum',
}

export const corpDetailInvestigationFilingPerson: CorpSubModuleCfg = {
  modelNum: 'personCreditNum',
}
