import { validateReportDetailNodeOrNodesJson } from '@/validation'
import { ReportDetailNodeOrNodesJson } from 'gel-types'
import corpAppraisalJson from './Appraisal.json' assert { type: 'json' }
import corpBankruptcyReorganizationJson from './BankruptcyReorganization.json' assert { type: 'json' }
import corpCourtNoticeJson from './CourtNotice.json' assert { type: 'json' }
import corpCreditDishonestJson from './CreditDishonest.json' assert { type: 'json' }
import corpDeliveryAnnouncementJson from './DeliveryAnnouncement.json' assert { type: 'json' }
import corpEndCaseJson from './EndCase.json' assert { type: 'json' }
import corpEnforcementJson from './Enforcement.json' assert { type: 'json' }
import corpFilingInfoJson from './FilingInfo.json' assert { type: 'json' }
import corpJudicialAuctionJson from './JudicialAuction.json' assert { type: 'json' }
import corpJudicialDocumentJson from './JudicialDocument.json' assert { type: 'json' }
import corpLimitHighConsumptionJson from './LimitHighConsumption.json' assert { type: 'json' }
import corpTrialNoticeJson from './TrialNotice.json' assert { type: 'json' }

export const corpAppraisal: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpAppraisalJson)
export const corpBankruptcyReorganization: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(
  corpBankruptcyReorganizationJson
)
export const corpCourtNotice: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpCourtNoticeJson)

export const corpCreditDishonest: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpCreditDishonestJson)

export const corpDeliveryAnnouncement: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpDeliveryAnnouncementJson)

export const corpEndCase: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpEndCaseJson)

export const corpEnforcement: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpEnforcementJson)

export const corpFilingInfo: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpFilingInfoJson)

export const corpJudicialDocument: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpJudicialDocumentJson)

export const corpLimitHighConsumption: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpLimitHighConsumptionJson)

export const corpTrialNotice: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpTrialNoticeJson)

export const corpJudicialAuction: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpJudicialAuctionJson)
