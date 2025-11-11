import {
  AIHeaderMsg,
  AIMessageGEL,
  AgentMsgDepre,
  SubQuestionMessage,
  SuggestionMessage,
  UserMessageGEL,
} from 'gel-ui';

/**
 * AI 报告聊天 消息类型
 */
export type RPMsgParsed = UserMessageGEL | AIMessageGEL | AIHeaderMsg | SuggestionMessage | SubQuestionMessage;

/**
 * AI 报告 消息类型 这个类型是未被解析处理过的 后端消息
 */
export type RPMsgAgentShared = AgentMsgDepre;
