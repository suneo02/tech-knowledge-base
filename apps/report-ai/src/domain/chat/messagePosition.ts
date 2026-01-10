/**
 * 消息位置判断工具函数
 *
 * @description 提供消息在列表中位置判断的纯函数
 * @since 1.0.0
 */

import { RPOutlineAgentMsg, RPOutlineAgentMsgAI } from '@/types';
import { ChatRawSentenceIdIdentifier } from 'gel-api';

/**
 * 判断指定消息是否为最后一条AI agent 消息
 *
 * @param targetMessage 要检查的目标消息
 * @param allMessages 所有消息列表
 * @returns 是否为最后一条AI消息
 */
export function isLastAgentMsgAI(
  sentence: Partial<ChatRawSentenceIdIdentifier>,
  allMessages: RPOutlineAgentMsg[]
): boolean {
  try {
    // 找到所有AI消息
    const aiMessages = allMessages.filter((msg) => msg.role === 'ai');

    if (aiMessages.length === 0) return true;

    // 获取最后一条AI消息
    const lastAIMessage = aiMessages[aiMessages.length - 1];

    // 比较 rawSentenceID
    return lastAIMessage.rawSentenceID === sentence.rawSentenceID;
  } catch (error) {
    console.error('isLastAIMessage error:', error);
    return true; // 出错时保守处理，允许交互
  }
}

/**
 * 检查AI消息是否包含公司列表
 *
 * @param message AI消息
 * @returns 是否包含公司列表
 */
export function hasCompanyList(message: RPOutlineAgentMsgAI): boolean {
  try {
    return !!(message.reportData?.companyList && message.reportData.companyList.length > 0);
  } catch (error) {
    console.error('hasCompanyList error:', error);
    return false;
  }
}
