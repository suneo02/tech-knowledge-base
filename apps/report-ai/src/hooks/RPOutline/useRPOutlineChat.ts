import { parseRPOutlineMessage } from '@/components/ChatRPOutline/parsers';
import { addConversationItem, useAppDispatch } from '@/store';
import { RPOutlineAgentMsg } from '@/types';
import { RPOutlineMsgParsed, RPOutlineSendInput } from '@/types/chat/RPOutline';
import { useXChat } from '@ant-design/x';
import { DefaultMessageInfo } from '@ant-design/x/es/use-x-chat';
import { useChatRoomContext } from 'ai-ui';
import { createConfiguredXRequest } from 'gel-ui';
import { useCallback, useMemo, useRef } from 'react';
import { getApiPrefix, getWsid } from '../../utils';
import { useReportConversationManager } from '../useRPConversationManager';
import { useRPOutlineXAgent } from './useRPOutlineXAgent';

/**
 * 报告大纲聊天钩子实现 - 基于统一处理器架构
 *
 * 重构说明：
 * - 简化了多个 hook 的复杂组合关系
 * - 基于统一处理器，自动化状态管理和错误处理
 * - 集成 EventBus 日志系统，提供完整的可观测性
 * - 封装内部复杂性，提供简洁统一的外部接口
 *
 * 核心优化：
 * 1. 统一的错误处理和资源管理
 * 2. 自动化的状态同步和更新
 * 3. 完整的日志追踪和监控
 * 4. 简化的依赖注入和配置管理
 *
 * @param defaultMessages - 默认消息列表
 * @returns 完整的聊天功能接口，包含 loadingText 状态
 */
export const useRPOutlineChat = (defaultMessages?: DefaultMessageInfo<RPOutlineAgentMsg>[]) => {
  // 从聊天室上下文获取聊天状态和ID管理函数

  // 使用会话管理 hook
  const dispatch = useAppDispatch();
  const { refreshConversations } = useReportConversationManager();

  const { chatId } = useChatRoomContext();

  // 控制正在进行的请求（用于取消）的引用
  // 注意：现在这些将通过统一处理器的回调来管理
  const abortControllerRef = useRef<AbortController | null>(null);
  const abortStreamControllerRef = useRef<AbortController | null>(null);

  // 优化的会话管理回调，集成到 Redux store
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

  // 配置请求创建器，带有中止信号
  const { create } = useMemo(() => {
    return createConfiguredXRequest(() => abortStreamControllerRef.current?.signal, getWsid(), getApiPrefix());
  }, []);

  /**
   * 使用合并后的统一 XAgent Hook
   * 集成了原 useRPOutlineChatSetup 和 useRPOutlineXAgent 的所有功能
   * entities 和 latestResult 现在由统一处理器内部的 RuntimeState 管理
   */
  const { agent, content, loadingText, setContent, cancelRequest } = useRPOutlineXAgent({
    abortControllerRef,
    abortStreamControllerRef,
    create,
    onAddConversation: handleAddConversation,
    onRefresh: refreshConversations,
  });

  /**
   * 使用智能体初始化聊天功能
   * 简化了配置，基于统一处理器的优化架构
   */
  const {
    onRequest,
    parsedMessages,
    setMessages,
    messages: agentMessages,
  } = useXChat<RPOutlineAgentMsg, RPOutlineMsgParsed, { message: RPOutlineSendInput }, RPOutlineAgentMsg>({
    agent,
    parser: parseRPOutlineMessage,
    defaultMessages,
  });

  const sendMessage = useCallback(
    (messageInput: RPOutlineSendInput) => {
      // 创建用户消息对象，添加到消息列表中
      // 自动添加 clientType 和默认值
      onRequest({
        role: 'user',
        think: 0,
        status: 'finish',
        chatId,
        clientType: 'aireport',
        ...messageInput,
      });
    },
    [onRequest, chatId]
  );

  // 返回聊天状态和交互功能
  return {
    content, // 当前输入内容
    loadingText, // 当前加载状态文本
    agentMessages, // 原始消息列表
    parsedMessages, // 准备显示的已处理消息
    handleContentChange: setContent, // 更新输入内容
    sendMessage, // 发送新消息功能
    setMessages, // 直接更新消息状态
    cancelRequest, // 取消正在进行的请求
  };
};
