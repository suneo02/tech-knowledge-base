import { ICorpSubModuleCfg } from '@/components/company/type'

/**
 * 征信备案
 *
 */
export const corpDetailInvestigationFiling: ICorpSubModuleCfg = {
  modelNum: ['companyCreditNum', 'personCreditNum'],
}

export const corpDetailInvestigationFilingCorp: ICorpSubModuleCfg = {
  modelNum: 'companyCreditNum',
}

export const corpDetailInvestigationFilingPerson: ICorpSubModuleCfg = {
  modelNum: 'personCreditNum',
}
