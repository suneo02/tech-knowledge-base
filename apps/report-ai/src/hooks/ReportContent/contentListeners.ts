import type { RPContentSendInput } from '@/types/chat/RPContent';
import { ChatProcessEventBus, RuntimeState } from 'gel-ui';
import type { MutableRefObject } from 'react';

export type ReportContentListenerOptions = {
  setCreatingConversationLoading: () => void;
  setAnalyzingLoading: () => void;
  clearLoading: () => void;
  runtimeStateRef: MutableRefObject<RuntimeState | null>;
  inputRef: MutableRefObject<RPContentSendInput | null>;
  abortControllerRef: MutableRefObject<AbortController | null>;
  abortStreamControllerRef: MutableRefObject<AbortController | null>;
};

/**
 * 构建内容聊天的 EventBus 监听器集合，负责 Loading、chatId 同步与取消控制。
 */
export const createReportContentEventListeners = ({
  setCreatingConversationLoading,
  setAnalyzingLoading,
  clearLoading,
  runtimeStateRef,
  inputRef,
  abortControllerRef,
  abortStreamControllerRef,
}: ReportContentListenerOptions) => {
  return (eventBus: ChatProcessEventBus<RPContentSendInput>) => {
    let isNewConversation = false;

    const handleAnalysisStart = ({ chatId }: { chatId: string }) => {
      isNewConversation = !chatId;
      if (!chatId) {
        setCreatingConversationLoading();
      } else {
        setAnalyzingLoading();
      }
    };

    const handleRuntimeUpdated = ({ runtime, input }: { runtime: RuntimeState; input: RPContentSendInput }) => {
      runtimeStateRef.current = runtime;
      inputRef.current = input;
    };

    const handleComplete = () => {
      clearLoading();
    };

    const handleError = () => {
      clearLoading();
    };

    const handleAbortControllerCreated = ({ controller }: { controller: AbortController }) => {
      abortControllerRef.current = controller;
    };

    const handleAbortControllerCleared = () => {
      abortControllerRef.current = null;
    };

    const handleStreamAbortControllerCreated = ({ controller }: { controller: AbortController }) => {
      abortStreamControllerRef.current = controller;
    };

    const handleStreamAbortControllerCleared = () => {
      abortStreamControllerRef.current = null;
    };

    eventBus.on('analysis:start', handleAnalysisStart);
    eventBus.on('runtime:updated', handleRuntimeUpdated);
    eventBus.on('complete', handleComplete);
    eventBus.on('error', handleError);
    eventBus.on('abortController:created', handleAbortControllerCreated);
    eventBus.on('abortController:cleared', handleAbortControllerCleared);
    eventBus.on('streamAbortController:created', handleStreamAbortControllerCreated);
    eventBus.on('streamAbortController:cleared', handleStreamAbortControllerCleared);

    return () => {
      eventBus.off('analysis:start', handleAnalysisStart);
      eventBus.off('runtime:updated', handleRuntimeUpdated);
      eventBus.off('complete', handleComplete);
      eventBus.off('error', handleError);
      eventBus.off('abortController:created', handleAbortControllerCreated);
      eventBus.off('abortController:cleared', handleAbortControllerCleared);
      eventBus.off('streamAbortController:created', handleStreamAbortControllerCreated);
      eventBus.off('streamAbortController:cleared', handleStreamAbortControllerCleared);
    };
  };
};
