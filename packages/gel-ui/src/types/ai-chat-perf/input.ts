/**
 * AI 对话输入类型定义
 *
 * 定义发送给 AI 的输入类型，包括输入内容、上下文信息和技术配置
 */

// 导入现有的具体类型定义
import type { AgentIdentifiers, ChatChatIdIdentifier } from 'gel-api'
import { ChatMsgInputOptions } from '../ai-chat/message'

// ==================== 输入上下文类型 ====================

/**
 * 输入上下文接口 - 用户输入时的业务上下文和处理偏好
 *
 * 设计原则：
 * 1. 包含用户输入时的会话上下文、代理信息、业务设置
 * 2. 影响 AI 处理逻辑的用户偏好和配置
 * 3. 不包含 AI 输出的内容（如 refBase、refTable、subQuestion）
 * 4. 展平结构，提供更直观的访问方式
 */
export interface ChatInputContext
  extends ChatMsgInputOptions,
    Partial<ChatChatIdIdentifier>,
    Pick<AgentIdentifiers, 'reAgentId'> {}

/**
 * 通用输入类型
 * @template TContent - 内容类型，默认为 string（用户输入的核心内容）
 * @template TContext - 输入上下文类型，必须继承 InputContext（用户的上下文和偏好）
 * @template TConfig - 技术配置类型，必须继承 TechnicalConfig（技术层面的配置）
 */
export interface ChatSendInput<TContent = string> extends ChatInputContext {
  /**
   * 核心输入内容 - 用户的主要输入，AI 处理的核心数据
   * 对应 AgentMsgUserOverall.content
   */
  content: TContent
}
