import { validateReportDetailTableJson } from '@/validation'
import { ReportDetailTableJson } from 'gel-types'
import corpPatentBranchJson from './patent/patentBranch.json' assert { type: 'json' }
import corpPatentHoldCompanyJson from './patent/patentHoldCompany.json' assert { type: 'json' }
import corpPatentOutboundInvestmentJson from './patent/patentOutboundInvestment.json' assert { type: 'json' }
import corpPatentSelfJson from './patent/patentSelf.json' assert { type: 'json' }
import corpSoftwareCopyrightJson from './SoftwareCopyright.json' assert { type: 'json' }
import corpTrademarkBranchJson from './trademark/trademarkBranch.json' assert { type: 'json' }
import corpTrademarkHoldCompanyJson from './trademark/trademarkHoldCompany.json' assert { type: 'json' }
import corpTrademarkOutboundInvestJson from './trademark/trademarkOutboundInvest.json' assert { type: 'json' }
import corpTrademarkSelfJson from './trademark/trademarkSelf.json' assert { type: 'json' }

export const corpSoftwareCopyright: ReportDetailTableJson = validateReportDetailTableJson(corpSoftwareCopyrightJson)
export const corpPatentSelf: ReportDetailTableJson = validateReportDetailTableJson(corpPatentSelfJson)
export const corpTrademarkSelf: ReportDetailTableJson = validateReportDetailTableJson(corpTrademarkSelfJson)
export const corpPatentHoldCompany: ReportDetailTableJson = validateReportDetailTableJson(corpPatentHoldCompanyJson)
export const corpPatentBranch: ReportDetailTableJson = validateReportDetailTableJson(corpPatentBranchJson)
export const corpPatentOutboundInvestment: ReportDetailTableJson = validateReportDetailTableJson(
  corpPatentOutboundInvestmentJson
)
export const corpTrademarkHoldCompany: ReportDetailTableJson =
  validateReportDetailTableJson(corpTrademarkHoldCompanyJson)
export const corpTrademarkOutboundInvest: ReportDetailTableJson = validateReportDetailTableJson(
  corpTrademarkOutboundInvestJson
)
export const corpTrademarkBranch: ReportDetailTableJson = validateReportDetailTableJson(corpTrademarkBranchJson)
