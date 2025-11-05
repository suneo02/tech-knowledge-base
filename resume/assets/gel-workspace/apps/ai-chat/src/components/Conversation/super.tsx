import { requestToSuperlistFcs } from '@/api'
import { createSuperlistRequestFcs } from '@/api/handleFcs'
import { useChatRoomSuperContext } from '@/contexts/ChatRoom/super'
import { useConversationsInfiniteScroll } from '@/hooks/useConversationsInfiniteScroll'
import { LogoSection, useConversationsSuper } from 'ai-ui'
import { ApiResponseForSuperlistWithPage, SuperChatHistoryItem } from 'gel-api'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConversationCore } from './core'
import { processSuperConversations } from './processSuperConversations'

interface SuperConversationProps {}

// 创建请求函数
const requestFunc = createSuperlistRequestFcs('conversation/conversationList')

export const ChatConversationSuper: React.FC<SuperConversationProps> = () => {
  const { roomId, isChating } = useChatRoomSuperContext()
  const navigate = useNavigate()

  // 先获取context中的方法和数据，避免闭包问题
  const { updateConversationsItems, conversationsItems } = useConversationsSuper()

  /**
   * 使用统一的会话无限滚动 hook 处理加载和删除逻辑
   */
  const { loading, loadingMore, hasMore, loadMore, handleDeleteConversation } = useConversationsInfiniteScroll<
    SuperChatHistoryItem,
    ApiResponseForSuperlistWithPage<SuperChatHistoryItem>
  >({
    // 请求函数
    requestFn: requestFunc,
    deleteConversationFn: async (id) => {
      await requestToSuperlistFcs('conversation/delConversation', {
        conversationId: id,
      })
    },
    // 从结果中提取数据
    getDataFromResult: (result) => result?.Data?.list || [],
    // 判断是否有更多数据
    hasMoreFn: (result) => {
      const list = result?.Data?.list || []
      const total = result?.Data?.page?.total || 0

      if (!list.length) return false

      // 如果已加载的数据数量小于总数，还有更多数据
      return list.length < total
    },
    // 更新 context 中的会话列表数据
    updateConversationsItems,
    // 当前选中的会话 ID
    currentId: roomId,
    // 当需要更新选中的会话 ID 时的回调函数
    onCurrentIdChange: (id) => {
      navigate(`/super/chat/${id}`)
    },
    // 当会话列表为空时创建新会话的函数
    createNewConversation: () => {
      navigate('/super/chat')
    },
    // 请求参数字段配置
    paramConfig: {
      pageNoKey: 'pageNo',
      pageSizeKey: 'pageSize',
      pageSize: 20,
    },
  })

  const processedItems = useMemo(() => {
    return processSuperConversations(conversationsItems)
  }, [conversationsItems])

  return (
    <ConversationCore
      logo={<LogoSection onLogoClick={() => navigate('/super')} showCollapse />}
      roomId={roomId}
      isChating={isChating}
      onRoomIdChange={(id) => {
        navigate(`/super/chat/${id}`)
      }}
      items={processedItems}
      hasMore={hasMore}
      loadMoreItems={loadMore}
      loading={loading || loadingMore}
      onDeleteConversation={handleDeleteConversation}
      onAddConversation={() => {
        navigate(`/super`)
      }}
    />
  )
}
