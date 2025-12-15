/**
 * 基于 EventBus 的外部日志系统
 *
 * 提供完全外部化的日志控制能力，支持：
 * - 多级日志控制（DEBUG/INFO/WARN/ERROR/NONE）
 * - 流程粒度控制（白名单/黑名单）
 * - 自定义格式化和输出
 * - 环境适配和性能监控
 */

import { ChatProcessEventBus, ProcessEventHandler, ProcessEventKey } from './events'

// ==================== 日志级别和配置 ====================

/**
 * 日志级别枚举
 */
export enum ChatLogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * 日志配置接口
 */
export interface LogConfig {
  /** 全局日志级别 */
  level: ChatLogLevel
  /** 是否启用特定流程的日志 */
  enabledProcesses?: string[]
  /** 是否禁用特定流程的日志 */
  disabledProcesses?: string[]
  /** 自定义日志格式化函数 */
  formatter?: (level: string, process: string, message: string, data?: any) => string
  /** 自定义日志输出函数 */
  output?: (formattedMessage: string, level: ChatLogLevel, process: string) => void
}

// ==================== 默认实现 ====================

/**
 * 默认日志格式化函数
 */
const defaultFormatter = (level: string, process: string, message: string, data?: any): string => {
  const timestamp = new Date().toISOString()
  const baseMessage = `[${timestamp}] [${level.toUpperCase()}] [${process}] ${message}`
  return data ? `${baseMessage} ${JSON.stringify(data)}` : baseMessage
}

/**
 * 默认日志输出函数
 */
const defaultOutput = (formattedMessage: string, level: ChatLogLevel): void => {
  switch (level) {
    case ChatLogLevel.DEBUG:
      console.debug(formattedMessage)
      break
    case ChatLogLevel.INFO:
      console.info(formattedMessage)
      break
    case ChatLogLevel.WARN:
      console.warn(formattedMessage)
      break
    case ChatLogLevel.ERROR:
      console.error(formattedMessage)
      break
  }
}

// ==================== 核心日志监听器 ====================

/**
 * 注册标准化的流程日志监听器
 *
 * 该函数会在 EventBus 上注册一套完整的日志监听器，
 * 监听所有流程的 start/success/error 事件并按配置输出日志
 *
 * @param eventBus - ChatProcessEventBus 实例
 * @param config - 日志配置
 * @returns 清理函数，用于取消所有日志监听
 */
