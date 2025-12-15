import { createRPDetailMessageParser } from '@/components/ChatRPLeft/parsers';
import { addConversationItem, useAppDispatch } from '@/store';
import { RPMsgAgentShared } from '@/types/chat/RPLeft';
import {
  RPDetailLeftAgentMsg,
  RPDetailLeftAgentMsgUser,
  RPDetailLeftMsgParsed,
  RPDetailSendInput,
} from '@/types/chat/RPDetailLeft';
import { useXChat } from '@ant-design/x';
import { DefaultMessageInfo, XChatConfig } from '@ant-design/x/es/use-x-chat';
import { useChatRoomContext } from 'ai-ui';
import { createConfiguredXRequest } from 'gel-ui';
import { useCallback, useMemo, useRef } from 'react';
import { getApiPrefix, getWsid } from '../../utils';
import { useReportConversationManager } from '../useRPConversationManager';
import { useRPDetailXAgent } from './useRPDetailXAgent';

/**
 * 详情聊天主协调器。
 *
 * 负责组装统一的 xAgent、解析器、消息存储，并暴露给聊天 UI 使用。
 */
export const useRPDetailChat = (defaultMessages?: DefaultMessageInfo<RPMsgAgentShared>[]) => {
  const dispatch = useAppDispatch();
  const { refreshConversations } = useReportConversationManager();
  const { chatId } = useChatRoomContext();

  const abortControllerRef = useRef<AbortController | null>(null);
  const abortStreamControllerRef = useRef<AbortController | null>(null);

  const handleAddConversation = useCallback(
    (conversation: { id: string; title: string; updateTime: string }) => {
      dispatch(
        addConversationItem({
          questionsNum: 1,
          updateTime: conversation.updateTime,
          groupId: conversation.id,
          questions: conversation.title,
        })
      );
    },
    [dispatch]
  );

  const { create } = useMemo(() => {
    // 将流式 abort signal 注入 xRequest，保证中断请求时串联到 fetch 层
    return createConfiguredXRequest(() => abortStreamControllerRef.current?.signal, getWsid(), getApiPrefix());
  }, []);

  const { agent, content, setContent, cancelRequest } = useRPDetailXAgent({
    abortControllerRef,
    abortStreamControllerRef,
    create,
    onAddConversation: handleAddConversation,
    onRefresh: refreshConversations,
  });

  const parserRef = useRef<NonNullable<XChatConfig<RPDetailLeftAgentMsg, RPDetailLeftMsgParsed>['parser']>>();

  const { onRequest, parsedMessages, setMessages } = useXChat<
    RPDetailLeftAgentMsg,
    RPDetailLeftMsgParsed,
    { message: RPDetailSendInput },
    RPDetailLeftAgentMsg
  >({
    agent,
    parser: (message) => {
      if (!parserRef.current) return [];
      return parserRef.current(message);
    },
    defaultMessages,
  });

  const sendMessage = useCallback(
    (messageInput: RPDetailSendInput) => {
      // 统一补齐用户消息的系统字段，复用通用 sendInput
      const payload: RPDetailLeftAgentMsgUser = {
        ...messageInput,
        role: 'user',
        chatId,
        status: 'finish',
        clientType: messageInput.clientType || 'aireport',
      };

      onRequest(payload);
    },
    [onRequest, chatId]
  );

  // 解析器需要最新的 sendMessage，用于 AI footer 的继续提问能力
  const detailParser = useMemo(() => createRPDetailMessageParser(sendMessage), [sendMessage]);
  parserRef.current = detailParser;

  return {
    content,
    parsedMessages,
    handleContentChange: setContent,
    sendMessage,
    setMessages,
    cancelRequest,
  };
};
