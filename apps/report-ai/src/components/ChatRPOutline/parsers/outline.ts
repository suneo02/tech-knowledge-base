import { OutlineEditorMessage, OutlinePreviewMessage, RPOutlineAgentMsgAI } from '@/types';

export const createOutlineEditorMessage = (agentMessage: RPOutlineAgentMsgAI): OutlineEditorMessage | undefined => {
  if (!agentMessage.reportData?.outline) {
    return;
  }
  return {
    role: 'outlineEditor',
    status: 'finish',
    think: agentMessage.think,
    content: agentMessage.reportData?.outline,
  };
};

export const createOutlinePreviewMessage = (agentMessage: RPOutlineAgentMsgAI): OutlinePreviewMessage | undefined => {
  if (!agentMessage.reportData?.outline) {
    return;
  }
  return {
    role: 'outlinePreview',
    status: 'finish',
    think: agentMessage.think,
    content: agentMessage.reportData?.outline,
  };
};
