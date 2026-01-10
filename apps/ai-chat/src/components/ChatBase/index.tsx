import { axiosInstance } from '@/api/axios'
import { entWebAxiosInstance } from '@/api/entWeb'
import { rolesBase } from '@/components/ChatRoles/RolesBase'
import { getApiPrefix } from '@/services/request'
import { getWsidDevProd, isDev } from '@/utils/env'
import Bubble from '@ant-design/x/es/bubble'
import {
  CHAT_ROOM_ID_PREFIX,
  ChatActions,
  CLASSNAME_USER_ROLE,
  PlaceholderBase,
  ScrollToBottomButton,
  useBubbleItems,
  useChatBase,
  useChatRestore,
  useChatRoomContext,
  useEmbedMode,
} from 'ai-ui'
import { Spin } from 'antd'
import cn from 'classnames'
import { AgentId, ChatEntityType, ChatThinkSignal } from 'gel-api'
import { getChatPlaceholder, useAutoScrollOnSend, useScrollToBottom } from 'gel-ui'
import { t } from 'gel-util/intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from '../ChatMessage/chatMessageShared.module.less'

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
  const { initialMessage, initialDeepthink, entityType, entityName } = props

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

  // 深度思考模式状态，可以是 1 或 undefined
  const [deepthink, setDeepthink] = useState<ChatThinkSignal['think']>(initialDeepthink ?? undefined)

  const { isEmbedMode = false } = useEmbedMode()

  // 用于确保初始消息只发送一次的标记
  const initialMessageSentRef = useRef(false)
  const [searchParams, setSearchParams] = useSearchParams()

  // 用于记录加载更多前的滚动位置
  const scrollPositionRef = useRef<{ scrollTop: number; firstVisibleElement: Element | null } | null>(null)

  // 使用滚动控制 hook
  const { chatContainerRef, showScrollBottom, scrollToBottom } = useScrollToBottom()

  // 记录当前滚动位置和第一个可见元素
  const recordScrollPosition = useCallback(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current
      const firstVisibleElement = container.querySelector(`.${CLASSNAME_USER_ROLE}`)
      scrollPositionRef.current = {
        scrollTop: container.scrollTop,
        firstVisibleElement: firstVisibleElement || null,
      }
    }
  }, [])

  // 恢复滚动位置
  const restoreScrollPosition = useCallback(() => {
    if (scrollPositionRef.current && chatContainerRef.current) {
      const container = chatContainerRef.current
      const { scrollTop, firstVisibleElement } = scrollPositionRef.current

      // 使用 requestAnimationFrame 确保 DOM 更新完成后再恢复位置
      requestAnimationFrame(() => {
        if (firstVisibleElement && firstVisibleElement.parentNode) {
          // 找到恢复后的元素位置
          const newFirstElement = container.querySelector(`.${CLASSNAME_USER_ROLE}`)
          if (newFirstElement) {
            // 计算新元素相对于容器的偏移
            const newElementTop = newFirstElement.getBoundingClientRect().top
            const containerTop = container.getBoundingClientRect().top
            const offset = newElementTop - containerTop

            // 设置滚动位置，保持用户看到的第一个元素位置不变
            container.scrollTop = offset
          }
        } else {
          // 如果没有找到特定元素，直接恢复滚动位置
          container.scrollTop = scrollTop
        }

        // 清除记录的位置
        scrollPositionRef.current = null
      })
    }
  }, [])

  // 处理滚动到顶部时触发加载更多
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current && hasMore && !bubbleLoading) {
      const { scrollTop } = chatContainerRef.current

      // 当滚动到顶部附近时（距离顶部小于等于10px）触发加载更多
      if (scrollTop === 0) {
        // 记录加载前的滚动位置
        recordScrollPosition()
        loadMoreMessages()
        restoreScrollPosition()
      }
    }
  }, [hasMore, bubbleLoading, loadMoreMessages, recordScrollPosition, restoreScrollPosition])

  // 创建包装后的发送消息函数
  const wrappedSendMessage = useCallback(
    (message: string, agentId?: AgentId, think?: ChatThinkSignal['think']) => {
      return sendMessage(message, agentId, think, {
        entityType,
        entityName,
      })
    },
    [sendMessage, entityType, entityName]
  )

  // 使用发送消息后自动滚动 hook
  const handleSendMessage = useAutoScrollOnSend({
    scrollToBottom,
    sendMessage: wrappedSendMessage,
  })

  // 处理历史消息恢复
  useEffect(() => {
    if (messagesByChatRestore) {
      setMessages(messagesByChatRestore)
    }
  }, [messagesByChatRestore, setMessages])

  // 处理初始深度思考
  useEffect(() => {
    if (initialDeepthink) {
      setDeepthink(initialDeepthink)
    }
  }, [initialDeepthink])

  // 处理初始消息发送
  useEffect(() => {
    if (initialMessage && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true
      handleSendMessage(initialMessage, undefined, initialDeepthink ?? undefined)
    }
  }, [initialMessage, handleSendMessage, initialDeepthink])

  // 立即清除 URL 参数，避免页面刷新导致重复处理
  useEffect(() => {
    if (initialMessage) {
      const newSearchParams = new URLSearchParams(searchParams)
      if (newSearchParams.has('initialMsg') || newSearchParams.has('initialDeepthink')) {
        newSearchParams.delete('initialMsg')
        newSearchParams.delete('initialDeepthink')
        setSearchParams(newSearchParams, { replace: true })
      }
    }
  }, [initialMessage, searchParams, setSearchParams])

  // 气泡项处理逻辑
  const { bubbleItems } = useBubbleItems(
    parsedMessages,
    chatId,
    false,
    PlaceholderBase,
    (message) => handleSendMessage(message, undefined, deepthink),
    isEmbedMode
  )

  return (
    <Spin spinning={bubbleLoading} wrapperClassName={styles.spinContainer}>
      <div className={styles.chat}>
        <div
          ref={chatContainerRef}
          className={cn(styles.chatContainer, styles.chatContainerTop)}
          onScroll={handleScroll}
        >
          {/* 加载更多消息的指示器 */}
          {hasMore && bubbleLoading && <Spin size="small" />}
          <Bubble.List
            className={cn(styles.bubbleListContainer, 'bubble-list-container')}
            roles={rolesBase}
            items={bubbleItems}
          />
        </div>

        {/* 使用独立的滚动到底部按钮组件 */}
        <ScrollToBottomButton visible={showScrollBottom} onClick={() => scrollToBottom()} />

        {/* 聊天操作区域 */}
        <div className={cn(styles.chatActionsContainer, styles.chatContainerTop)}>
          <ChatActions
            placeholder={getChatPlaceholder(parsedMessages, isChating)}
            isLoading={isChating}
            content={content}
            onCancel={cancelRequest}
            handleContentChange={handleContentChange}
            sendMessage={handleSendMessage}
          />
        </div>
        <div className={styles.footer}>{t('453642', '内容由AI生成，请核查重要信息')}</div>
      </div>
    </Spin>
  )
}
