/**
 * AI 对话优化类型系统 - 主入口文件
 *
 * 设计原则：
 * 1. 泛型支持：所有类型都支持泛型，确保灵活性和可扩展性
 * 2. 通用参数：类型参数必须是通用的，不依赖特定模块
 * 3. 模块自定义：各模块可以基于这些通用类型进行扩展
 * 4. 展平结构：将嵌套对象展平到顶级，提供更直观的访问方式
 * 5. 基于现有：参考现有的 agent.ts 和 parsed.ts 设计
 */

// ==================== 流式类型 ====================
export type {
  FilterFunction,
  ModelChunk,
  // 工具类型
  StreamAccumulator,
  StreamCallbacks,

  // 流式配置类型
  StreamConfig,
  // 流式分片类型
  StreamDelta,
  // 流式事件类型
  StreamEventData,
  StreamFilter,
  // 流水线转换函数类型
  StreamOutput,
  StreamPhase,
  // 流式处理器接口
  StreamProcessor,
  // 流式状态类型
  StreamStatus,
  StreamTransformer,
  TransformFunction,
  ValidateFunction,
} from './streamTypes'

// ==================== 配置类型 ====================
export type { AIOutputContent } from './config'

// ==================== 输入类型 ====================
export type {
  // 输入上下文类型
  ChatInputContext,

  // 输入类型
  ChatSendInput,
} from './input'

// ==================== Agent 消息类型 ====================
export type {
  AgentAIMessage,
  AgentMessage,
  // 基础字段
  AgentMessageFields,

  // Agent 消息类型
  AgentUserMessage,
  // 状态类型
  AllAgentMessages,
} from './agentMessages'

// ==================== 解析后消息类型 ====================
export type {
  // 解析后消息内容
  AllParsedMessages,
  ParsedAIHeaderMessage,
  ParsedAIMessage,
  ParsedAIReportMessage,
  ParsedChartMessage,
  ParsedFileMessage,
  ParsedMessage,
  // 解析后消息基础字段
  ParsedMessageFields,
  ParsedSimpleChartMessage,
  ParsedSplTableMessage,
  ParsedSubQuestionMessage,
  ParsedSuggestionMessage,
  // 解析后消息类型
  ParsedUserMessage,
} from './parsedMessages'
