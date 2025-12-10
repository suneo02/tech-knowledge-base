/**
 * AI 对话核心类型系统 - 基于优化类型架构
 *
 * 设计原则：
 * 1. 完全基于 ai-chat-perf 优化类型系统
 * 2. 泛型优先，支持模块自定义扩展
 * 3. 强类型约束，避免 any 类型
 * 4. 清晰的职责分离和接口边界
 */

import { AxiosInstance } from 'axios'
import {
  ChatChatIdIdentifier,
  ChatDPUResponse,
  ChatEntityRecognize,
  ChatModelTypeIdentifier,
  ChatRAGResponse,
  ChatRawSentenceIdIdentifier,
  GelData,
  ReportChatData,
  SplTable,
} from 'gel-api'
// 注意：LoggerInterface 已废弃，请使用新的 EventBus 日志系统

// ==================== 核心状态和错误类型 ====================

// ==================== 核心上下文接口 ====================

/**
 * 运行上下文接口 - 专注于 ChatSendInput → ModelChunk 转换过程
 *
 * 设计说明：在三段式架构中，Transport + Middleware 层只处理输入到模型分片的转换
 * AgentMessage 和 ParsedMessage 的处理由 useXChat 层负责
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @template TContext - 输入上下文类型，默认为 ChatInputContext
 * @template TChunk - 模型分片类型，默认为 ModelChunk
 */

/**
 * 静态配置 - 所有会话共享，不可修改
 */
export interface ChatStaticConfig {
  /** HTTP 客户端实例 */
  axiosInstance: AxiosInstance
  /** HTTP 埋点客户端实例 */
  axiosEntWeb: AxiosInstance
  /** 是否 dev 模式 */
  isDev: boolean
  /** getUserQuestion 间隔时间 */
  getUserQuestionInterval?: number
}
/**
 * 运行时状态 - 执行过程中变化
 *
 * ⚠️ 重要：不要直接修改此接口的实例
 * 请使用 updateRuntimeState() 函数来确保状态变更事件正确触发
 */
export interface RuntimeState

  /**
   * 原始句子ID - 本次处理的句子标识
   * 来源：AnalysisEngine 生成，用于标识当前处理的用户输入
   */
  extends Partial<ChatRawSentenceIdIdentifier>,
    /** 模型类型 - modelType 字段 (getUserQuestion 后生成) */
    ChatModelTypeIdentifier,
    /**
     * 会话ID - 最终确定的会话标识
     * 来源：输入的 chatId（继续对话）或 AnalysisEngine 生成的新 chatId（新对话）
     */
    ChatChatIdIdentifier {
  /** 注意：isFirstQuestion 已移至 ChatRunContext.isFirstQuestion getter 方法 */
  /** 意图分析结果 - it 字段 (AnalysisEngine 后生成) */
  it?: string
  /** 重写句子 - rewrite_sentence 字段 (AnalysisEngine 后生成) */
  rewriteSentence?: string
  /** 字句拆解结果 - subQuestion 字段 (getUserQuestion 后生成) */
  subQuestion?: string[]
  /** 问句拆解结果 - content 字段 (getUserQuestion 后生成) */
  dpuResponse?: ChatDPUResponse
  /** 问句拆解建议 - suggest 字段 (getUserQuestion 后生成) */
  ragResponse?: ChatRAGResponse
  /** GEL 数据 - gelData 字段 (getUserQuestion 后生成) */
  gelData?: GelData[]
  /** SPL 表格数据 - splTable 字段 (getUserQuestion 后生成) */
  splTable?: SplTable[]
  /** 报告数据 - reportData 字段 (getUserQuestion 后生成) */
  reportData?: ReportChatData
  /** 实体识别结果 - entity 字段 (getUserQuestion 后生成) */
  entity?: ChatEntityRecognize[]

  /** 流式内容累积 - content 分别累积 */
  aigcContent: string
  /** 流式内容累积 - reason 分别累积 */
  aigcReason: string
}

// ChatRunContext 现在完全由类实现，不再在此处定义类型
// 请直接从 './ChatRunContextClass' 或 './runContext' 导入类
