import { HorizontalTableColumns } from '../windui'
import { CorpBasicInfo } from './BussInfo'
export * from './BaseInfo'
export * from './basicNum'
export * from './buss'
export * from './BussInfo'
export * from './dynamic'
export * from './finance'
export * from './intellectual'
export * from './module'
export type { ShareRateIdentifier, ShareRouteDetail } from './shareholder'

export type CorpInfoTableCol = HorizontalTableColumns<CorpBasicInfo>
