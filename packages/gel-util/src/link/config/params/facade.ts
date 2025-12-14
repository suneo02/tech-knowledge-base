import { ChatParams } from './chat'
import { CompanyParams } from './company'
import { KGLinkParams } from './kg'
import { AIReportLinkParams, RPLinkParams } from './report'
import { SearchLinkParams } from './search'
import { UserLinkParams } from './user'

export type LinkParams = KGLinkParams &
  UserLinkParams &
  CompanyParams &
  RPLinkParams &
  ChatParams &
  AIReportLinkParams &
  SearchLinkParams
