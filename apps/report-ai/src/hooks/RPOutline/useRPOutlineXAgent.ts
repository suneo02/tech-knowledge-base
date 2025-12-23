import { axiosInstance } from '@/api/axios';
import { entWebAxiosInstance } from '@/api/entWeb';
import { RPOutlineAgentMsg, RPOutlineSendInput } from '@/types/chat/RPOutline';
import useXAgent, { XAgent, XAgentConfig } from '@ant-design/x/es/use-x-agent';
import { useChatRoomContext } from 'ai-ui';
import { RuntimeState, useAIChatSendState, useCancelChatReq, XRequestClass } from 'gel-ui';
import { generateUrlByModule, LinkModule } from 'gel-util/link';
import { useCallback, useMemo, useRef } from 'react';
import { isDev } from '../../utils';
import { createRPOutlineEventListeners } from './outlineListeners';
import { createRPOutlineXAgentReq } from './xAgentReq';

/**
 * RPOutline XAgent Hook - 统一的聊天处理器
 *
 * 合并说明：
 * - 整合了 useRPOutlineChatSetup 和原 useRPOutlineXAgent 的功能
 * - 提供完整的状态管理、URL更新、会话初始化功能
 * - 基于统一处理器架构，自动化错误处理和资源管理
 * - 集成 EventBus 日志系统，提供完整的可观测性
 * - 简化外部依赖，提供更直观的使用接口
 */

type UseRPOutlineXAgentOptions = {
  // 控制器引用（用于取消请求）
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  abortStreamControllerRef: React.MutableRefObject<AbortController | null>;

  // 网络请求配置
  create: XRequestClass['create'];

  // 会话管理回调
  onAddConversation: (conversation: { id: string; title: string; updateTime: string }) => void;
  onRefresh?: () => void;
};

type UseRPOutlineXAgentReturn = {
  // XAgent 实例
  agent: XAgent<RPOutlineAgentMsg, { message: RPOutlineSendInput }, RPOutlineAgentMsg>;

  // 状态管理（来自 useRPOutlineChatSetup）
  content: string;
  loadingText: string;
  setContent: (content: string) => void;

  // 取消请求功能 - 基于 RuntimeState 的智能取消
  cancelRequest: () => void;
};

export const useRPOutlineXAgent = (options: UseRPOutlineXAgentOptions): UseRPOutlineXAgentReturn => {
  // 从聊天室上下文获取聊天状态和ID管理函数
  const { setChatId, setIsChating } = useChatRoomContext();

  const { abortControllerRef, abortStreamControllerRef, create, onAddConversation, onRefresh } = options;

  // 用于存储 RuntimeState 和 input 的 ref，供取消请求时使用
  const runtimeStateRef = useRef<RuntimeState | null>(null);
  const inputRef = useRef<RPOutlineSendInput | null>(null);

  // 集成状态管理功能（来自 useRPOutlineChatSetup）
  const { content, loadingText, setContent, clearLoading, setCreatingConversationLoading, setAnalyzingLoading } =
    useAIChatSendState();

  /**
   * 更新 URL 以包含新的 chat id
   * 封装 URL 更新逻辑，简化外部调用
   */
  const updateUrlWithChatId = useCallback(
    (chatIdNew: string) => {
      setChatId(chatIdNew);
      let url = generateUrlByModule({
        module: LinkModule.AI_REPORT_OUTLINE_CHAT,
        isDev,
        params: { chatId: chatIdNew },
      });

      if (url) {
        window.history.replaceState(null, '', url);
      }
    },
    [setChatId]
  );

  // 创建统一处理器，整合两个 hook 的功能
  const unifiedHandler = useMemo(() => {
    // 直接使用统一的事件监听器，包含所有功能
    const registerEventListeners = createRPOutlineEventListeners({
      setCreatingConversationLoading,
      setAnalyzingLoading,
      updateUrlWithChatId,
      onAddConversation,
      clearLoading,
      onRefresh,
      runtimeStateRef, // 传递 runtimeStateRef 用于同步状态
      inputRef, // 传递 inputRef 用于同步输入
      abortControllerRef, // 传递 AbortController ref
      abortStreamControllerRef, // 传递 Stream AbortController ref
    });

    return createRPOutlineXAgentReq(
      {
        // 基础依赖
        setContent,
        setIsChating,
        create,

        // 统一的 EventBus 事件监听器（包含所有功能）
        registerEventListeners,
      },
      {
        // 静态配置
        axiosInstance: axiosInstance,
        axiosEntWeb: entWebAxiosInstance,
        isDev,
      }
    );
  }, [
    setContent,
    setIsChating,
    create,
    abortControllerRef,
    abortStreamControllerRef,
    updateUrlWithChatId,
    onAddConversation,
    clearLoading,
    setCreatingConversationLoading,
    setAnalyzingLoading,
    onRefresh,
    runtimeStateRef,
    inputRef,
  ]);

  // 统一处理器请求函数 - 直接使用 RPOutlineSendInput，无需适配器
  const request: NonNullable<
    XAgentConfig<RPOutlineAgentMsg, { message: RPOutlineSendInput }, RPOutlineAgentMsg>['request']
  > = async ({ message: messageInput }, { onSuccess: onAgentSuccess, onUpdate: onAgentUpdate }) => {
    if (!messageInput?.content) {
      setIsChating(false);
      return;
    }

    // 构建统一输入，确保包含必要的字段
    const unifiedInput = {
      ...messageInput,
      chatId: messageInput.chatId,
      clientType: messageInput.clientType || 'aireport',
      fileIds: messageInput.files?.map((item) => item.fileId),
      refFileIds: messageInput.refFiles?.map((item) => item.fileId),
    };

    // @ts-expect-error 保持原有的类型兼容性
    delete unifiedInput.role;
    // @ts-expect-error 保持原有的类型兼容性
    delete unifiedInput.status;
    delete unifiedInput.files;
    delete unifiedInput.refFiles;
    await unifiedHandler?.(unifiedInput, {
      onSuccess: onAgentSuccess,
      onUpdate: onAgentUpdate,
      onError: (error: Error) => {
        console.error('RPOutline 统一处理器错误:', error);
        setIsChating(false);
      },
    });
  };

  // 使用请求处理器初始化智能体
  const [agent] = useXAgent<RPOutlineAgentMsg, { message: RPOutlineSendInput }, RPOutlineAgentMsg>({
    request,
  });

  // 使用简化的取消请求 Hook
  const cancelRequest = useCancelChatReq({
    setIsChating,
    abortControllerRef,
    abortStreamControllerRef,
    runtimeStateRef,
    inputRef,
    axiosInstance,
    onRefresh,
  });

  // 返回合并后的完整接口
  return {
    // XAgent 实例
    agent,

    // 状态管理（来自 useRPOutlineChatSetup）
    content,
    loadingText,
    setContent,

    // 取消请求功能
    cancelRequest,
  };
};
