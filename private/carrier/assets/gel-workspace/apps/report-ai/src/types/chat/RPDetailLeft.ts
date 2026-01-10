import {
  AgentMsgAIOverall,
  AIHeaderMsg,
  AIMessageGEL,
  ChatSendInput,
  OtherMessageStatus,
  SubQuestionMessage,
  SuggestionMessage,
} from 'gel-ui';
import { RPFileUploaded } from '../file';
import { RPOutlineUserMsgParse } from './RPOutline';
import { OutlineMessage } from './parsedMsg';

export type RPDetailSendInput = ChatSendInput<string> & {
  files?: RPFileUploaded[];
  refFiles?: RPFileUploaded[];
};

export type RPDetailLeftAgentMsgUser = RPDetailSendInput & {
  role: 'user';
  status?: OtherMessageStatus;
};

export type RPDetailLeftAgentMsgAI = AgentMsgAIOverall & {
  /**
   * 文件ID列表，sender 中有可能上传
   */
  files?: RPFileUploaded[];
  /**
   * 引用文件ID列表，sender 中有可能 @ 引用上传
   */
  refFiles?: RPFileUploaded[];
};

/**
 * AI 报告大纲 消息类型 这个类型是未被解析处理过的 后端消息
 */
export type RPDetailLeftAgentMsg = RPDetailLeftAgentMsgAI | RPDetailLeftAgentMsgUser;

/** 用户消息 */
export type RPDetailLeftUserMsgParse = {
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
export type RPDetailLeftMsgParsed =
  | RPOutlineUserMsgParse
  | AIMessageGEL
  | AIHeaderMsg
  | SuggestionMessage
  | SubQuestionMessage
  | OutlineMessage;
