// 导出所有领域
export * from './domains/sheet'
export * from './domains/subscription'
export * from './shared'

// 导入领域 API 映射
import { SheetApiPathMap } from './domains/sheet/api'
import { SubscriptionApiPathMap } from './domains/subscription/api'

/**
 * WFC Super 模块 API 路径映射
 * 使用分层聚合模式，组合各个领域的 API 映射
 */
export interface wfcSuperApiPathMap extends SheetApiPathMap, SubscriptionApiPathMap {}
