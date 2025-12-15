import {
  RPDetailLeftAgentMsg,
  RPDetailLeftAgentMsgAI,
  RPDetailLeftAgentMsgUser,
  RPDetailLeftMsgParsed,
  RPDetailSendInput,
} from '@/types/chat/RPDetailLeft';
import {
  AgentMsgAIDepre,
  AiFooterBase,
  createAIContentMessage,
  createAIHeaderMessage,
  createSubQuestionMessage,
  createSuggestionMessage,
} from 'gel-ui';
import { FC } from 'react';
import { axiosInstance } from '@/api/axios';
import { entWebAxiosInstance } from '@/api/entWeb';
import { XChatConfig } from '@ant-design/x/es/use-x-chat';
import { createUserMessageWithFiles } from '@/domain/chat';

/**
 * 创建 Detail 聊天 AI Footer 组件
 */
function createDetailFooterComponent(sendMessage?: (message: RPDetailSendInput) => void): FC<{
  content: string;
  agentMessage: RPDetailLeftAgentMsgAI;
}> {
  return (props) => (
    <AiFooterBase
      {...props}
      axiosChat={axiosInstance}
      axiosEntWeb={entWebAxiosInstance}
      sendMessage={(message, agentId, think) => sendMessage?.({ content: message, agentId, think })}
    />
  );
}

/**
 * 创建 RPDetail 聊天消息解析器
 */
export function createRPDetailMessageParser(
  sendMessage?: (message: RPDetailSendInput) => void
): NonNullable<XChatConfig<RPDetailLeftAgentMsg, RPDetailLeftMsgParsed>['parser']> {
  const FooterComponent = createDetailFooterComponent(sendMessage);

  const createAIContentWithFooter = (message: AgentMsgAIDepre) => createAIContentMessage(message, FooterComponent);

  return (agentMessage: RPDetailLeftAgentMsg): RPDetailLeftMsgParsed[] => {
    if (agentMessage.role === 'user') {
      return [createUserMessageWithFiles(agentMessage) as RPDetailLeftMsgParsed];
    }

    const messageList: RPDetailLeftMsgParsed[] = [createAIHeaderMessage(agentMessage)];

    const subQuestionMessage = createSubQuestionMessage(agentMessage);
    if (subQuestionMessage) {
      messageList.push(subQuestionMessage);
    }

    const aiContentMessage = createAIContentWithFooter(agentMessage);
    if (aiContentMessage) {
      messageList.push(aiContentMessage);
    }

    const suggestionMessage = createSuggestionMessage(agentMessage);
    if (suggestionMessage) {
      messageList.push(suggestionMessage);
    }

    return messageList;
  };
}
