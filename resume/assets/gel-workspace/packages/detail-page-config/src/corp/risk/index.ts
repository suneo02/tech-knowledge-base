import { validateReportDetailNodeJson } from '@/validation'
import { ReportDetailNodeJson } from 'gel-types'
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

export const corpAppraisal: ReportDetailNodeJson = validateReportDetailNodeJson(corpAppraisalJson)
export const corpBankruptcyReorganization: ReportDetailNodeJson = validateReportDetailNodeJson(
  corpBankruptcyReorganizationJson
)
export const corpCourtNotice: ReportDetailNodeJson = validateReportDetailNodeJson(corpCourtNoticeJson)

export const corpCreditDishonest: ReportDetailNodeJson = validateReportDetailNodeJson(corpCreditDishonestJson)

export const corpDeliveryAnnouncement: ReportDetailNodeJson = validateReportDetailNodeJson(corpDeliveryAnnouncementJson)

export const corpEndCase: ReportDetailNodeJson = validateReportDetailNodeJson(corpEndCaseJson)

export const corpEnforcement: ReportDetailNodeJson = validateReportDetailNodeJson(corpEnforcementJson)

export const corpFilingInfo: ReportDetailNodeJson = validateReportDetailNodeJson(corpFilingInfoJson)

export const corpJudicialDocument: ReportDetailNodeJson = validateReportDetailNodeJson(corpJudicialDocumentJson)

export const corpLimitHighConsumption: ReportDetailNodeJson = validateReportDetailNodeJson(corpLimitHighConsumptionJson)

export const corpTrialNotice: ReportDetailNodeJson = validateReportDetailNodeJson(corpTrialNoticeJson)

export const corpJudicialAuction: ReportDetailNodeJson = validateReportDetailNodeJson(corpJudicialAuctionJson)
