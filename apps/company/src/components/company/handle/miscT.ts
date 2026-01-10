import { CorpBasicInfo } from '@/api/corp/info/basicInfo.ts'
import intl from '@/utils/intl'
import { getIfIndividualBusiness } from '../../../handle/corp/corpType'

export const getLegalPersonField = (
  corpType: CorpBasicInfo['corp_type'],
  corpTypeId?: CorpBasicInfo['corp_type_id']
) => {
  if (getIfIndividualBusiness(corpType, corpTypeId)) {
    return intl(406833, '经营者')
  }
  if (!(corpType === '有限合伙企业' || corpType === '普通合伙企业' || corpType === '特殊普通合伙企业')) {
    return intl('451206', '法定代表人')
  }
  if (window.en_access_config) {
    return 'Managing Partner'
  } else {
    return intl('410935', '执行事务合伙人')
  }
}
