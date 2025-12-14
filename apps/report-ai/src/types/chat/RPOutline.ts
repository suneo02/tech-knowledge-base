import {
  AgentMsgAIDepre,
  AIHeaderMsg,
  AIMessageGEL,
  BaseMessageFields,
  ChatInputContext,
  ChatSendInput,
  OtherMessageStatus,
  SubQuestionMessage,
  SuggestionMessage,
} from 'gel-ui';
import { ReactNode } from 'react';
import { RPFileUploaded } from '../file';
import { OutlineEditorMessage, OutlinePreviewMessage } from './parsedMsg';

export interface RPOutlineInputContext extends ChatInputContext {
  files?: RPFileUploaded[];
  refFiles?: RPFileUploaded[];
}

export type RPOutlineSendInput = ChatSendInput<string> & RPOutlineInputContext;

export type RPOutlineAgentMsgAI = AgentMsgAIDepre & {
  /**
   * 文件ID列表，sender 中有可能上传
   */
  files?: RPFileUploaded[];
  /**
   * 引用文件ID列表，sender 中有可能 @ 引用上传
   */
  refFiles?: RPFileUploaded[];
};

export type RPOutlineAgentMsgUser = RPOutlineSendInput & {
  role: 'user';
  /** 消息底部附加内容 */
  footer?: ReactNode;
  status?: OtherMessageStatus;
};
/**
 * AI 报告大纲 消息类型 这个类型是未被解析处理过的 后端消息
 */
export type RPOutlineAgentMsg = RPOutlineAgentMsgAI | RPOutlineAgentMsgUser;

/** 用户消息 */
export type RPOutlineUserMsgParse = BaseMessageFields & {
  role: 'user';
  content: {
    message: string;
    files?: RPFileUploaded[];
    refFiles?: RPFileUploaded[];
  };
};

/**
 * AI 报告大纲 消息类型
 */
export type RPOutlineMsgParsed =
  | RPOutlineUserMsgParse
  | AIMessageGEL
  | AIHeaderMsg
  | SuggestionMessage
  | SubQuestionMessage
  | OutlineEditorMessage
  | OutlinePreviewMessage;
