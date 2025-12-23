import {
  MessageParsedReportContent,
  RPContentAgentMsg,
  RPContentAgentMsgAI,
  RPContentSubQuestionMessage,
  RPContentSuggestionMessage,
} from '@/types';
import { AIMessageReportContent, createSubQuestionMessage, createSuggestionMessage } from 'gel-ui';

/**
 * 将 RPContentAgentMsg 转换为 RPContentSuggestionMessage
 * @param agentMsg 原始消息
 * @returns 转换后的消息
 */
export const parseRPContentSuggestionMessage = (
  agentMsg: RPContentAgentMsgAI
): RPContentSuggestionMessage | undefined => {
  // 处理建议
  const suggestionMessage = createSuggestionMessage(agentMsg);
  if (!suggestionMessage) {
    return undefined;
  }
  return {
    ...suggestionMessage,
    chapterId: agentMsg.chapterId,
  };
};

/**
 * 将 RPContentAgentMsg 转换为 RPContentSubQuestionMessage
 * @param agentMsg 原始消息
 * @returns 转换后的消息
 */
export const parseRPContentSubQuestionMessage = (
  agentMsg: RPContentAgentMsgAI
): RPContentSubQuestionMessage | undefined => {
  const subQuestionMessage = createSubQuestionMessage(agentMsg);
  if (!subQuestionMessage) {
    return undefined;
  }
  return {
    ...subQuestionMessage,
    chapterId: agentMsg.chapterId,
  };
};

/**
 * 将 RPContentAgentMsg 转换为 AIMessageReportContent
 * @param agentMsg 原始消息
 * @returns 转换后的消息
 */
export const parseRPContentAIMessage = (agentMsg: RPContentAgentMsgAI): AIMessageReportContent | undefined => {
  if (!agentMsg.content && !agentMsg.reasonContent) {
    return undefined;
  }
  return {
    role: 'aiReportContent',
    content: agentMsg.content || '',
    think: agentMsg.think,
    status: agentMsg.status || 'finish',
    chapterId: agentMsg.chapterId,
  };
};

export const rpContentXChatParser = (agentMessage: RPContentAgentMsg) => {
  const messageList: MessageParsedReportContent[] = [];

  if (agentMessage.role === 'user') {
    return messageList;
  }

  // 处理AI内容
  const aiContentMessage = parseRPContentAIMessage(agentMessage);
  if (aiContentMessage) {
    messageList.push(aiContentMessage);
  }
  // 处理子问题
  const subQuestionMessage = parseRPContentSubQuestionMessage(agentMessage);
  if (subQuestionMessage) {
    messageList.push(subQuestionMessage);
  }

  // 处理建议
  const suggestionMessage = parseRPContentSuggestionMessage(agentMessage);
  if (suggestionMessage) {
    messageList.push(suggestionMessage);
  }
  return messageList;
};
