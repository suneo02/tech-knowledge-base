import { axiosInstance } from '@/api/axios';
import { entWebAxiosInstance } from '@/api/entWeb';
import { RPContentAgentMsg } from '@/types';
import { RPContentAgentMsgUser, RPContentSendInput } from '@/types/chat/RPContent';
import useXAgent, { XAgent, XAgentConfig } from '@ant-design/x/es/use-x-agent';
import { useChatRoomContext } from 'ai-ui';
import { ChatClientType } from 'gel-api';
import { RuntimeState, useAIChatSendState, useCancelChatReq, XRequestClass } from 'gel-ui';
import { isArray, isObject } from 'lodash-es';
import { MutableRefObject, useMemo, useRef } from 'react';
import { isDev } from '../../utils';
import { createReportContentEventListeners } from './contentListeners';
import { createReportContentXAgentReq } from './xAgentReq';

export const useRPContentXAgent = (options: {
  abortControllerRef: MutableRefObject<AbortController | null>;
  abortStreamControllerRef: MutableRefObject<AbortController | null>;
  create: XRequestClass['create'];
  clientType?: ChatClientType;
}): {
  agent: XAgent<RPContentAgentMsg, { message: RPContentAgentMsgUser }, RPContentAgentMsg>;
  content: string;
  loadingText: string;
  setContent: (content: string) => void;
  cancelRequest: () => void;
} => {
  const { abortControllerRef, abortStreamControllerRef, create, clientType } = options;
  const { setIsChating } = useChatRoomContext();

  const { content, loadingText, setContent, setCreatingConversationLoading, setAnalyzingLoading, clearLoading } =
    useAIChatSendState();

  const runtimeStateRef = useRef<RuntimeState | null>(null);
  const inputRef = useRef<RPContentSendInput | null>(null);

  const registerEventListeners = useMemo(
    () =>
      createReportContentEventListeners({
        setCreatingConversationLoading,
        setAnalyzingLoading,
        clearLoading,
        runtimeStateRef,
        inputRef,
        abortControllerRef,
        abortStreamControllerRef,
      }),
    [
      setCreatingConversationLoading,
      setAnalyzingLoading,
      clearLoading,
      runtimeStateRef,
      inputRef,
      abortControllerRef,
      abortStreamControllerRef,
    ]
  );

  const unifiedHandler = useMemo(
    () =>
      createReportContentXAgentReq(
        {
          setContent,
          setIsChating,
          create,
          registerEventListeners,
        },
        {
          axiosInstance,
          axiosEntWeb: entWebAxiosInstance,
          isDev,
        }
      ),
    [setContent, setIsChating, create, registerEventListeners]
  );

  const request: NonNullable<
    XAgentConfig<RPContentAgentMsg, { message: RPContentAgentMsgUser }, RPContentAgentMsg>['request']
  > = async ({ message: messageInput }, { onSuccess: onAgentSuccess, onUpdate: onAgentUpdate }) => {
    if (!messageInput?.content) {
      setIsChating(false);
      return;
    }

    const sendInput: RPContentSendInput = {
      content: messageInput.content,
      chatId: messageInput.chatId,
      chapterId: messageInput.chapterId,
      agentId: messageInput.agentId,
      agentParam: messageInput.agentParam,
      entityCode: messageInput.chapterId,
      entityType: 'chapter',
      clientType: clientType || 'aireport',
      think: messageInput.think,
    };

    await unifiedHandler?.(sendInput, {
      onUpdate: (agentMsg) => {
        onAgentUpdate({
          ...agentMsg,
          chapterId: messageInput.chapterId,
        });
      },
      onSuccess: (messages) => {
        if (isArray(messages)) {
          const patched = messages.map((msg) => ({
            ...msg,
            chapterId: messageInput.chapterId,
          }));
          onAgentSuccess(patched);
        } else if (isObject(messages)) {
          onAgentSuccess({
            // @ts-expect-error
            ...messages,
            chapterId: messageInput.chapterId,
          });
        }
      },
      onError: (error: Error) => {
        console.error('ReportContent unified handler error:', error);
        setIsChating(false);
      },
    });
  };

  const [agent] = useXAgent<RPContentAgentMsg, { message: RPContentAgentMsgUser }, RPContentAgentMsg>({
    request,
  });

  const cancelRequest = useCancelChatReq<RPContentSendInput>({
    setIsChating,
    abortControllerRef,
    abortStreamControllerRef,
    runtimeStateRef,
    inputRef,
    axiosInstance,
  });

  return {
    agent,
    content,
    loadingText,
    setContent,
    cancelRequest,
  };
};
