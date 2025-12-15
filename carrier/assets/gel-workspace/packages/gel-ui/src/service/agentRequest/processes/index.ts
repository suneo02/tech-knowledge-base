/**
 * AI Chat Process Functions - 统一导出
 *
 * 提供统一的流程函数接口，基于 ChatRunContext 设计
 * 保持一致的上下文参数和行为模式
 */

// 导出核心处理函数
export { processAnalysis } from './processAnalysis'

export { processDataRetrieval } from './processDataRetrieval'

export { processQuestionDecomposition } from './processQuestionDecomposition'

export { processChatPreflight } from './processChatPreflight'
export type { ChatPreflightConfig } from './processChatPreflight'

export { processStreamFinalization } from './processStreamFinalization'
export type { StreamFinalizationConfig, StreamFinalizationResult } from './processStreamFinalization'

export { processChatSave } from './processChatSave'
export type { ChatSaveConfig, ChatSaveResult } from './processChatSave'

export { enrichStreamWithPostData, processEntityFetch, processTraceFetch } from './enrichStreamWithPostData'
export type { StreamPostDataFetchRes } from './enrichStreamWithPostData'
