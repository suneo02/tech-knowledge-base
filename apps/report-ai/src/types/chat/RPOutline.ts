import { RPFile } from 'gel-api';
import {
  AgentMsgAIOverall,
  AIHeaderMsg,
  AIMessageGEL,
  ChatInputContext,
  ChatSendInput,
  OtherMessageStatus,
  SubQuestionMessage,
  SuggestionMessage,
} from 'gel-ui';
import { RPFileUploaded } from '../file';
import { OutlineMessage } from './parsedMsg';

/**
 * 大纲消息中的文件类型
 * - RPFile: 服务端返回的文件（已解析）
 * - RPFileUploaded: 用户刚上传的文件（待解析）
 */
export type RPOutlineFile = RPFile | RPFileUploaded;

/**
 * 大纲输入上下文
 *
 * @description
 * 用户发送消息时的上下文，files 和 refFiles 只能是用户刚上传的文件
 */
export interface RPOutlineInputContext extends ChatInputContext {
  files?: RPFileUploaded[];
  refFiles?: RPFileUploaded[];
}

export type RPOutlineSendInput = ChatSendInput<string> & RPOutlineInputContext;

export type RPOutlineAgentMsgAI = AgentMsgAIOverall;

export type RPOutlineAgentMsgUser = Omit<RPOutlineSendInput, 'files' | 'refFiles'> & {
  role: 'user';
  /**
   * 文件列表，可能来自：
   * - 用户刚上传（RPFileUploaded）
   * - 服务端返回（RPFile）
   */
  files?: RPOutlineFile[];
  /**
   * 引用文件列表，可能来自：
   * - 用户刚上传（RPFileUploaded）
   * - 服务端返回（RPFile）
   */
  refFiles?: RPOutlineFile[];
  status?: OtherMessageStatus;
};
/**
 * AI 报告大纲 消息类型 这个类型是未被解析处理过的 后端消息
 */
export type RPOutlineAgentMsg = RPOutlineAgentMsgAI | RPOutlineAgentMsgUser;

/** 用户消息 */
export type RPOutlineUserMsgParse = {
  role: 'user';
  content: {
    message: string;
    files?: RPOutlineFile[];
    refFiles?: RPOutlineFile[];
  };
};

/**
 * 进度消息 - 用于展示 AIGC 生成进度
 *
 * @description 展示报告大纲生成过程中的实时进度信息
 * @example
 * ```typescript
 * const progressMessage: RPOutlineProgressMessage = {
 *   role: 'progress',
 *   content: {
 *     currentStepCode: 'TEMPLATE_CONFIRMED',
 *     currentStepName: '模板已确认',
 *     progressPercentage: 25
 *   },
 *   status: 'pending'
 * }
 * ```
 */
export type RPOutlineProgressMessage = {
  role: 'progress';
  content: {
    /** 当前步骤代码 */
    currentStepCode: string;
    /** 当前步骤名称 */
    currentStepName: string;
    /** 进度百分比 (0-100) */
    progressPercentage: number;
  };
  status: OtherMessageStatus;
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
  | RPOutlineProgressMessage
  | OutlineMessage;
