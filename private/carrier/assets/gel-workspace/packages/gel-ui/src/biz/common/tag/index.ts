export { TagsModule } from 'gel-util/biz'
export {
  ActCtrlTag,
  ActualControllerGroupTag,
  BeneficiaryTag,
  BidTypeTag,
  ChangeNameTag,
  RelatedPartyTag,
  TenderWinnerTag,
} from './common'
export { CorpDetailDynamicEventTypeTag, CorpDetailPublicSentimentTag } from './DynamicEventTypeTag'

export { CorpIndustryTag } from './CorpIndustryTag'
export { FinancingStatusTag } from './FinancingStatusTag'
export { FundTag } from './FundTag'
export { CorpTagInDetail, CorpTagInSearch } from './CorpTag'
export { TagWithModule, useTagConfigByModule } from './TagWithModule'
export type { TagWithModuleProps } from './TagWithModule'
export { getCompanyStateColor } from './utils'
