import { wfcCDEApiPath } from './CDE'
import { wfcCorpApiPath } from './corp'
import { wfcDownloadApiPath } from './download'
import { wfcSearchApiPath } from './search'
import { wfcSuperApiPathMap } from './super'
import { wfcSuperAgentApiPathMap } from './superAgent'

// Re-export base types
export * from './super'
export * from './superAgent'

export type wfcApiPathMap = wfcCDEApiPath &
  wfcSearchApiPath &
  wfcCorpApiPath &
  wfcSuperApiPathMap &
  wfcSuperAgentApiPathMap &
  wfcDownloadApiPath
