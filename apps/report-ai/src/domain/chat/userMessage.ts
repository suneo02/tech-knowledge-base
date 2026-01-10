import { RPOutlineAgentMsgUser, RPOutlineUserMsgParse } from '@/types';

export const createUserMessageWithFiles = (agentMessage: RPOutlineAgentMsgUser): RPOutlineUserMsgParse => {
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
  };
};
