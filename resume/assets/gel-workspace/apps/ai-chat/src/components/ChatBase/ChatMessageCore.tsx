import Bubble from '@ant-design/x/es/bubble'
import { BubbleListProps } from '@ant-design/x/es/bubble/BubbleList'
import { MessageInfo } from '@ant-design/x/es/use-x-chat'
import {
  ChatActions,
  CLASSNAME_USER_ROLE,
  PlaceholderPromptsComp,
  ScrollToBottomButton,
  useBubbleItems,
  UseChatRestoreResult,
  useEmbedMode,
} from 'ai-ui'
import { Spin } from 'antd'
import cn from 'classnames'
import { AgentIdentifiers, ChatThinkSignal } from 'gel-api'
import { getChatPlaceholder, MsgParsedDepre, useScrollToBottom } from 'gel-ui'
import { t } from 'gel-util/intl'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from '../ChatMessage/chatMessageShared.module.less'
/**
 * 聊天消息组件的核心，接受一个自定义的 useChat hook
 *
 * @component
 */
interface ChatMessageCoreProps<T extends BubbleListProps['roles'] = BubbleListProps['roles']> {
  /** 自定义角色配置，用于覆盖默认的角色样式和行为 */
  roles: T
  // 会话 id
  chatId: string
  // 会话房间 id 前端自己使用
  roomId: string
  /** 初始消息，通常用于从其他页面跳转时带入的消息 */
  initialMessage?: string | null
  initialDeepthink?: ChatThinkSignal['think'] | null
  /** 是否正在聊天 */
  isChating: boolean
  /** 占位组件类型 */
  PlaceholderNode: PlaceholderPromptsComp
  /** 当有会话ID但无消息时是否显示占位内容 */
  showPlaceholderWhenEmpty?: boolean
  /** 内容 */
  content: string
  /** 解析后的消息 */
  parsedMessages: MessageInfo<MsgParsedDepre>[]
  /** 处理内容变化 */
  handleContentChange: (content: string) => void
  /** 发送消息 */
  sendMessage: (message: string, agentId?: AgentIdentifiers['agentId'], think?: ChatThinkSignal['think']) => void
  /** 取消请求 */
  cancelRequest: () => void
  /** 气泡加载状态 */
  bubbleLoading?: boolean
  /** 分页相关参数 */
  hasMore?: boolean
  onLoadMore?: () => void
}
/**
 * 聊天内容组件，目前只给 ai chat base 使用
 */
export const ChatMessageCore = memo(
  <T extends BubbleListProps['roles'] = BubbleListProps['roles']>({
    roles,
    initialMessage,
    initialDeepthink,
    PlaceholderNode,
    isChating,
    chatId,
    showPlaceholderWhenEmpty = false,
    content,
    parsedMessages,
    handleContentChange,
    sendMessage,
    bubbleLoading,
    cancelRequest,
    hasMore,
    onLoadMore,
  }: ChatMessageCoreProps<T> & Pick<UseChatRestoreResult, 'bubbleLoading'>) => {
    // 深度思考模式状态，可以是 1 或 undefined
    const [deepthink, setDeepthink] = useState<ChatThinkSignal['think']>(initialDeepthink ?? undefined)

    const { isEmbedMode = false } = useEmbedMode()

    // 用于确保初始消息只发送一次的标记
    const initialMessageSentRef = useRef(false)
    const [searchParams, setSearchParams] = useSearchParams() // 获取/设置 URL 查询参数

    // 用于记录加载更多前的滚动位置
    const scrollPositionRef = useRef<{ scrollTop: number; firstVisibleElement: Element | null } | null>(null)

    // 使用滚动控制 hook
    const { chatContainerRef, showScrollBottom, scrollToBottom } = useScrollToBottom({
      parsedMessages,
      isChating,
    })

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
          onLoadMore?.()
          restoreScrollPosition()
        }
      }
    }, [hasMore, bubbleLoading, onLoadMore, recordScrollPosition])

    // 包装发送消息函数，添加自动滚动到底部功能
    const handleSendMessage = useCallback(
      (message: string, agentId?: AgentIdentifiers['agentId']) => {
        sendMessage(message, agentId, deepthink ? 1 : undefined)
        // 发送消息后立即滚动到底部
        setTimeout(scrollToBottom, 50)
      },
      [sendMessage, scrollToBottom, deepthink]
    )

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
        sendMessage(initialMessage, undefined, initialDeepthink ?? undefined)
      }
    }, [initialMessage, sendMessage, initialDeepthink])

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
      showPlaceholderWhenEmpty,
      PlaceholderNode,
      (message) => sendMessage(message, undefined, deepthink),
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
              roles={roles}
              items={bubbleItems}
            />
          </div>

          {/* 使用独立的滚动到底部按钮组件 */}
          <ScrollToBottomButton visible={showScrollBottom} onClick={scrollToBottom} />

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
)

ChatMessageCore.displayName = 'ChatMessageCore'
