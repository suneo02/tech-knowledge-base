import { axiosInstance } from '@/api/axios'
import { entWebAxiosInstance } from '@/api/entWeb'
import { rolesBase } from '@/components/ChatRoles/RolesBase'
import { getApiPrefix } from '@/services/request'
import { getWsidDevProd, isDev } from '@/utils/env'
import { CHAT_ROOM_ID_PREFIX, PlaceholderBase, useChatBase, useChatRestore, useChatRoomContext } from 'ai-ui'
import { ChatEntityType, ChatThinkSignal } from 'gel-api'
import { useEffect } from 'react'
import { ChatMessageCore } from './ChatMessageCore'

// 历史消息恢复的页大小
const PAGE_SIZE = 10

/**
 * 使用基础聊天hook的消息组件
 */
interface ChatMessageBaseProps {
  /** 初始消息，通常用于从其他页面跳转时带入的消息 */
  initialMessage?: string | null
  initialDeepthink?: ChatThinkSignal['think'] | null

  // AI详情页 需要额外传入的参数
  // 实体类型
  entityType?: ChatEntityType
  // 实体名称
  entityName?: string
}

export const ChatMessageBase = (props: ChatMessageBaseProps) => {
  const { chatId, roomId, isChating, index } = useChatRoomContext()

  // 获取聊天相关的状态和方法
  const { content, parsedMessages, handleContentChange, sendMessage, setMessages, cancelRequest } = useChatBase(
    axiosInstance,
    entWebAxiosInstance,
    isDev,
    getWsidDevProd(),
    getApiPrefix()
  )

  // 获取历史消息恢复状态
  const { messagesByChatRestore, bubbleLoading, loadMoreMessages, hasMore } = useChatRestore({
    axiosChat: axiosInstance,
    chatId,
    // 当 room id 含有 prefix时，说明当前会话是新创建的会话，不应恢复历史
    // 当 room id 与 chat id 相同时，说明是从历史加载的会话，应该恢复历史
    pageSize: PAGE_SIZE,
    shouldRestore: !roomId.includes(CHAT_ROOM_ID_PREFIX) && !!chatId,
    scrollToIndex: index,
  } as Parameters<typeof useChatRestore>[0])

  // 处理历史消息恢复
  useEffect(() => {
    if (messagesByChatRestore) {
      setMessages(messagesByChatRestore)
    }
  }, [messagesByChatRestore, setMessages])

  return (
    <ChatMessageCore
      {...props}
      roles={rolesBase}
      PlaceholderNode={PlaceholderBase}
      isChating={isChating}
      chatId={chatId}
      roomId={roomId}
      content={content}
      parsedMessages={parsedMessages}
      handleContentChange={handleContentChange}
      sendMessage={(message, agentId, think) => {
        sendMessage(message, agentId, think, {
          entityType: props.entityType,
          entityName: props.entityName,
        })
      }}
      cancelRequest={cancelRequest}
      bubbleLoading={bubbleLoading}
      hasMore={hasMore}
      onLoadMore={loadMoreMessages}
    />
  )
}
