import { LinkModule } from '../linkModule'
import { CommonLinkParams } from './common'

export interface CompanyParams {
  [LinkModule.COMPANY_DETAIL]: {
    companycode: string
  } & CommonLinkParams
  [LinkModule.WINDCODE_2_F9]: {
    windcode: string
  } & CommonLinkParams
}
