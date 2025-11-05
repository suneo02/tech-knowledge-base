import { validateReportDetailNodeJson } from '@/validation'
import { ReportDetailNodeJson } from 'gel-types'
import corpABSInfoJson from './ABSInfo.json' assert { type: 'json' }
import corpBankCreditJson from './BankCredit.json' assert { type: 'json' }
import corpBondIssueJson from './BondIssue.json' assert { type: 'json' }
import corpChattelFinancingJson from './ChattelFinancing.json' assert { type: 'json' }
import corpChattelMortgageMortgageeJson from './ChattelMortgageMortgagee.json' assert { type: 'json' }
import corpChattelMortgageMortgagerJson from './ChattelMortgageMortgager.json' assert { type: 'json' }
import corpDebtRatingJson from './DebtRating.json' assert { type: 'json' }
import corpInfoAwaitListingJson from './InfoAwaitListing.json' assert { type: 'json' }
import corpInvestAgencyJson from './InvestAgency.json' assert { type: 'json' }
import corpInvestEventJson from './InvestEvent.json' assert { type: 'json' }
import corpMergeInfoJson from './MergeInfo.json' assert { type: 'json' }
import corpPEVCFinanceJson from './PEVCFinance.json' assert { type: 'json' }
import corpPEVCQuitJson from './PEVCQuit.json' assert { type: 'json' }
import corpSharedStockJson from './SharedStock.json' assert { type: 'json' }

export const corpABSInfo: ReportDetailNodeJson = validateReportDetailNodeJson(corpABSInfoJson)

export const corpBondIssue: ReportDetailNodeJson = validateReportDetailNodeJson(corpBondIssueJson)

export const corpChattelFinancing: ReportDetailNodeJson = validateReportDetailNodeJson(corpChattelFinancingJson)

export const corpChattelMortgageMortgager: ReportDetailNodeJson = validateReportDetailNodeJson(
  corpChattelMortgageMortgagerJson
)

export const corpChattelMortgageMortgagee: ReportDetailNodeJson = validateReportDetailNodeJson(
  corpChattelMortgageMortgageeJson
)

export const corpDebtRating: ReportDetailNodeJson = validateReportDetailNodeJson(corpDebtRatingJson)

export const corpInfoAwaitListing: ReportDetailNodeJson = validateReportDetailNodeJson(corpInfoAwaitListingJson)

export const corpSharedStock: ReportDetailNodeJson = validateReportDetailNodeJson(corpSharedStockJson)

export const corpInvestAgency: ReportDetailNodeJson = validateReportDetailNodeJson(corpInvestAgencyJson)

export const corpInvestEvent: ReportDetailNodeJson = validateReportDetailNodeJson(corpInvestEventJson)

export const corpPEVCFinance: ReportDetailNodeJson = validateReportDetailNodeJson(corpPEVCFinanceJson)

export const corpPEVCQuit: ReportDetailNodeJson = validateReportDetailNodeJson(corpPEVCQuitJson)

export const corpMergeInfo: ReportDetailNodeJson = validateReportDetailNodeJson(corpMergeInfoJson)

export const corpBankCredit: ReportDetailNodeJson = validateReportDetailNodeJson(corpBankCreditJson)
