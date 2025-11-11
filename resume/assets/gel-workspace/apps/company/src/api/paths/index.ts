import type { SearchBidApiPaths } from './bid/searchBid.ts'
import { ChatApiPaths } from './chat.ts'
import type { CompanyApiPaths } from './corp/index.ts'
import type { FeturedApiPaths } from './fetured'
import type { GroupApiPaths } from './group'
import { HomePageApiPaths } from './home.ts'
import type { IcLayoutApiPaths } from './icLayout'
import { PatentApiPaths } from './patent/index.ts'
import { ReportApiPaths } from './report'
import type { SearchApiPaths } from './search'

// 合并所有API路径
export type ApiPaths = SearchApiPaths &
  CompanyApiPaths &
  GroupApiPaths &
  ReportApiPaths &
  ChatApiPaths &
  HomePageApiPaths &
  IcLayoutApiPaths &
  FeturedApiPaths &
  SearchBidApiPaths &
  PatentApiPaths

// 获取API路径 看似无用，实际用来推导url
export const getApiPathsUrl = <T extends keyof ApiPaths>(url: T) => url

// 导出各模块的API路径
export * from './corp'
export * from './fetured'
export * from './group'
export * from './icLayout'
export * from './report'
export * from './search'
