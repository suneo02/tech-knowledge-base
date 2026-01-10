import { ChatPresetQuestion, RPChapterIdIdentifier } from 'gel-api';
import { AgentMsgAIOverall, ChatSendInput, OtherMessageStatus } from 'gel-ui';
import { ReactNode } from 'react';

export type RPContentAgentMsgAI = AgentMsgAIOverall & {
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
