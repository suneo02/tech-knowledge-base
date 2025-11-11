// ==================== 核心类型导出 ====================
export type { ChatStaticConfig, RuntimeState } from './types'

// ==================== 运行上下文类和工具函数 ====================
export { ChatRunContext, createChatRunContext } from './runContext'

// ==================== 事件系统 ====================
export { ChatProcessEventBusImpl, createEventBus } from './events'
export type { ChatProcessEventBus, ProcessEventHandler, ProcessEventKey, ProcessEventMap } from './events'

// ==================== 统一处理器 ====================
export {
  clearTimeoutTimer,
  createXAgentRequest,
  handleStreamAbort,
  processPreprocessing,
  processStreamRequest,
  reportAnalytics,
  resetTimeout,
} from './unified-handler'
export type { ProcessFunction, StreamAbortFunction, StreamDependencies, TimeoutResetFunction } from './unified-handler'

// ==================== 流程处理函数 ====================
export {
  enrichStreamWithPostData,
  processAnalysis,
  processChatPreflight,
  processChatSave,
  processDataRetrieval,
  processEntityFetch,
  processQuestionDecomposition,
  processStreamFinalization,
  processTraceFetch,
} from './processes'
export type {
  ChatPreflightConfig,
  ChatSaveConfig,
  ChatSaveResult,
  StreamFinalizationConfig,
  StreamFinalizationResult,
  StreamPostDataFetchRes,
} from './processes'

// ==================== 日志系统 ====================
export { ChatLogLevel, registerProcessLogListeners } from './logger'

export {
  createAgentAIMsgStream,
  createAgentMsgAIDataRetrieval,
  createAgentMsgAIInitBySendInput,
  createAgentMsgAISubQuestion,
  type CreateHandleError,
} from './helper'
