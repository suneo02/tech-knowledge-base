// 导出基础与领域
export * from './domains/task'
export * from './shared'

// 导入领域 API 映射
import { SuperAgentTaskApiPathMap } from './domains/task/api'

/**
 * WFC SuperAgent 模块 API 路径映射
 * 使用分层聚合模式，组合各个领域的 API 映射
 */
export type wfcSuperAgentApiPathMap = SuperAgentTaskApiPathMap
