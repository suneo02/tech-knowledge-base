import { RPFileUploaded, RPOutlineUserMsgParse } from '@/types';
import { ChatThinkSignal } from 'gel-api';

/**
 * 通用用户消息解析器
 *
 * @description 将原始用户消息转换为带附件信息的解析结构
 */
type UserMessageLike = {
  content?: string;
  files?: RPFileUploaded[];
  refFiles?: RPFileUploaded[];
} & ChatThinkSignal;

export const createUserMessageWithFiles = (agentMessage: UserMessageLike): RPOutlineUserMsgParse => {
  if (!agentMessage.content) {
    console.error('createUserMessageWithFiles: content is undefined', agentMessage);
  }

  return {
    role: 'user',
    content: {
      message: agentMessage.content || '',
      files: agentMessage.files,
      refFiles: agentMessage.refFiles,
    },
    think: agentMessage.think,
  };
};
