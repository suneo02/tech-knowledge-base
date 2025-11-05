import { axiosInstance } from '@/api/axios'
import { entWebAxiosInstance } from '@/api/entWeb'
import { Bubble } from '@ant-design/x'
import { MessageInfo } from '@ant-design/x/es/use-x-chat'
import {
  ChatActions,
  createBubbleItemsByParsedMessages,
  createDefaultMessages,
  MessageParsedCore,
  MessageRaw,
  PlaceholderPromptsComp,
  ScrollToBottomButton,
  useBubbleItems,
  UseChatRestoreResult,
  useEmbedMode,
  useScrollToBottom,
} from 'ai-ui'

import cn from 'classnames'
import { t } from 'gel-util/intl'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './ChatMessageCore.module.less'
import { useVirtualChat } from './hooks'
import { useInViewport } from 'ahooks'
import { Spin } from '@wind/wind-ui'

const intlMap = {
  footer: t('451199', '内容由AI生成，仅供参考，请检查数据和信息的正确性'),
  roleName: t('451214', 'AI问企业'),
  loading: t('421517', '正在回答'),
  continue: t('421516', '您可以继续提问'),
  placeholder: t('421515', '有什么可以帮你?'),
}

// 定义本地的 BubbleListProps 类型
interface BubbleListProps {
  items: any[]
  roles: any
  className?: string
  [key: string]: any
}

// 在 Bubble.List 组件中添加 console.log，移到组件外部
const BubbleListWithLog = memo<BubbleListProps>(({ items, roles, ...props }: BubbleListProps) => {

  return <Bubble.List items={items} roles={roles} {...props} />
})

