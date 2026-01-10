import { OutlineMessage, RPOutlineAgentMsgAI } from '@/types';

/**
 * 创建统一的大纲消息
 *
 * @description 不再区分编辑/预览模式，由渲染组件根据 context 动态判断
 */
export const createOutlineMessage = (agentMessage: RPOutlineAgentMsgAI): OutlineMessage | undefined => {
  if (!agentMessage.reportData?.outline) {
    return;
  }
  return {
    role: 'outline',
    status: 'finish',
    content: {
      ...agentMessage.reportData?.outline,
      rawSentenceID: agentMessage.rawSentenceID,
    },
  };
};
