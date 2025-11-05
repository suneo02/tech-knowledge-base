import { requestToChat } from '@/api'
import { createChatRequest } from '@/api/handle'
import { useConversationsInfiniteScroll } from '@/hooks/useConversationsInfiniteScroll'
import { ConversationsProps } from '@ant-design/x'
import { message } from '@wind/wind-ui'
import { initRandomRoomId, LogoSection, useChatRoomContext, useConversationsBase } from 'ai-ui'
import { ApiResponseForWFC, ChatHistoryResponse } from 'gel-api'
import { t } from 'gel-util/intl'
import { useMemo } from 'react'
import { ConversationCore } from './core'
import { groupConversation } from './handle'

/**
 * 处理 base conversations 的渲染
 */

const processConversations = (conversations: ChatHistoryResponse[]): ConversationsProps['items'] => {
  return conversations.map((conversation) => {
    return {
      ...groupConversation(conversation),
      key: conversation.groupId,
      label: conversation.questions || `对话 ${conversation.groupId}`,
    }
  })
}

// 创建请求函数
const requestFunc = createChatRequest('selectChatAIConversation')

export const ChatConversationBase: React.FC = () => {
  const { roomId, updateRoomId, isChating } = useChatRoomContext()

  // 先获取context中的方法和数据，避免闭包问题
  const { updateConversationsItems, conversationsItems } = useConversationsBase()

  /**
   * 使用统一的会话无限滚动 hook 处理加载和删除逻辑
   */
  const { loading, loadingMore, hasMore, loadMore, handleDeleteConversation, reload } = useConversationsInfiniteScroll<
    ChatHistoryResponse,
    ApiResponseForWFC<ChatHistoryResponse[]>
  >({
    // 请求函数
    requestFn: async (params) => {
      return await requestFunc(params)
    },
    deleteConversationFn: async (id) => {
      await requestToChat('delChatGroup', { groupIds: [id] })
    },
    // 从结果中提取数据
    getDataFromResult: (result) => result?.Data || [],
    // 判断是否有更多数据
    hasMoreFn: (result) => {
      const list = result?.Data || []
      const total = result?.Page?.Records || 0

      if (!list.length) return false

      // 如果已加载的数据数量小于总数，还有更多数据
      return list.length < total
    },
    // 更新 context 中的会话列表数据
    updateConversationsItems,
    // 当前选中的会话 ID
    currentId: roomId,
    // 当需要更新选中的会话 ID 时的回调函数
    onCurrentIdChange: updateRoomId,
    // 当会话列表为空时创建新会话的函数
    createNewConversation: () => {
      updateRoomId(initRandomRoomId())
    },
    // 请求参数字段配置
    paramConfig: {
      pageNoKey: 'pageIndex',
      pageSizeKey: 'pageSize',
      pageSize: 20,
    },
  })

  // 处理重命名逻辑
  const handleRenameConversation = async (id: string, newName: string): Promise<boolean> => {
    try {
      const response = await requestToChat('updateChatGroup', {
        groupId: id,
        title: newName.trim(),
      })

      if (response) {
        message.success(t('', '重命名成功'))
        // 重新加载会话列表
        await reload()

        return true
      } else {
        message.error(t('', '重命名失败'))
        return false
      }
    } catch (error) {
      console.error('重命名失败:', error)
      message.error(t('', '重命名失败'))
      return false
    }
  }

  const processedItems = useMemo(() => {
    return processConversations(conversationsItems)
  }, [conversationsItems])

  return (
    <ConversationCore
      logo={<LogoSection />}
      roomId={roomId}
      isChating={isChating}
      onRoomIdChange={updateRoomId}
      items={processedItems}
      hasMore={hasMore}
      loadMoreItems={loadMore}
      loading={loading || loadingMore}
      onReload={reload}
      onDeleteConversation={handleDeleteConversation}
      onRenameConversation={handleRenameConversation}
      onAddConversation={() => {
        updateRoomId(initRandomRoomId())
      }}
    />
  )
}
