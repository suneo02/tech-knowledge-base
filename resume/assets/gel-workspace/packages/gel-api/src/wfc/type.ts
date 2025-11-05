import { wfcCDEApiPath } from './CDE'
import { ApiCodeForWfc } from './code'
import { wfcCorpApiPath } from './corp'
import { wfcDownloadApiPath } from './download'
import { wfcSearchApiPath } from './search'
import { wfcSuperApiPathMap } from './super'

export interface ApiPageForWFC {
  CurrentPage: number
  PageSize: number
  Records: number
  TotalPage: number
}

export interface ApiResponseForWFC<T = never> {
  Data: T
  ErrorCode: ApiCodeForWfc
  ErrorMessage: string
  status: string
  Page: ApiPageForWFC
}

export type wfcApiPathMap = wfcCDEApiPath & wfcSearchApiPath & wfcCorpApiPath & wfcSuperApiPathMap & wfcDownloadApiPath

export * from './super/type'
