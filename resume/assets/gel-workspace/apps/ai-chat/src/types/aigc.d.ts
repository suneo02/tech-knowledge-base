/**
 * LLM (Large Language Model) 请求参数配置
 */
declare interface LLMRequestParams {
  /**
   * 采样温度，控制输出的随机性
   * 范围 0-2，值越高表示越随机，越低表示越确定
   * @default 0.7
   */
  temperature?: number

  /**
   * 核采样阈值，控制输出的多样性
   * 范围 0-1，仅考虑累积概率达到该值的词
   * @default 0.9
   */
  top_p?: number

  /**
   * 生成的候选回复数量
   * @default 1
   */
  n?: number

  /**
   * 是否启用流式响应
   * @default false
   */
  stream?: boolean

  /**
   * 生成终止标记
   * 当生成内容包含这些标记时停止生成
   */
  stop?: string | string[]

  /**
   * 生成的最大 token 数量限制
   * 根据模型不同有不同的上限
   */
  max_tokens?: number

  /**
   * 重复惩罚系数
   * 范围 -2.0 到 2.0，正值降低重复内容的生成概率
   */
  presence_penalty?: number

  /**
   * 频率惩罚系数
   * 范围 -2.0 到 2.0，正值降低高频词的生成概率
   */
  frequency_penalty?: number

  /**
   * token 概率偏好设置
   * 用于调整特定 token 的生成概率
   */
  logit_bias?: Record<string, number>

  /**
   * 用户标识符
   * 用于请求追踪和日志记录
   */
  user?: string
}

/**
 * LLM 服务配置
 */
declare interface LLMService {
  /** 服务标识 */
  name: string
  /** API 基础地址 */
  baseUrl: string
  /** 认证类型 */
  authType: string
  /** API 密钥 */
  apiKey: string
  /** 模型标识 */
  model: string
  /** 模型参数配置 */
  params?: LLMRequestParams
}

/**
 * 基础消息格式
 */
declare interface BaseMessage {
  role: 'user' | 'ai' | 'system'
  content: string
}

/**
 * AI 文本响应
 * 用于普通的文本对话消息
 */
declare interface AITextResponse {
  role: 'ai'
  content: string
}

/**
 * AI 建议选项
 * 用于展示可点击的建议选项
 */
declare interface AISuggestionItem {
  /** 选项唯一标识 */
  key: string
  /** 选项图标 */
  icon: React.ReactNode
  /** 选项描述文本 */
  description: string
}

/**
 * AI 建议响应
 * 用于展示一组建议选项
 */
declare interface AISuggestionResponse {
  role: 'suggestion'
  content: AISuggestionItem[]
}

/**
 * AI 文件项
 * 用于展示文件信息
 */
declare interface AIFileItem {
  /** 文件唯一标识 */
  uid: string
  /** 文件名称 */
  name: string
  /** 文件大小(字节) */
  size: number
  /** 文件描述 */
  description?: string
  /** 文件状态：uploading-上传中, done-已完成 */
  status?: string
  /** 上传进度(0-100) */
  percent?: number
}

/**
 * AI 文件响应
 * 用于展示一组文件
 */
declare interface AIFileResponse {
  role: 'file'
  content: AIFileItem[]
}

/**
 * AI 响应消息类型
 * 支持文本、建议选项、文件三种响应形式
 */
declare type AIResponseItem = AITextResponse | AISuggestionResponse | AIFileResponse

/**
 * AI 响应消息
 */
declare interface AIMessage extends BaseMessage {
  role: 'ai'
  content?: string
  list?: AIResponseItem[]
}

/**
 * 用户消息
 */
declare interface UserMessage extends BaseMessage {
  role: 'user'
  content: string
}

declare interface ChatMessage extends UserMessage, AIMessage, SystemMessage {}

/**
 * 系统消息
 */
declare interface SystemMessage extends BaseMessage {
  role: 'system'
}

/**
 * 聊天消息请求
 */
declare interface ChatRequest {
  messages: Array<UserMessage | AIMessage>
}

/**
 * LLM 服务消息
 */
declare type LLMServiceMessage = LLMRequestParams & {
  role: 'user' | 'ai'
  content: string
  list?: AIResponseItem[]
}
