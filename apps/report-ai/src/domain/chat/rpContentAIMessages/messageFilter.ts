/**
 * 消息筛选工具
 *
 * 提供简洁的消息查找和筛选功能
 */

import { RPContentAgentMsg, RPContentAgentMsgAI } from '@/types';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';

/**
 * 获取指定章节的最新 Agent AI 消息
 *
 * @param messages Agent 消息列表（原始消息）
 * @param chapterId 章节ID
 * @returns 最新的 AI Agent 消息，如果没有找到则返回 undefined
 *
 * @example
 * ```typescript
 * const latestAgentMsg = getLatestAgentMessageByChapterId(agentMessages, '1')
 * ```
 */
export function getLatestAgentMessageByChapterId(
  messages: MessageInfo<RPContentAgentMsg>[],
  chapterId: string
): MessageInfo<RPContentAgentMsgAI> | undefined {
  // 从后往前查找，返回最新的匹配消息
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.message.role === 'ai' && msg.message.chapterId === chapterId) {
      return msg as MessageInfo<RPContentAgentMsgAI>;
    }
  }
  return undefined;
}
