import { CorpBasicInfo } from '@/api/corp/info/basicInfo.ts'
import { ECorpTypeCode, ECorpTypeCodeTitleMap } from '@/api/corp/info/common.ts'

export { getIfOverseaCorp, useHandleOverseaCorp } from './oversea'

export const getIfIndividualBusiness = (
  corpType?: CorpBasicInfo['corp_type'],
  corpTypeId?: CorpBasicInfo['corp_type_id']
) => {
  try {
    return (
      Number(corpTypeId) === ECorpTypeCode.IndividualBusiness ||
      corpType === ECorpTypeCodeTitleMap[ECorpTypeCode.IndividualBusiness]
    )
  } catch (e) {
    console.error(e)
    return false
  }
}
