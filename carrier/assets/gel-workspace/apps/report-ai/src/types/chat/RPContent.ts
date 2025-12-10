import { ChatPresetQuestion, RPChapterIdIdentifier, RPFileTraced, WithDPUList, WithRAGList } from 'gel-api';
import {
  AgentMsgAIDepre,
  AIMessageReportContent,
  BaseMessageFields,
  ChatSendInput,
  OtherMessageStatus,
  SubQuestionMessage,
} from 'gel-ui';
import { ReactNode } from 'react';

export type RPContentSuggestionMessage = BaseMessageFields & {
  role: 'suggestion';
  content: {
    files?: RPFileTraced[];
  } & WithDPUList &
    WithRAGList;
  status: OtherMessageStatus;
  chapterId: string;
};

export type RPContentSubQuestionMessage = SubQuestionMessage & {
  chapterId: string;
};

/**
 * AI 报告内容 消息类型
 */
export type MessageParsedReportContent =
  | AIMessageReportContent
  | RPContentSuggestionMessage
  | RPContentSubQuestionMessage;

export type RPContentAgentMsgAI = AgentMsgAIDepre & {
  chapterId: string;
};

export type RPContentSendInput = ChatSendInput<ChatPresetQuestion | string> & {
  chapterId: string;
};

export type RPContentAgentMsgUser = RPContentSendInput & {
  role: 'user';
  status?: OtherMessageStatus;
  footer?: ReactNode;
};

/**
 * AI 报告内容 消息类型 这个类型是未被解析处理过的 后端消息
 */
export type RPContentAgentMsg = RPContentAgentMsgAI | RPContentAgentMsgUser;

export interface RPContentRefChapterIdentifier {
  /** 相关联的章节，可能被多个章节关联 */
  refChapter: RPChapterIdIdentifier['chapterId'][];
}
