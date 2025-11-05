import { ConfigTableCellRenderOptions } from 'gel-types'
import { ReportSimpleTableCellRenderFunc } from '../type'
import { renderBondIssueRating } from './bondIssueRating'
import { renderCreditCodePart } from './creditCodeRenderers'
import { renderDateRangeInOneFieldCustom } from './dateCustom'
import { renderHKCorpName } from './hkCorpName'
import { corpInfoIndustryGbFoldRender } from './industryGbFold'
import { renderIntegrityInformationPenaltyStatus } from './IntegrityInformationPenaltyStatus'
import { renderOverseasBusinessScope } from './overseasBusinessScope'
import { renderUsedNames } from './renderUsedNames'
import { corpInfoXXIndustryRender } from './xxIndustryRender'

export * from './bondIssueRating'
export * from './dateCustom'
export * from './hkCorpName'
export * from './industrySector'
export * from './IntegrityInformationPenaltyStatus'

export const reportTableCellCustomSimpleRenderMap: Partial<
  Record<ConfigTableCellRenderOptions['customRenderName'], ReportSimpleTableCellRenderFunc>
> = {
  bondIssueRating: renderBondIssueRating,
  creditCodePart: renderCreditCodePart,
  dateRangeInOneField: renderDateRangeInOneFieldCustom,
  integrityPenaltyStatus: renderIntegrityInformationPenaltyStatus,
  overseasBusinessScope: renderOverseasBusinessScope,
  usedNames: renderUsedNames,
  hkCorpName: renderHKCorpName,
  xxIndustry: corpInfoXXIndustryRender,
  industryGbFold: corpInfoIndustryGbFoldRender,
}
