import type { RPOutlineSendInput } from '@/types/chat/RPOutline';
import { AnalysisEngineResponse } from 'gel-api';
import { ChatLogLevel, ChatProcessEventBus, registerProcessLogListeners, RuntimeState } from 'gel-ui';

type ConversationInfo = { id: string; title: string; updateTime: string };

type OutlineListenerOptions = {
  setCreatingConversationLoading: () => void;
  setAnalyzingLoading: () => void;
  updateUrlWithChatId: (chatId: string) => void;
  onAddConversation: (conversation: ConversationInfo) => void;
  clearLoading: () => void;
  onRefresh?: () => void;
  /** 用于同步 RuntimeState 的 ref，供取消请求时使用 */
  runtimeStateRef?: React.MutableRefObject<RuntimeState | null>;
  /** 用于同步 input 的 ref，供取消请求时使用 */
  inputRef?: React.MutableRefObject<RPOutlineSendInput | null>;
  /** AbortController 引用，用于取消请求 */
  abortControllerRef?: React.MutableRefObject<AbortController | null>;
  abortStreamControllerRef?: React.MutableRefObject<AbortController | null>;
};

/**
 * 构建 RPOutline 相关的 EventBus 监听器
 * 返回注册函数，用于交给 createXAgentRequest 的 registerEventListeners
 */
export const createRPOutlineEventListeners = ({
  setCreatingConversationLoading,
  setAnalyzingLoading,
  updateUrlWithChatId,
  onAddConversation,
  clearLoading,
  onRefresh,
  runtimeStateRef,
  inputRef,
  abortControllerRef,
  abortStreamControllerRef,
}: OutlineListenerOptions) => {
  return (eventBus: ChatProcessEventBus) => {
    // 跟踪分析开始时是否有 chatId，用于判断是否为新对话
    let isNewConversation = false;

    const cleanupLogListeners = registerProcessLogListeners(eventBus, {
      level: ChatLogLevel.INFO,
      formatter: (level, process, message, data) => {
        return `🚀 [RPOutline] [${level.toUpperCase()}] [${process}] ${message} ${data ? JSON.stringify(data) : ''}`;
      },
    });

    const handleAnalysisStart = ({ chatId }: { chatId: string }) => {
      console.log('🔍 RPOutline 分析开始:', { chatId });

      // 记录是否为新对话（分析开始时没有 chatId）
      isNewConversation = !chatId;

      if (!chatId) {
        setCreatingConversationLoading();
      } else {
        setAnalyzingLoading();
      }
    };

    const handleAnalysisSuccess = ({ result }: { result: AnalysisEngineResponse }) => {
      console.log('✅ RPOutline 分析完成:', {
        chatId: result?.chatId,
        rawSentenceID: result?.rawSentenceID,
      });

      // 只有在新对话且成功获取到 chatId 时才更新 URL 和添加对话
      if (isNewConversation && result?.chatId) {
        updateUrlWithChatId(result.chatId);
        onAddConversation({
          id: result.chatId,
          title: result?.itResult?.rewrite_sentence || 'New Chat',
          updateTime: new Date().toLocaleString(),
        });
      }
    };

    // 统一的 RuntimeState 和 Input 同步处理器
    const handleRuntimeUpdated = ({ runtime, input }) => {
      // 同步 RuntimeState 到 ref，供取消请求时使用
      if (runtimeStateRef && runtime) {
        runtimeStateRef.current = runtime;
      }

      // 同步 input 到 ref，供取消请求时使用
      if (inputRef && input) {
        inputRef.current = input;
      }
    };

    const handleError = ({ error, phase }: { error: Error; phase: string }) => {
      console.error(`❌ RPOutline ${phase} 阶段错误:`, error.message);
      clearLoading();
    };

    const handleComplete = () => {
      console.log('✅ RPOutline 流程完成');
      clearLoading();
      onRefresh?.();
    };

    // AbortController 事件处理器
    const handleAbortControllerCreated = ({ controller }: { controller: AbortController }) => {
      if (abortControllerRef) {
        abortControllerRef.current = controller;
      }
    };

    const handleAbortControllerCleared = () => {
      if (abortControllerRef) {
        abortControllerRef.current = null;
      }
    };

    const handleStreamAbortControllerCreated = ({ controller }: { controller: AbortController }) => {
      if (abortStreamControllerRef) {
        abortStreamControllerRef.current = controller;
      }
    };

    const handleStreamAbortControllerCleared = () => {
      if (abortStreamControllerRef) {
        abortStreamControllerRef.current = null;
      }
    };

    // 注册所有事件监听器
    eventBus.on('analysis:start', handleAnalysisStart);
    eventBus.on('analysis:success', handleAnalysisSuccess);
    eventBus.on('runtime:updated', handleRuntimeUpdated);
    eventBus.on('error', handleError);
    eventBus.on('complete', handleComplete);

    // 注册 AbortController 事件监听器（如果提供了 ref）
    if (abortControllerRef) {
      eventBus.on('abortController:created', handleAbortControllerCreated);
      eventBus.on('abortController:cleared', handleAbortControllerCleared);
    }
    if (abortStreamControllerRef) {
      eventBus.on('streamAbortController:created', handleStreamAbortControllerCreated);
      eventBus.on('streamAbortController:cleared', handleStreamAbortControllerCleared);
    }

    return () => {
      cleanupLogListeners?.();
      eventBus.off('analysis:start', handleAnalysisStart);
      eventBus.off('analysis:success', handleAnalysisSuccess);
      eventBus.off('runtime:updated', handleRuntimeUpdated);
      eventBus.off('error', handleError);
      eventBus.off('complete', handleComplete);

      // 清理 AbortController 事件监听器
      if (abortControllerRef) {
        eventBus.off('abortController:created', handleAbortControllerCreated);
        eventBus.off('abortController:cleared', handleAbortControllerCleared);
      }
      if (abortStreamControllerRef) {
        eventBus.off('streamAbortController:created', handleStreamAbortControllerCreated);
        eventBus.off('streamAbortController:cleared', handleStreamAbortControllerCleared);
      }
    };
  };
};
