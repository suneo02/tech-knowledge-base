import type { RPDetailSendInput } from '@/types/chat/RPDetailLeft';
import { AnalysisEngineResponse } from 'gel-api';
import { ChatLogLevel, ChatProcessEventBus, registerProcessLogListeners, RuntimeState } from 'gel-ui';

type ConversationInfo = { id: string; title: string; updateTime: string };

type DetailListenerOptions = {
  setCreatingConversationLoading: () => void;
  setAnalyzingLoading: () => void;
  setChatId: (chatId: string) => void;
  onAddConversation: (conversation: ConversationInfo) => void;
  clearLoading: () => void;
  onRefresh?: () => void;
  runtimeStateRef?: React.MutableRefObject<RuntimeState | null>;
  inputRef?: React.MutableRefObject<RPDetailSendInput | null>;
  abortControllerRef?: React.MutableRefObject<AbortController | null>;
  abortStreamControllerRef?: React.MutableRefObject<AbortController | null>;
};

/**
 * 构建 RPDetailChat 的 EventBus 监听器集合。
 *
 * 每个监听器都会响应统一处理器在不同阶段发射的事件，完成以下职责：
 * - 监控预处理/分析阶段并更新 Loading UI。
 * - 监听 AnalysisEngine 结果，确保新对话下发 chatId、补全会话列表标题。
 * - 捕获 runtime/input 快照，供取消请求时做状态上报。
 * - 转发 AbortController 的创建/释放事件到引用，方便 UI 触发取消。
 */
export const createRPDetailEventListeners = ({
  setCreatingConversationLoading,
  setAnalyzingLoading,
  setChatId,
  onAddConversation,
  clearLoading,
  onRefresh,
  runtimeStateRef,
  inputRef,
  abortControllerRef,
  abortStreamControllerRef,
}: DetailListenerOptions) => {
  return (eventBus: ChatProcessEventBus) => {
    let isNewConversation = false; // 记录是否正在处理新会话

    const cleanupLogListeners = registerProcessLogListeners(eventBus, {
      level: ChatLogLevel.INFO,
      formatter: (level, process, message, data) => {
        return `📝 [RPDetailChat] [${level.toUpperCase()}] [${process}] ${message} ${data ? JSON.stringify(data) : ''}`;
      },
    });

    const handleQuestionReceived = ({ questions }: { questions: string[] }) => {
      // 目前只做日志输出，后续可接入 UI 提示
      console.log('🤔 RPDetailChat 问题拆解:', questions);
    };

    const handleAnalysisStart = ({ chatId }: { chatId: string }) => {
      console.log('🔍 RPDetailChat 分析开始:', { chatId });
      isNewConversation = !chatId;

      if (!chatId) {
        setCreatingConversationLoading();
      } else {
        setAnalyzingLoading();
      }
    };

    const handleAnalysisSuccess = ({ result }: { result: AnalysisEngineResponse }) => {
      console.log('✅ RPDetailChat 分析完成:', {
        chatId: result?.chatId,
        rawSentenceID: result?.rawSentenceID,
      });

      if (result?.chatId) {
        setChatId(result.chatId);
      }

      if (isNewConversation && result?.chatId) {
        // 优先使用分析重写后的问句，降级到原始输入
        const title =
          result?.itResult?.rewrite_sentence?.trim() || inputRef?.current?.content?.toString().trim() || 'New Chat';

        onAddConversation({
          id: result.chatId,
          title,
          updateTime: new Date().toLocaleString(),
        });
      }
    };

    const handleRuntimeUpdated = ({ runtime, input }) => {
      if (runtimeStateRef && runtime) {
        runtimeStateRef.current = runtime;
      }

      if (inputRef && input) {
        inputRef.current = input as RPDetailSendInput;
      }
    };

    const handleError = ({ error, phase }: { error: Error; phase: string }) => {
      console.error(`❌ RPDetailChat ${phase} 阶段错误:`, error.message);
      clearLoading();
    };

    const handleComplete = () => {
      console.log('✅ RPDetailChat 流程完成');
      clearLoading();
      onRefresh?.();
    };

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

    eventBus.on('question:received', handleQuestionReceived);
    eventBus.on('analysis:start', handleAnalysisStart);
    eventBus.on('analysis:success', handleAnalysisSuccess);
    eventBus.on('runtime:updated', handleRuntimeUpdated);
    eventBus.on('error', handleError);
    eventBus.on('complete', handleComplete);

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
      eventBus.off('question:received', handleQuestionReceived);
      eventBus.off('analysis:start', handleAnalysisStart);
      eventBus.off('analysis:success', handleAnalysisSuccess);
      eventBus.off('runtime:updated', handleRuntimeUpdated);
      eventBus.off('error', handleError);
      eventBus.off('complete', handleComplete);

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
