import { validateReportDetailNodeOrNodesJson } from '@/validation'
import { ReportDetailNodeOrNodesJson } from 'gel-types'
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

export const corpABSInfo: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpABSInfoJson)

export const corpBondIssue: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpBondIssueJson)

export const corpChattelFinancing: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpChattelFinancingJson)

export const corpChattelMortgageMortgager: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(
  corpChattelMortgageMortgagerJson
)

export const corpChattelMortgageMortgagee: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(
  corpChattelMortgageMortgageeJson
)

export const corpDebtRating: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpDebtRatingJson)

export const corpInfoAwaitListing: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpInfoAwaitListingJson)

export const corpSharedStock: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpSharedStockJson)

export const corpInvestAgency: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpInvestAgencyJson)

export const corpInvestEvent: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpInvestEventJson)

export const corpPEVCFinance: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpPEVCFinanceJson)

export const corpPEVCQuit: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpPEVCQuitJson)

export const corpMergeInfo: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpMergeInfoJson)

export const corpBankCredit: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpBankCreditJson)
