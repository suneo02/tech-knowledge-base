/**
 * 流式输出类型定义
 * 
 * 定义流水线中流式数据传输相关的类型
 * 这些类型主要用于处理后端 SSE 流式响应和前端流式数据处理
 */

// ==================== 流式分片类型 ====================

/**
 * 流式输出的增量数据结构
 * 对应后端 StreamResponse.delta 部分
 */
export interface StreamDelta {
  /** 主要内容增量 */
  content?: string
  /** 推理内容增量 */
  reasoning_content?: string
  /** 其他扩展字段 */
  [key: string]: unknown
}

/**
 * 模型输出分片 - 基于 chat-flow-optimization-guide.md 中的 ModelChunk
 * 与后端约定的流式响应格式
 */
export interface ModelChunk<TDelta = StreamDelta, TMeta = Record<string, unknown>> {
  /** 增量数据 */
  delta?: TDelta
  /** 是否完成 */
  done?: boolean
  /** 元数据信息 */
  meta?: TMeta
  /** 扩展字段 */
  [key: string]: unknown
}

/**
 * 默认的模型分片类型
 */
export type DefaultModelChunk = ModelChunk<StreamDelta, Record<string, unknown>>

// ==================== 流式状态类型 ====================

/**
 * 流式处理状态
 */
export type StreamStatus = 
  | 'idle'        // 空闲状态
  | 'connecting'  // 连接中
  | 'streaming'   // 流式传输中
  | 'completed'   // 完成
  | 'error'       // 错误
  | 'aborted'     // 已取消

/**
 * 流式处理阶段
 * 基于 chat-flow-optimization-guide.md 中的阶段划分
 */
export type StreamPhase = 
  | 'preflight'   // 预处理阶段（建会/分析/召回/拆解）
  | 'firstToken'  // 首个 token 到达
  | 'streaming'   // 流式输出阶段
  | 'finish'      // 完成阶段

// ==================== 流式事件类型 ====================

/**
 * 流式事件数据
 */
export interface StreamEventData<TChunk = ModelChunk> {
  /** 事件类型 */
  type: 'chunk' | 'complete' | 'error' | 'abort'
  /** 分片数据 */
  chunk?: TChunk
  /** 错误信息 */
  error?: Error
  /** 时间戳 */
  timestamp: number
  /** 流式处理阶段 */
  phase: StreamPhase
}

/**
 * 流式处理回调函数类型
 */
export interface StreamCallbacks<TChunk = ModelChunk> {
  /** 接收到分片数据时的回调 */
  onChunk?: (chunk: TChunk) => void
  /** 流式处理完成时的回调 */
  onComplete?: (chunks: TChunk[]) => void
  /** 发生错误时的回调 */
  onError?: (error: Error) => void
  /** 流式处理被取消时的回调 */
  onAbort?: () => void
  /** 状态变化时的回调 */
  onStatusChange?: (status: StreamStatus, phase: StreamPhase) => void
}

// ==================== 流式配置类型 ====================

/**
 * 流式处理配置
 */
export interface StreamConfig {
  /** 是否启用流式输出 */
  enabled?: boolean
  /** 分片合并延迟（毫秒） */
  mergeDelay?: number
  /** 最大重试次数 */
  maxRetries?: number
  /** 超时时间（毫秒） */
  timeout?: number
  /** 缓冲区大小 */
  bufferSize?: number
}

// ==================== 流式处理器接口 ====================

/**
 * 流式数据处理器接口
 */
export interface StreamProcessor<TInput = unknown, TChunk = ModelChunk, TOutput = unknown> {
  /** 处理器名称 */
  name: string
  /** 处理输入数据 */
  process: (input: TInput, callbacks: StreamCallbacks<TChunk>) => Promise<TOutput>
  /** 取消处理 */
  abort: () => void
  /** 获取当前状态 */
  getStatus: () => StreamStatus
  /** 获取当前阶段 */
  getPhase: () => StreamPhase
}

// 帧合并和版本守卫相关类型已移除，简化架构

// ==================== 流水线转换函数类型 ====================

/**
 * 输出类型（流式分片）
 * @template TOutput - 具体的输出类型，必须继承 ModelChunk
 */
export type StreamOutput<TOutput extends ModelChunk = ModelChunk> = TOutput

/**
 * 通用转换函数类型
 * @template TInput - 输入类型
 * @template TOutput - 输出类型
 */
export type TransformFunction<TInput, TOutput> = (input: TInput) => TOutput | Promise<TOutput>

/**
 * 通用验证函数类型
 * @template T - 验证的数据类型
 */
export type ValidateFunction<T> = (data: T) => boolean | Promise<boolean>

/**
 * 通用过滤函数类型
 * @template T - 过滤的数据类型
 */
export type FilterFunction<T> = (item: T, index: number, array: T[]) => boolean

// ==================== 工具类型 ====================

/**
 * 流式数据累积器
 */
export type StreamAccumulator<TChunk, TResult> = (
  accumulated: TResult | undefined,
  chunk: TChunk,
  phase: StreamPhase
) => TResult

/**
 * 流式数据转换器
 */
export type StreamTransformer<TInput, TOutput> = (
  input: TInput,
  phase: StreamPhase
) => TOutput

/**
 * 流式数据过滤器
 */
export type StreamFilter<TChunk> = (
  chunk: TChunk,
  phase: StreamPhase
) => boolean
