import { rpContentXChatParser } from '@/domain/chat/rpContentAIMessages';
import { MessageParsedReportContent, RPContentAgentMsg } from '@/types';
import { RPContentAgentMsgUser, RPContentSendInput } from '@/types/chat/RPContent';
import { useXChat } from '@ant-design/x';
import { DefaultMessageInfo } from '@ant-design/x/es/use-x-chat';
import { useChatRoomContext } from 'ai-ui';
import { createConfiguredXRequest } from 'gel-ui';
import { useCallback, useMemo, useRef } from 'react';
import { getApiPrefix, getWsid } from '../../utils';
import { useRPContentXAgent } from './useRPContentXAgent';

/**
 * 内容聊天主协调器：统一调度 xAgent、解析器与 UI 状态。
 */
export const useRPContentChat = (defaultMessages?: DefaultMessageInfo<RPContentAgentMsg>[]) => {
  const { chatId } = useChatRoomContext();

  const abortControllerRef = useRef<AbortController | null>(null);
  const abortStreamControllerRef = useRef<AbortController | null>(null);

  const { create } = useMemo(() => {
    return createConfiguredXRequest(() => abortStreamControllerRef.current?.signal, getWsid(), getApiPrefix());
  }, []);

  const { agent, content, setContent, cancelRequest } = useRPContentXAgent({
    abortControllerRef,
    abortStreamControllerRef,
    create,
  });

  const { onRequest, parsedMessages, setMessages } = useXChat<
    RPContentAgentMsg,
    MessageParsedReportContent,
    { message: RPContentAgentMsgUser },
    RPContentAgentMsg
  >({
    agent,
    parser: rpContentXChatParser,
    defaultMessages,
  });

  const sendMessage = useCallback(
    (messageInput: RPContentSendInput) => {
      const userMessage: RPContentAgentMsgUser = {
        role: 'user',
        content: messageInput.content,
        chatId,
        status: 'finish',
        think: messageInput.think,
        agentId: messageInput.agentId,
        agentParam: messageInput.agentParam,
        chapterId: messageInput.chapterId,
      };

      onRequest(userMessage);
    },
    [onRequest, chatId]
  );

  return {
    content,
    parsedMessages,
    handleContentChange: setContent,
    sendMessage,
    setMessages,
    cancelRequest,
  };
};
