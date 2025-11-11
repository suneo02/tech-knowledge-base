import { ICorpSubModuleCfg } from '@/components/company/type'

export const corpDetailFinalBeneficiary: ICorpSubModuleCfg = {
  modelNum: ['beneficialOwner', 'beneficialInstitutions', 'beneficialNaturalPerson'],
}

/**
 * 股权出质人
 */
export const corpDetailFinalBeneficiaryOwner: ICorpSubModuleCfg = {
  modelNum: 'beneficialOwner',
}

/**
 * 股权 质权人
 */
export const corpDetailFinalBeneficiaryInstitution: ICorpSubModuleCfg = {
  modelNum: 'beneficialInstitutions',
}

/**
 * 出质标的
 */
export const corpDetailFinalBeneficiaryPerson: ICorpSubModuleCfg = {
  modelNum: 'beneficialNaturalPerson',
}
