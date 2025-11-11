import { ConversationsProps } from '@ant-design/x';
import classNames from 'classnames';
import { AIChatHistory, ApiResponseForWFC } from 'gel-api';
import { useConversationsInfiniteScroll } from 'gel-ui';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createChatRequest, requestToChat } from '../../../api';
import { selectConversationsItems, setConversationsItems, useAppDispatch, useAppSelector } from '../../../store';
import { groupConversation } from './handle';
import styles from './index.module.less';
import { InfiniteScrollConversations } from './InfiniteScrollConversations';

/**
 * 处理 base conversations 的渲染
 */

const processConversations = (conversations: Partial<AIChatHistory>[]): ConversationsProps['items'] => {
  return conversations
    .map((conversation) => {
      if (!conversation.groupId) {
        console.error('conversation.groupId is required', conversation);
        return null;
      }
      return {
        ...groupConversation(conversation),
        key: conversation.groupId || '',
        label: conversation.questions || `对话 ${conversation.groupId}`,
      };
    })
    .filter((conversation) => conversation !== null);
};

// 创建请求函数
const requestFunc = createChatRequest('selectChatAIConversation');

export interface ChatConversationReportProps {
  collapse?: boolean;
}

export const ChatConversationReport: React.FC<ChatConversationReportProps> = ({ collapse }) => {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId?: string }>();

  // Redux conversations state
  const conversationsItems = useAppSelector(selectConversationsItems);
  const dispatch = useAppDispatch();
  // 目前不使用收藏功能，移除相关依赖

  /**
   * 使用统一的会话无限滚动 hook 处理加载和删除逻辑
   */
  const { loading, loadingMore, hasMore, loadMore, handleDeleteConversation, reload } = useConversationsInfiniteScroll<
    AIChatHistory,
    ApiResponseForWFC<AIChatHistory[]>
  >({
    // 请求函数
    requestFn: async (params) => {
      return await requestFunc({
        ...params,
        clientType: 'aireport',
      });
    },
    deleteConversationFn: async (id) => {
      await requestToChat('delChatGroup', { groupIds: [id] });
    },
    // 从结果中提取数据
    getDataFromResult: (result) => result?.Data || [],
    // 判断是否有更多数据
    hasMoreFn: (result) => {
      const list = result?.Data || [];
      const total = result?.Page?.Records || 0;

      if (!list.length) return false;

      // 如果已加载的数据数量小于总数，还有更多数据
      return list.length < total;
    },
    // 更新 context 中的会话列表数据
    updateConversationsItems: (items) => dispatch(setConversationsItems(items)),
    // 当前选中的会话 ID 从路由读取
    currentId: chatId || '',
    // 当需要更新选中的会话 ID 时路由跳转
    onCurrentIdChange: (id) => navigate(`/chat/${id}`),
    // 当会话列表为空时跳转首页
    createNewConversation: () => navigate('/home'),
    // 请求参数字段配置
    paramConfig: {
      pageNoKey: 'pageIndex',
      pageSizeKey: 'pageSize',
      pageSize: 20,
    },
  });

  // 移除重命名逻辑

  const processedItems = useMemo(() => {
    return processConversations(conversationsItems);
  }, [conversationsItems]);

  const handleConversationClick = (key: string) => navigate(`/chat/${key}`);

  return (
    <div className={classNames(styles.menu, { [styles['menu--collapse']]: collapse })}>
      {!collapse && (
        <InfiniteScrollConversations
          items={processedItems}
          hasMore={hasMore}
          loading={loading || loadingMore}
          loadMoreItems={loadMore}
          activeKey={chatId || ''}
          onReload={reload}
          onActiveChange={handleConversationClick}
          onDeleteConversation={handleDeleteConversation}
        />
      )}
    </div>
  );
};
