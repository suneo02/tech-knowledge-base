import { axiosInstance } from '@/api/axios';
import { entWebAxiosInstance } from '@/api/entWeb';
import { RPDetailLeftAgentMsg, RPDetailLeftAgentMsgUser, RPDetailSendInput } from '@/types/chat/RPDetailLeft';
import useXAgent, { XAgent, XAgentConfig } from '@ant-design/x/es/use-x-agent';
import { useChatRoomContext } from 'ai-ui';
import { RuntimeState, useAIChatSendState, useCancelChatReq, XRequestClass } from 'gel-ui';
import { useMemo, useRef } from 'react';
import { isDev } from '../../utils';
import { createRPDetailEventListeners } from './detailListeners';
import { createRPDetailXAgentReq } from './xAgentReq';

type UseRPDetailXAgentOptions = {
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  abortStreamControllerRef: React.MutableRefObject<AbortController | null>;
  create: XRequestClass['create'];
  onAddConversation: (conversation: { id: string; title: string; updateTime: string }) => void;
  onRefresh?: () => void;
};

type UseRPDetailXAgentReturn = {
  agent: XAgent<RPDetailLeftAgentMsg, { message: RPDetailSendInput }, RPDetailLeftAgentMsg>;
  content: string;
  loadingText: string;
  setContent: (content: string) => void;
  cancelRequest: () => void;
};

/**
 * 详情聊天统一 xAgent Hook。
 *
 * 职责：
 * 1. 维护输入框 + loading 状态。
 * 2. 创建统一处理器请求函数（含 EventBus 监听）。
 * 3. 提供取消请求能力，并在取消时做状态上报。
 */
export const useRPDetailXAgent = (options: UseRPDetailXAgentOptions): UseRPDetailXAgentReturn => {
  const { setChatId, setIsChating } = useChatRoomContext();

  const { abortControllerRef, abortStreamControllerRef, create, onAddConversation, onRefresh } = options;

  const runtimeStateRef = useRef<RuntimeState | null>(null); // 记录流式运行态，供取消时上报
  const inputRef = useRef<RPDetailSendInput | null>(null); // 保存最近一次输入内容

  const { content, loadingText, setContent, clearLoading, setCreatingConversationLoading, setAnalyzingLoading } =
    useAIChatSendState();

  const registerEventListeners = useMemo(() => {
    // 构建 detail 专属的事件监听，实现 Loading、会话创建、状态同步等逻辑
    return createRPDetailEventListeners({
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
    });
  }, [
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
  ]);

  const unifiedHandler = useMemo(() => {
    // 统一处理器封装了请求全生命周期，复用 gel-ui 的流程阶段
    return createRPDetailXAgentReq(
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
    );
  }, [setContent, setIsChating, create, registerEventListeners]);

  const request: NonNullable<
    XAgentConfig<RPDetailLeftAgentMsg, { message: RPDetailSendInput }, RPDetailLeftAgentMsg>['request']
  > = async ({ message: messageInput }, { onSuccess: onAgentSuccess, onUpdate: onAgentUpdate }) => {
    if (!messageInput?.content) {
      setIsChating(false);
      return;
    }

    const unifiedInput = {
      ...messageInput,
      chatId: messageInput.chatId,
      clientType: messageInput.clientType || 'aireport',
      review: messageInput.review ?? messageInput.think,
      fileIds: messageInput.files?.map((item) => item.fileId),
      refFileIds: messageInput.refFiles?.map((item) => item.fileId),
    };

    // 删除仅在前端使用的字段，避免污染请求体
    delete (unifiedInput as Partial<RPDetailLeftAgentMsgUser>).role;
    delete (unifiedInput as Partial<RPDetailLeftAgentMsgUser>).status;
    delete (unifiedInput as Partial<RPDetailLeftAgentMsgUser>).files;
    delete (unifiedInput as Partial<RPDetailLeftAgentMsgUser>).refFiles;

    await unifiedHandler?.(unifiedInput, {
      onSuccess: onAgentSuccess,
      onUpdate: onAgentUpdate,
      onError: (error: Error) => {
        console.error('RPDetailChat 统一处理器错误:', error);
        setIsChating(false);
      },
    });
  };

  const [agent] = useXAgent<RPDetailLeftAgentMsg, { message: RPDetailSendInput }, RPDetailLeftAgentMsg>({
    request,
  });

  const cancelRequest = useCancelChatReq<RPDetailSendInput>({
    setIsChating,
    abortControllerRef,
    abortStreamControllerRef,
    runtimeStateRef,
    inputRef,
    axiosInstance,
    onRefresh,
  });

  return {
    agent,
    content,
    loadingText,
    setContent,
    cancelRequest,
  };
};