export function registerProcessLogListeners(
  eventBus: ChatProcessEventBus,
  config: LogConfig = { level: ChatLogLevel.INFO }
): () => void {
  const {
    level = ChatLogLevel.INFO,
    enabledProcesses,
    disabledProcesses,
    formatter = defaultFormatter,
    output = defaultOutput,
  } = config

  // 存储所有注册的监听器，便于清理
  const registeredHandlers: Array<{ event: ProcessEventKey; handler: Function }> = []

  /**
   * 检查是否应该记录特定流程的日志
   */
  const shouldLog = (processName: string, logLevel: ChatLogLevel): boolean => {
    // 检查日志级别
    if (logLevel < level) return false

    // 检查流程白名单/黑名单
    if (enabledProcesses && !enabledProcesses.includes(processName)) return false
    if (disabledProcesses && disabledProcesses.includes(processName)) return false

    return true
  }

  /**
   * 通用日志记录函数
   */
  const log = (logLevel: ChatLogLevel, process: string, message: string, data?: any) => {
    if (!shouldLog(process, logLevel)) return

    try {
      const levelName = ChatLogLevel[logLevel].toLowerCase()
      const formattedMessage = formatter(levelName, process, message, data)
      output(formattedMessage, logLevel, process)
    } catch (error) {
      console.error('Logger formatting/output failed:', error)
    }
  }

  /**
   * 注册监听器的辅助函数
   */
  const registerHandler = <K extends ProcessEventKey>(event: K, handler: ProcessEventHandler<any, K>) => {
    eventBus.on(event, handler)
    registeredHandlers.push({ event, handler: handler as Function })
  }

  // ==================== 注册各流程的日志监听器 ====================

  // Analysis 流程
  registerHandler('analysis:start', ({ message, chatId }) => {
    log(ChatLogLevel.INFO, 'analysis', 'Starting analysis processing', { chatId, messagePreview: message.slice(0, 50) })
  })

  registerHandler('analysis:success', ({ runtime }) => {
    log(ChatLogLevel.INFO, 'analysis', 'Analysis processing completed', {
      rawSentenceID: runtime?.rawSentenceID,
      chatId: runtime?.chatId,
    })
  })

  registerHandler('analysis:error', ({ error }) => {
    log(ChatLogLevel.ERROR, 'analysis', 'Analysis processing failed', {
      error: error.message,
      stack: error.stack,
    })
  })

  // Data Retrieval 流程
  registerHandler('dataRetrieval:start', ({ chatId, rawSentenceID }) => {
    log(ChatLogLevel.INFO, 'dataRetrieval', 'Starting data retrieval processing', { chatId, rawSentenceID })
  })

  registerHandler('dataRetrieval:success', () => {
    log(ChatLogLevel.INFO, 'dataRetrieval', 'Data retrieval processing completed')
  })

  registerHandler('dataRetrieval:error', ({ error }) => {
    log(ChatLogLevel.WARN, 'dataRetrieval', 'Data retrieval failed, but continuing execution', {
      error: error.message,
    })
  })

  // Question Decomposition 流程
  registerHandler('questionDecomposition:start', ({ rawSentenceID }) => {
    log(ChatLogLevel.INFO, 'questionDecomposition', 'Starting question decomposition processing', { rawSentenceID })
  })

  registerHandler('questionDecomposition:success', (result) => {
    log(ChatLogLevel.INFO, 'questionDecomposition', 'Question decomposition processing completed', result)
  })

  registerHandler('questionDecomposition:error', ({ error }) => {
    log(ChatLogLevel.WARN, 'questionDecomposition', 'Question decomposition failed, but continuing execution', {
      error: error.message,
    })
  })

  registerHandler('question:received', ({ questions }) => {
    log(ChatLogLevel.INFO, 'questionDecomposition', 'Received decomposed questions', {
      questionCount: questions.length,
      questions: questions.slice(0, 3), // 只记录前3个问题，避免日志过长
    })
  })

  // Stream Finalization 流程
  registerHandler('streamFinalization:start', ({ rawSentenceID, chatId, questionStatus }) => {
    log(ChatLogLevel.INFO, 'streamFinalization', 'Starting stream finalization processing', {
      rawSentenceID,
      chatId,
      questionStatus,
    })
  })

  registerHandler('streamFinalization:success', ({ formattedContent, entities, traces }) => {
    log(ChatLogLevel.INFO, 'streamFinalization', 'Stream finalization processing completed', {
      contentLength: formattedContent?.length || 0,
      entityCount: entities?.length || 0,
      tracesInfo: traces ? 'available' : 'none',
    })
  })

  registerHandler('streamFinalization:error', ({ error }) => {
    log(ChatLogLevel.ERROR, 'streamFinalization', 'Stream finalization processing failed', {
      error: error.message,
    })
  })

  // Chat Save 流程
  registerHandler('chatSave:start', ({ chatId, rawSentenceID }) => {
    log(ChatLogLevel.INFO, 'chatSave', 'Starting chat save processing', {
      chatId,
      rawSentenceID,
    })
  })

  registerHandler('chatSave:success', ({ success, chatId, rawSentenceID }) => {
    if (success) {
      log(ChatLogLevel.INFO, 'chatSave', 'Chat save processing completed successfully', { chatId, rawSentenceID })
    } else {
      log(ChatLogLevel.WARN, 'chatSave', 'Chat save failed, but continuing execution', { chatId, rawSentenceID })
    }
  })

  registerHandler('chatSave:error', ({ error }) => {
    log(ChatLogLevel.WARN, 'chatSave', 'Chat save failed, but continuing execution', {
      error: error.message,
    })
  })

  // Data Fetch 流程
  registerHandler('dataFetch:start', ({ rawSentenceID }) => {
    log(ChatLogLevel.INFO, 'dataFetch', 'Starting stream data fetch processing', { rawSentenceID })
  })

  registerHandler('dataFetch:success', ({ success, traceCount, entityCount }) => {
    log(ChatLogLevel.INFO, 'dataFetch', 'Stream data fetch processing completed', {
      success,
      traceCount,
      entityCount,
    })
  })

  registerHandler('dataFetch:error', ({ error }) => {
    log(ChatLogLevel.ERROR, 'dataFetch', 'Stream data fetch processing failed', {
      error: error.message,
    })
  })

  // Trace Fetch 流程
  registerHandler('traceFetch:start', ({ rawSentenceID }) => {
    log(ChatLogLevel.INFO, 'traceFetch', 'Starting trace fetch processing', { rawSentenceID })
  })

  registerHandler('traceFetch:success', ({ count }) => {
    log(ChatLogLevel.INFO, 'traceFetch', 'Trace fetch processing completed successfully', {
      traceCount: count,
    })
  })

  registerHandler('traceFetch:error', ({ error }) => {
    log(ChatLogLevel.WARN, 'traceFetch', 'Trace fetch failed, returning empty array', {
      error: error.message,
    })
  })

  // Entity Fetch 流程
  registerHandler('entityFetch:start', ({ rawSentenceID }) => {
    log(ChatLogLevel.INFO, 'entityFetch', 'Starting entity fetch processing', { rawSentenceID })
  })

  registerHandler('entityFetch:success', ({ count }) => {
    log(ChatLogLevel.INFO, 'entityFetch', 'Entity fetch processing completed successfully', {
      entityCount: count,
    })
  })

  registerHandler('entityFetch:error', ({ error }) => {
    log(ChatLogLevel.WARN, 'entityFetch', 'Entity fetch failed, returning empty array', {
      error: error.message,
    })
  })

  // 通用错误处理
  registerHandler('error', ({ error, phase }) => {
    log(ChatLogLevel.ERROR, phase, `${phase} phase error`, {
      error: error.message,
      stack: error.stack,
    })
  })

  // 流程完成
  registerHandler('complete', (result) => {
    log(ChatLogLevel.INFO, 'process', 'All processing completed', result)
  })

  // 返回清理函数
  return () => {
    registeredHandlers.forEach(({ event, handler }) => {
      eventBus.off(event, handler as any)
    })
    registeredHandlers.length = 0
  }
}

