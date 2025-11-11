import { axiosInstance } from '@/api/axios'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { useChatSessionControl } from '@/hooks/useChatSessionControl'
import { useChatSuper } from '@/pages/ProgressGuardDemo/Chat/hooks/useChatSuper'
import { Bubble } from '@ant-design/x'
import { DoubleLeftO } from '@wind/icons'
import { Button, Tooltip } from '@wind/wind-ui'
import { CHAT_ROOM_ID_PREFIX, ChatActions, ScrollToBottomButton, useBubbleItems, useChatRestore } from 'ai-ui'
import { Spin } from 'antd'
import cn from 'classnames'
import { ChatThinkSignal } from 'gel-api'
import { AliceLogo, useInitialMsgFromUrl, useScrollToBottom } from 'gel-ui'
import { t } from 'gel-util/intl'
import { FC, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from '../../ChatMessage/chatMessageShared.module.less'
import { rolesSuperNoAvatar } from '../../ChatRoles/RolesSuperChat'
import { DeepSearchBtn } from '../ChatSender'
// 多语言文本配置
const STRINGS = {
  ANSWERING: t('464164', '正在回答'),
  CONTINUE_ASK: t('421516', '您可以继续提问'),
  HOW_CAN_HELP: t('421515', '有什么可以帮你?'),
  AI_DISCLAIMER: t('453642', '内容由AI生成，请核查重要信息'),
  DEEP_ON_TIP: t('464185', '海量企业名单精准获取，检索时间会久一点'),
  TITLE: t('464234', '一句话找企业'),
  // DEEP_OFF_TIP: t('', '普通模式可快速获取名单，但数量较少'),
}

const DEFAULT_MAX_LENGTH = 500

// 常量定义
// 超级名单没有深度思考
const deepthink: ChatThinkSignal['think'] = undefined

/**
 * 使用增强版聊天hook的消息组件
 */
export const ChatMessageSuper: FC<{ setShowChat?: (show: boolean) => void }> = ({ setShowChat }) => {
  const { chatId, roomId, isChating, activeSheetId, tabVersions } = useSuperChatRoomContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [deepSearch, setDeepSearch] = useState(false)
  // 直接从 URL 获取初始消息
  const { initialMessage, hasInitialMessage } = useInitialMsgFromUrl()

  // 获取聊天相关的状态和方法
  const { content, parsedMessages, handleContentChange, sendMessage, setMessages, cancelRequest } = useChatSuper(
    undefined,
    DEFAULT_MAX_LENGTH
  )

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

  // 首屏自动滚动到底部（仅执行一次）
  const didInitialAutoScrollRef = useRef(false)
  useEffect(() => {
    if (didInitialAutoScrollRef.current) return
    if (bubbleLoading) return
    if (!parsedMessages?.length) return
    requestAnimationFrame(() => {
      scrollToBottom()
      didInitialAutoScrollRef.current = true
    })
  }, [bubbleLoading, parsedMessages, scrollToBottom])

  // 新消息到达时自动滚动（长度增长）
  const prevMessagesLengthRef = useRef(0)
  useEffect(() => {
    const length = parsedMessages?.length ?? 0
    if (length > prevMessagesLengthRef.current) {
      requestAnimationFrame(() => {
        scrollToBottom()
      })
    }
    prevMessagesLengthRef.current = length
  }, [parsedMessages, scrollToBottom])

  // 开始回答时（isChating 从 false -> true）自动滚动
  const prevIsChatingRef = useRef(isChating)
  useEffect(() => {
    if (!prevIsChatingRef.current && isChating) {
      requestAnimationFrame(() => {
        scrollToBottom()
      })
    }
    prevIsChatingRef.current = isChating
  }, [isChating, scrollToBottom])

  // 气泡项处理逻辑
  const { bubbleItems } = useBubbleItems(parsedMessages, chatId, true, undefined, (message) =>
    sendMessage(message, undefined, deepthink)
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

  // 从 URL 同步 deepSearch 初始状态
  useEffect(() => {
    const deep = searchParams.get('deepSearch')
    console.log('🚀 ~ ChatMessageSuper ~ deep:', deep)
    // 给一句话找企业直接写死true
    // if (deep != null) setDeepSearch(deep === '1' || deep === 'true')
    setDeepSearch(true)
  }, [searchParams])

  // 处理初始消息发送
  useEffect(() => {
    if (initialMessage && !initialMessageSentRef.current && chatId) {
      initialMessageSentRef.current = true
      // 首次自动发送时，直接从 URL 读取 deepSearch，避免与状态同步时序冲突
      // const deep = searchParams.get('deepSearch')
      // const deepFlag = deep === '1' || deep === 'true'
      // 给一句话找企业直接写死true
      const deepFlag = true
      sendMessage(initialMessage, undefined, deepthink, chatId, deepFlag ? 1 : undefined)
    }
  }, [initialMessage, sendMessage, chatId, searchParams])

  // 监听工作表列表版本变化
  useEffect(() => {
    if (tabVersions[activeSheetId] > 0) {
      // 初始版本为0，大于0说明有更新
      // console.log('ChatMessageSuper: Sheet list version changed:', activeTableSheetsVersion)
      // console.log('ChatMessageSuper: Current sheet list:', sheetList)
      // 在这里可以根据 sheetList 更新你的表格筛选器UI或执行其他同步操作
    }
  }, [tabVersions, activeSheetId]) // 添加 sheetList 到依赖项，以便在版本更新时能获取到最新的列表

  return (
    <Spin spinning={bubbleLoading} wrapperClassName={styles.spinContainer}>
      <div className={styles['home-button-container']}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AliceLogo style={{ marginInlineEnd: 8 }} width={28} height={28} />

          <span style={{ fontSize: 14, color: 'var(--basic-3)', fontWeight: 600 }}>{STRINGS.TITLE}</span>
        </div>
        <Tooltip title={t('464211', '隐藏左侧')} placement="left">
          {/* @ts-expect-error wind-icon */}
          <Button icon={<DoubleLeftO />} onClick={() => setShowChat?.(false)} type="text" />
        </Tooltip>
      </div>
      <div className={cn(styles.chat, styles.super)}>
        <div ref={chatContainerRef} className={cn(styles.chatContainer, styles.chatContainerTop)}>
          <Bubble.List
            className={cn(styles.bubbleListContainer, 'bubble-list-container')}
            roles={rolesSuperNoAvatar}
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
          <ChatActions
            placeholder={
              isChating ? STRINGS.ANSWERING : parsedMessages?.length > 0 ? STRINGS.CONTINUE_ASK : STRINGS.HOW_CAN_HELP
            }
            isLoading={isChating}
            content={content}
            onCancel={cancelRequest}
            handleContentChange={handleContentChange}
            sendMessage={(message) => {
              const result = sendMessage(message, undefined, deepthink, undefined, deepSearch ? 1 : undefined)
              requestAnimationFrame(() => {
                scrollToBottom()
              })
              return result
            }}
            // suggestions={sheetInfos?.map((sheet) => ({
            //   label: sheet.sheetName,
            //   value: sheet.sheetName,
            // }))}
            renderLeftActions={() => {
              // 给一句话找企业直接写死true
              return <DeepSearchBtn initialValue={true} onChange={setDeepSearch} />
            }}
            maxLength={DEFAULT_MAX_LENGTH}
          />
        </div>
        <div className={styles.footer}>{STRINGS.AI_DISCLAIMER}</div>
      </div>
    </Spin>
  )
}
