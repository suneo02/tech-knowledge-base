import { validateReportDetailTableJson } from '@/validation'
import { ReportDetailTableJson } from 'gel-types'
import corpShareholderInfomationEnglandJson from './England/shareholderInfomation.json' assert { type: 'json' }
import corpShareholderInfomationIndianJson from './indRowConfig.json' assert { type: 'json' }
import corpShareholderInfomationThailandJson from './thaRowConfig.json' assert { type: 'json' }

export const corpShareholderInfomationEngland: ReportDetailTableJson = validateReportDetailTableJson(
  corpShareholderInfomationEnglandJson
)

export const corpShareholderInfomationIndian: ReportDetailTableJson = validateReportDetailTableJson(
  corpShareholderInfomationIndianJson
)
export const corpShareholderInfomationThailand: ReportDetailTableJson = validateReportDetailTableJson(
  corpShareholderInfomationThailandJson
)