// ==================== 便捷工厂函数 ====================

/**
 * 创建开发环境日志监听器
 */
export function createDevelopmentLogger(eventBus: ChatProcessEventBus) {
  return registerProcessLogListeners(eventBus, {
    level: ChatLogLevel.DEBUG,
    formatter: (level, process, message, data) => {
      const timestamp = new Date().toLocaleString()
      const prefix = `🔧 [DEV] [${timestamp}] [${level.toUpperCase()}] [${process}]`
      return data ? `${prefix} ${message}\n    Data: ${JSON.stringify(data, null, 2)}` : `${prefix} ${message}`
    },
  })
}

/**
 * 创建生产环境日志监听器
 */
export function createProductionLogger(eventBus: ChatProcessEventBus) {
  return registerProcessLogListeners(eventBus, {
    level: ChatLogLevel.WARN,
    disabledProcesses: ['dataRetrieval', 'traceFetch', 'entityFetch'], // 禁用非关键流程日志
    formatter: (level, process, message, data) => {
      const timestamp = Date.now()
      return JSON.stringify({
        timestamp,
        level: level.toUpperCase(),
        process,
        message,
        data: data || undefined,
      })
    },
  })
}

/**
 * 创建特定流程监控日志监听器
 */
export function createProcessSpecificLogger(eventBus: ChatProcessEventBus, processes: string[]) {
  return registerProcessLogListeners(eventBus, {
    level: ChatLogLevel.INFO,
    enabledProcesses: processes, // 只监控指定流程
    formatter: (_level, process, message, data) => {
      return `📊 [${process.toUpperCase()}] ${message} ${data ? JSON.stringify(data) : ''}`
    },
  })
}
