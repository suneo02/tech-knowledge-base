import { AxiosRequestConfig } from 'axios'
import { wfcCDEApiCfg } from './CDE'
import { wfcDownloadApiCfg } from './download'
import { wfcSearchApiCfg } from './search'
import { wfcApiPathMap } from './type'

export * from './CDE'
export * from './code'
export * from './config'
export * from './corp'
export * from './search'
export * from './super'
export * from './type'

export const wfcApiCfg: Partial<Record<keyof wfcApiPathMap, AxiosRequestConfig>> = {
  ...wfcCDEApiCfg,
  ...wfcSearchApiCfg,
  ...wfcDownloadApiCfg,
}
