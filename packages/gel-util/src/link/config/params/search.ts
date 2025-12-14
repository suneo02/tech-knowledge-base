import { LinkModule } from '../linkModule'
import { CommonLinkParams } from './common'

export interface SearchLinkParams {
  [LinkModule.SEARCH]: {
    keyword: string
  } & CommonLinkParams
}
