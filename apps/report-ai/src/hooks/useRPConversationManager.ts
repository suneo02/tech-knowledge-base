import { addConversationItem, setConversationsItems, useAppDispatch } from '@/store';
import { useRequest } from 'ahooks';
import { createChatRequestWithAxios } from 'gel-api';
import { axiosInstance } from '../api/axios';

const selectChatAIConversationFunc = createChatRequestWithAxios(axiosInstance, 'selectChatAIConversation');

/**
 * 报告会话管理钩子
 *
 * 该钩子负责管理报告相关的会话操作：
 * - 会话列表的获取和刷新
 * - 会话项的添加和更新
 * - 第一次问句状态的跟踪
 *
 * 提供了会话管理的完整功能，包括API请求、状态更新和错误处理
 *
 * @returns 会话管理相关的状态和方法
 */
export const useReportConversationManager = () => {
  const dispatch = useAppDispatch();

  // 初始化API请求，用于获取会话列表
  const { run, loading: isLoadingConversations } = useRequest<
    Awaited<ReturnType<typeof selectChatAIConversationFunc>>,
    Parameters<typeof selectChatAIConversationFunc>
  >(selectChatAIConversationFunc, {
    manual: true,
    onError: (error) => {
      console.error('获取会话列表失败:', error);
    },
    onSuccess: (res) => {
      if (res?.Data) {
        dispatch(setConversationsItems(res.Data));
      }
    },
  });

  /**
   * 刷新会话列表
   * 获取最新的会话数据并更新列表
   */
  const refreshConversations = () => {
    run({ pageIndex: 1, pageSize: 20, clientType: 'aireport' });
  };

  /**
   * 添加新会话到列表
   * 当创建新会话时调用此方法
   *
   * @param conversation - 会话信息
   */
  const handleAddConversation = (conversation: { id: string; title: string; updateTime: string }) => {
    dispatch(
      addConversationItem({
        questionsNum: 1,
        updateTime: conversation.updateTime,
        groupId: conversation.id,
        questions: conversation.title,
      })
    );
  };

  return {
    // 状态
    isLoadingConversations, // 是否正在加载会话列表
    // 方法
    refreshConversations, // 刷新会话列表
    handleAddConversation, // 添加会话到列表
  };
};
