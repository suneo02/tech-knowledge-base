/**
 * 章节生成状态检查工具
 *
 * 职责：
 * - 检查章节是否生成完成
 * - 检查进度相关状态
 * - 提供生成状态相关的纯函数工具
 */

import { RPContentAgentMsg } from '@/types';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { getLatestAgentMessageByChapterId } from './messageFilter';

/**
 * 检查指定报告章节是否生成完成
 *
 * @param messages Agent 消息列表
 * @param chapterId 章节ID
 * @returns 是否生成完成
 *
 * @example
 * ```typescript
 * const isFinished = isReportChapterGenerationFinished(messages, '123')
 * ```
 */
export const isReportChapterGenerationFinished = (
  messages: MessageInfo<RPContentAgentMsg>[],
  chapterId: string
): boolean => {
  // 使用 domain 层的工具函数获取最新消息
  const latestMessage = getLatestAgentMessageByChapterId(messages, chapterId);
  return latestMessage?.message.status === 'finish';
};

/**
 * 检查文本改写是否已完成
 *
 * 通过检查消息列表中是否存在完成状态的 aiReportContent 消息来判断
 *
 * @param messages 消息列表
 * @param correlationId 关联ID（可选，用于精确匹配）
 * @returns 是否已完成
 *
 * @example
 * ```typescript
 * const isCompleted = isTextRewriteCompleted(messages, 'text_rewrite_123')
 * ```
 *
 * @see apps/report-ai/docs/specs/text-ai-rewrite-implementation/spec-design-v1.md
 */
export const isTextRewriteCompleted = (
  messages: MessageInfo<RPContentAgentMsg>[],
  correlationId?: string | null
): boolean => {
  if (!correlationId) {
    return false;
  }
  // 查找完成状态的 aiReportContent 消息
  // TODO: 需要在消息中添加 correlationId 字段来精确匹配
  // 目前简化实现：假设最近的 aiReportContent 完成消息就是当前操作的完成
  return messages.some((msg) => msg.message.role === 'ai' && msg.message.status === 'finish');
};

/**
 * 获取文本改写的预览内容
 *
 * 从消息列表中获取最新的 aiReportContent 消息内容
 * 注意：流式消息中每条消息都包含完整的当前内容，而不是增量内容
 *
 * @param messages 消息列表
 * @param correlationId 关联ID（可选，用于精确匹配）
 * @returns 预览内容
 *
 * @example
 * ```typescript
 * const content = getTextRewritePreviewContent(messages, 'text_rewrite_123')
 * ```
 *
 * @see apps/report-ai/docs/specs/text-ai-rewrite-implementation/spec-design-v1.md
 */
export const getTextRewritePreviewContent = (
  messages: MessageInfo<RPContentAgentMsg>[],
  correlationId?: string | null
): string => {
  if (!correlationId) {
    return '';
  }

  // 从后往前查找最新的 AI 响应消息
  // TODO: 需要在消息中添加 correlationId 字段来精确匹配
  // 目前简化实现：假设最近的 aiReportContent 消息就是当前操作的内容

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.message.role === 'ai') {
      return msg.message.content || '';
    }
  }

  return '';
};
