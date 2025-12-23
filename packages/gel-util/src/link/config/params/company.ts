import { LinkModule } from '../linkModule'
import { CommonLinkParams, EIsSeparate } from './common'

export interface CompanyParams {
  [LinkModule.CDE_SEARCH]: {
    type?: string
    val?: string
  } & CommonLinkParams

  [LinkModule.GROUP]: {
    id: string
  } & CommonLinkParams

  [LinkModule.FEATURED_COMPANY]: {
    id: string
  } & CommonLinkParams

  [LinkModule.COMPANY_DETAIL]: {
    companycode: string
    isSeparate?: EIsSeparate
  } & CommonLinkParams
  [LinkModule.WINDCODE_2_F9]: {
    windcode: string
  } & CommonLinkParams
  [LinkModule.COMPANY_DYNAMIC]: {
    keyMenu?: number
  } & CommonLinkParams
  [LinkModule.SUPER_DOWNLOAD]: {
    folder?: 'downloads' // 文件夹名称（默认下载全部，后续会添加对应的文件夹名称）
  } & CommonLinkParams
}
