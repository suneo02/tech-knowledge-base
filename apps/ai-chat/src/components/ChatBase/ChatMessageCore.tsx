import { axiosInstance } from '@/api/axios'
import { entWebAxiosInstance } from '@/api/entWeb'
import { BubbleListProps } from '@ant-design/x/es/bubble/BubbleList'
import { MessageInfo } from '@ant-design/x/es/use-x-chat'
import {
  ChatActions,
  MessageParsedCore,
  MessageRaw,
  PlaceholderPromptsComp,
  ScrollToBottomButton,
  useBubbleItems,
  UseChatRestoreResult,
  useEmbedMode,
  useScrollToBottom,
} from 'ai-ui'
import { Spin } from 'antd'
import cn from 'classnames'
import { intl, t } from 'gel-util/intl'
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
  }: ChatMessageCoreProps<T> & Pick<UseChatRestoreResult, 'bubbleLoading'>) => {
    // 深度思考模式状态，可以是 1 或 undefined
    const [deepthink, setDeepthink] = useState<MessageRaw['think']>(initialDeepthink ?? undefined)

    const { isEmbedMode = false } = useEmbedMode()

    // 用于确保初始消息只发送一次的标记
    const initialMessageSentRef = useRef(false)
    const [searchParams, setSearchParams] = useSearchParams() // 获取/设置 URL 查询参数

    // 使用滚动控制 hook
    const { chatContainerRef, showScrollBottom, scrollToBottom } = useScrollToBottom({
      parsedMessages,
      isChating,
    })

    // 包装发送消息函数，添加自动滚动到底部功能
    const handleSendMessage = useCallback(
      (message: string, agentId?: MessageRaw['agentId'], think?: MessageRaw['think']) => {
        sendMessage(message, agentId, think)
        // 发送消息后立即滚动到底部
        setTimeout(scrollToBottom, 50)
      },
      [sendMessage, scrollToBottom]
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
      axiosInstance,
      entWebAxiosInstance,
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
          <div ref={chatContainerRef} className={cn(styles.chatContainer, styles.chatContainerTop)}>
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
              className={styles.chatActions}
              placeholder={
                isChating
                  ? t('421517', '正在回答')
                  : parsedMessages?.length > 0
                    ? t('421516', '您可以继续提问')
                    : t('421515', '有什么可以帮你?')
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
          <div className={styles.footer}>{intl('451199', '内容由AI生成，仅供参考，请检查数据和信息的正确性')}</div>
        </div>
      </Spin>
    )
  }
)