BubbleListWithLog.displayName = 'BubbleListWithLog'

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
  initialDeepthink?: MessageRaw['think'] | null
  /** 是否正在聊天 */
  isChating: boolean
  /** 占位组件类型 */
  PlaceholderNode: PlaceholderPromptsComp
  /** 当有会话ID但无消息时是否显示占位内容 */
  showPlaceholderWhenEmpty?: boolean
  /** 内容 */
  content: string
  /** 解析后的消息 */
  parsedMessages: MessageInfo<MessageParsedCore>[]
  /** 处理内容变化 */
  handleContentChange: (content: string) => void
  /** 发送消息 */
  sendMessage: (message: string, agentId?: MessageRaw['agentId'], think?: MessageRaw['think']) => void
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
const ChatMessageCore = memo(
  <T extends BubbleListProps['roles'] = BubbleListProps['roles']>({
    roles,
    chatId,
    initialMessage,
    initialDeepthink,
    isChating,
    PlaceholderNode,
    showPlaceholderWhenEmpty = false,
    content,
    parsedMessages,
    handleContentChange,
    sendMessage,
    cancelRequest,
    bubbleLoading,
    hasMore,
    onLoadMore,
  }: ChatMessageCoreProps<T> & Pick<UseChatRestoreResult, 'bubbleLoading'>) => {
    const location = useLocation()

    // 深度思考模式状态，可以是 1 或 undefined
    const [deepthink, setDeepthink] = useState<MessageRaw['think']>(initialDeepthink ?? undefined)
    const [showLoadingMore, setShowLoadingMore] = useState(false)

    // 首页数据渲染后会滚动到底部 为了防止加载更多历史消息立即触发，使用 setTimeout 延迟加载更多显示
    useEffect(() => {
      if (!bubbleLoading) {
        setTimeout(() => {
          setShowLoadingMore(true)
        }, 1000)
      } else {
        setTimeout(() => {
          setShowLoadingMore(false)
        }, 1000)
      }
    }, [bubbleLoading])
    const { isEmbedMode = false } = useEmbedMode()

    // 用于确保初始消息只发送一次的标记
    const initialMessageSentRef = useRef(false)

    // 使用滚动控制 hook
    const { chatContainerRef, showScrollBottom, scrollToBottom } = useScrollToBottom({
      parsedMessages,
      isChating,
      hasMore,
      bubbleLoading,
      onLoadMore,
      loadMoreThreshold: 100,
    } as any)

    // 包装发送消息函数，添加自动滚动到底部功能
    const handleSendMessage = useCallback(
      (message: string, agentId?: MessageRaw['agentId'], think?: MessageRaw['think']) => {
        sendMessage(message, agentId, think)
        // 发送消息后立即滚动到底部
        setTimeout(() => {
          scrollToBottom()
        }, 50)
      },
      [sendMessage, scrollToBottom]
    )

    // 稳定传递给 useBubbleItems 的 sendMessage 函数
    const stableSendMessage = useCallback(
      (message: string) => sendMessage(message, undefined, deepthink),
      [sendMessage, deepthink]
    )

    // 稳定 PlaceholderNode 的引用
    const stablePlaceholderNode = useMemo(() => PlaceholderNode, [PlaceholderNode])

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
        sendMessage(initialMessage, undefined, deepthink)
      }
    }, [initialMessage, sendMessage, deepthink])

    // 立即清除 URL 参数，避免页面刷新导致重复处理
    useEffect(() => {
      if (initialMessage) {
        const searchParams = new URLSearchParams(location.search)
        if (searchParams.has('initialMsg') || searchParams.has('initialDeepthink')) {
          searchParams.delete('initialMsg')
          searchParams.delete('initialDeepthink')
          window.history.replaceState(
            {},
            '',
            `${location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
          )
        }
      }
    }, [initialMessage, location])

    // 气泡项处理逻辑
    const { bubbleItems } = useBubbleItems(
      axiosInstance,
      entWebAxiosInstance,
      parsedMessages,
      chatId,
      showPlaceholderWhenEmpty,
      stablePlaceholderNode,
      stableSendMessage,
      isEmbedMode,
      intlMap.roleName
    )

    // 使用 useRef 来缓存分组对象

    const historyGroupedItems = useRef<(typeof bubbleItems)[]>([])
    const isFirstLoad = useRef(true)

    const defaultBubbleItems = useMemo(() => {

      return createBubbleItemsByParsedMessages(createDefaultMessages())
    }, [])

    // 对 bubbleItems 进行分组 用户消息作为分组界限，并缓存分组结果
    const groupedBubbleItems = useMemo(() => {
      let groups: (typeof bubbleItems)[] = []


      if (!hasMore) {
        groups = [defaultBubbleItems]
      }

      if (bubbleItems.length === 0) {

        return groups
      }



      if (isFirstLoad.current) {

        // 更新第一组缓存
        historyGroupedItems.current = [bubbleItems]
        // 首次加载，直接将整个 bubbleItems 作为一个组
        groups = [...groups, ...historyGroupedItems.current]
        isFirstLoad.current = false

        return groups
      }

      // 没有历史记录，用户发送第一条消息时的处理，更新第一组缓存 
      const isFirst = bubbleItems.filter((i) => i.role === 'user').length === 1// 判断是否是第一次发送消息
      if (isFirst) {
        historyGroupedItems.current[0] = bubbleItems
        groups = [...groups, ...historyGroupedItems.current]
        return groups
      }

      let lastIndex
      if (historyGroupedItems.current.length > 0) {
        const latestHistoryGroup = historyGroupedItems.current[0] // 最早的历史组
        const nextHistoryGroup = historyGroupedItems.current[historyGroupedItems.current.length - 1] // 最新的历史组

        const firstKey = latestHistoryGroup[0]?.key // 最早的历史组的第一条消息的key
        const lastKey = nextHistoryGroup[nextHistoryGroup.length - 1]?.key // 最新的历史组的最后一条消息的key

        const firstIndex = bubbleItems.findIndex((i) => i.key === firstKey) // 最早的历史组第一条消息在bubbleItems中的索引
        lastIndex = bubbleItems.findIndex((i) => i.key === lastKey) // 最新的历史组最后一条消息在bubbleItems中的索引

        const newHistoryGroup = firstIndex > 0 ? bubbleItems.slice(0, firstIndex) : [] // 新的历史组

        // 有新的分页数据，更新历史缓存组
        if (newHistoryGroup.length > 0) {
          historyGroupedItems.current = [newHistoryGroup, ...historyGroupedItems.current]
        }
        groups = [...groups, ...historyGroupedItems.current]
      }

      // 历史后面的消息进行分组group
      let tempGroup: typeof bubbleItems = []
      for (let i = lastIndex + 1; i < bubbleItems.length; i++) {
        const item = bubbleItems[i]
        if (item.role === 'user') {
          if (tempGroup.length > 0) {
            const newGroup = [...tempGroup]
            groups.push(newGroup)
          }
          tempGroup = [item]
        } else {
          tempGroup.push(item)
        }
      }
      if (tempGroup.length > 0) {
        const newGroup = [...tempGroup]
        groups.push(newGroup)
      }

      return groups
    }, [bubbleItems, hasMore])


    const loadingMoreRef = useRef(null)
    useInViewport(loadingMoreRef, {
      root: chatContainerRef,
      rootMargin: '0px', //根(root)元素的外边距
      threshold: 1, // 触发回调的阈值
      callback: ({ isIntersecting }) => {
        if (isIntersecting && hasMore && !bubbleLoading) {
          onLoadMore?.()
          // onLoadMore 后向下滚动 50px
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop += 20
          }
        }
      },
    })

    // 虚拟滚动配置
    const rowVirtualizer = useVirtualChat(groupedBubbleItems, chatContainerRef)

    const VirtualBubbleList = useMemo(() => {
      return (
        <div ref={chatContainerRef} className={cn(styles.chatContainer, styles.chatContainerTop)}>
          {/* 加载更多消息的指示器 */}
          {showLoadingMore && !bubbleLoading && hasMore && (
            <div className={styles.loadingMoreIndicator} ref={loadingMoreRef}>
              <Spin size="small" />
            </div>
          )}
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {

              return (
                <div
                  key={`${virtualRow.index}-${virtualRow.start}-${virtualRow.size}`}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualRow.index}
                  style={{
                    position: 'relative',
                    top: 0,
                    left: 0,
                    width: '100%',
                    // transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <BubbleListWithLog
                    className={cn(styles.bubbleListContainer, 'bubble-list-container')}
                    items={groupedBubbleItems[virtualRow.index]}
                    roles={roles}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )
    }, [groupedBubbleItems, showLoadingMore, rowVirtualizer, bubbleLoading, hasMore])

    return (
      <div className={styles.chat}>
        {/* @ts-expect-error */}
        <Spin spinning={bubbleLoading} wrapperClassName={styles.spinContainer}>
          {/* 使用独立的滚动到底部按钮组件 */}
          <ScrollToBottomButton
            style={{ bottom: '100px', right: '20px' }}
            visible={showScrollBottom}
            onClick={scrollToBottom}
          />
          {VirtualBubbleList}
          {/* 聊天操作区域 */}
          <div className={cn(styles.chatActionsContainer, styles.chatContainerTop)}>
            <ChatActions
              className={styles.chatActions}
              placeholder={
                isChating ? intlMap.loading : parsedMessages?.length > 0 ? intlMap.continue : intlMap.placeholder
              }
              isLoading={isChating}
              content={content}
              senderClassName={styles.sender}
              onCancel={cancelRequest}
              handleContentChange={handleContentChange}
              sendMessage={handleSendMessage}
              deepthink={deepthink === 1}
              setDeepthink={(value: boolean) => setDeepthink(value ? 1 : undefined)}
            />
          </div>
          <div className={styles.footer}>{intlMap.footer}</div>
        </Spin>
      </div>
    )
  }
)

ChatMessageCore.displayName = 'ChatMessageCore'

export default ChatMessageCore
