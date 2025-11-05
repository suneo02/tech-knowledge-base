import { ChatApiPaths } from './chat.ts'
import type { CompanyApiPaths } from './company'
import type { GroupApiPaths } from './group'
import { HomePageApiPaths } from './home.ts'
import { ReportApiPaths } from './report'
import type { SearchApiPaths } from './search'
import type { IcLayoutApiPaths } from './icLayout'
import type { FeturedApiPaths } from './fetured'
import type { SearchBidApiPaths } from './searchBid'

// 合并所有API路径
export type ApiPaths = SearchApiPaths &
  CompanyApiPaths &
  GroupApiPaths &
  ReportApiPaths &
  ChatApiPaths &
  HomePageApiPaths &
  IcLayoutApiPaths &
  FeturedApiPaths &
  SearchBidApiPaths

// 获取API路径 看似无用，实际用来推导url
export const getApiPathsUrl = <T extends keyof ApiPaths>(url: T) => url

// 导出各模块的API路径
export * from './company'
export * from './group'
export * from './report'
export * from './search'
export * from './icLayout'
export * from './fetured'
