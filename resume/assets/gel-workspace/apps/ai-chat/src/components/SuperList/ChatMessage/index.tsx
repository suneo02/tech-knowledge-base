import { axiosInstance } from '@/api/axios'
import { entWebAxiosInstance } from '@/api/entWeb'
import { useChatRoomSuperContext } from '@/contexts/ChatRoom/super'
import { useChatSuper } from '@/hooks/useChat/super'
import { useChatSessionControl } from '@/hooks/useChatSessionControl'
import { useInitialMsgFromUrl } from '@/hooks/useInitialMsgFromUrl'
import { Bubble } from '@ant-design/x'
import {
  CHAT_ROOM_ID_PREFIX,
  ChatSender,
  MessageRaw,
  ScrollToBottomButton,
  useBubbleItems,
  useChatRestore,
  useScrollToBottom,
} from 'ai-ui'
import { Spin } from 'antd'
import cn from 'classnames'
import { t } from 'gel-util/intl'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from '../../ChatMessage/chatMessageShared.module.less'
import { PlaceholderSuper } from '../../ChatMessage/PlaceholderPrompts'
import { rolesSuper } from '../../ChatRoles/RolesSuperChat'

// 多语言文本配置
const STRINGS = {
  ANSWERING: t('421517', '正在回答'),
  CONTINUE_ASK: t('421516', '您可以继续提问'),
  HOW_CAN_HELP: t('421515', '有什么可以帮你?'),
  AI_DISCLAIMER: t('451199', '内容由AI生成，仅供参考，请检查数据和信息的正确性'),
}

// 常量定义
// 超级名单没有深度思考
const deepthink: MessageRaw['think'] = undefined

/**
 * 使用增强版聊天hook的消息组件
 */
export const ChatMessageSuper: React.FC = () => {
  const { chatId, roomId, isChating, sheetList, activeTableSheetsVersion } = useChatRoomSuperContext()
  const [searchParams, setSearchParams] = useSearchParams()

  // 直接从 URL 获取初始消息
  const { initialMessage, hasInitialMessage } = useInitialMsgFromUrl()

  // 获取聊天相关的状态和方法
  const { content, parsedMessages, handleContentChange, sendMessage, setMessages, cancelRequest } = useChatSuper()

  // 获取历史消息恢复状态
  const { messagesByChatRestore, bubbleLoading, restoreMessages } = useChatRestore({
    axiosChat: axiosInstance,
    chatId,
    shouldRestore: false, // 不在这里判断是否应该恢复，而是交给 useChatSessionControl 处理
  })

  // 用于确保初始消息只发送一次的标记
  const initialMessageSentRef = useRef(false)

  // 使用会话控制 hook 决定是否应该恢复历史会话
  useChatSessionControl({
    chatId,
    shouldRestore: !roomId.includes(CHAT_ROOM_ID_PREFIX) && !!chatId,
    onRestore: restoreMessages,
    hasInitialMessage,
  })

  // 使用滚动控制 hook
  const { chatContainerRef, showScrollBottom, scrollToBottom } = useScrollToBottom({
    parsedMessages,
    isChating,
  })

  // 气泡项处理逻辑
  const { bubbleItems } = useBubbleItems(
    axiosInstance,
    entWebAxiosInstance,
    parsedMessages,
    chatId,
    true,
    PlaceholderSuper,
    (message) => sendMessage(message, undefined, deepthink)
  )

  // 处理历史消息恢复
  useEffect(() => {
    if (messagesByChatRestore) {
      setMessages(messagesByChatRestore)
    }
  }, [messagesByChatRestore, setMessages])

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

  // 处理初始消息发送
  useEffect(() => {
    if (initialMessage && !initialMessageSentRef.current && chatId) {
      initialMessageSentRef.current = true
      sendMessage(initialMessage, undefined, deepthink)
    }
  }, [initialMessage, sendMessage, deepthink, chatId])

  // 监听工作表列表版本变化
  useEffect(() => {
    if (activeTableSheetsVersion > 0) {
      // 初始版本为0，大于0说明有更新
      console.log('ChatMessageSuper: Sheet list version changed:', activeTableSheetsVersion)
      console.log('ChatMessageSuper: Current sheet list:', sheetList)
      // 在这里可以根据 sheetList 更新你的表格筛选器UI或执行其他同步操作
    }
  }, [activeTableSheetsVersion, sheetList]) // 添加 sheetList 到依赖项，以便在版本更新时能获取到最新的列表

  return (
    <Spin spinning={bubbleLoading} wrapperClassName={styles.spinContainer}>
      <div className={styles.chat}>
        <div ref={chatContainerRef} className={cn(styles.chatContainer, styles.chatContainerTop)}>
          <Bubble.List
            className={cn(styles.bubbleListContainer, 'bubble-list-container')}
            roles={rolesSuper}
            items={bubbleItems}
          />
        </div>

        {/* 使用独立的滚动到底部按钮组件 */}
        <ScrollToBottomButton visible={showScrollBottom} onClick={scrollToBottom} />

        {/* 针对超级名单的表格筛选区域 */}
        {/* <div>
          <h4>表格筛选区域 (Sheet List):</h4>
          {sheetList && sheetList.length > 0 ? (
            <ul>
              {sheetList.map((sheet) => (
                <li key={sheet.id}>
                  {sheet.name} (ID: {sheet.id})
                </li>
              ))}
            </ul>
          ) : (
            <p>当前没有工作表数据。</p>
          )}
        </div> */}

        {/* 聊天操作区域 */}
        <div className={cn(styles.chatActionsContainer, styles.chatContainerTop)}>
          <ChatSender
            className={cn(styles.sender, styles.senderAlone)}
            placeholder={
              isChating ? STRINGS.ANSWERING : parsedMessages?.length > 0 ? STRINGS.CONTINUE_ASK : STRINGS.HOW_CAN_HELP
            }
            isLoading={isChating}
            content={content}
            onCancel={cancelRequest}
            handleContentChange={handleContentChange}
            sendMessage={sendMessage}
            deepthink={deepthink === 1}
            suggestions={sheetList?.map((sheet) => ({
              label: sheet.name,
              value: sheet.name,
            }))}
          />
        </div>
        <div className={styles.footer}>{STRINGS.AI_DISCLAIMER}</div>
      </div>
    </Spin>
  )
}
