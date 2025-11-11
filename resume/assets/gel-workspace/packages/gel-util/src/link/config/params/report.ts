import { LinkModule } from '../linkModule'
import { CommonLinkParams } from './common'

export interface RPLinkParams {
  [LinkModule.DDRP_PREVIEW]: {
    companyCode: string
  } & CommonLinkParams
  [LinkModule.DDRP_PRINT]: {
    companyCode: string
    setting?: string
  } & CommonLinkParams
  [LinkModule.CREDIT_RP_PREVIEW]: {
    companyCode: string
  } & CommonLinkParams
  [LinkModule.CREDIT_RP_PRINT]: {
    companyCode: string
    setting?: string
  } & CommonLinkParams
}

export interface AIReportLinkParams {
  [LinkModule.AI_REPORT_OUTLINE_CHAT]: {
    chatId: string
  }
  [LinkModule.AI_REPORT_DETAIL]: {
    reportId: string
  }
}
