import { ChatMessageBase } from '@/components/ChatBase'
import { useInitialMessage } from '@/hooks/useInitialMessage'
import {
  ChatRoomProvider,
  ConversationsBaseProvider,
  EmbedModeProvider,
  PresetQuestionBaseProvider,
  useChatRoomContext,
} from 'ai-ui'
import React, { useEffect } from 'react'
import styles from './index.module.less'

/**
 * 嵌入式聊天内部组件，必须在各种Provider内部使用
 */
const EmbedChatInner: React.FC = () => {
  const { initialMessage, initialDeepthink, entityType, entityName, roomId } = useInitialMessage()

  const { updateRoomId, isChating } = useChatRoomContext()
  useEffect(() => {
    if (roomId) {
      updateRoomId(roomId)
    }
  }, [updateRoomId, roomId])

  // 监听isChating状态变化，向父窗口发送消息
  useEffect(() => {
    // 向父窗口发送当前聊天状态
    console.log('聊天状态变化，正在发送消息:', isChating)
    try {
      window.parent.postMessage(
        {
          type: 'CHAT_STATUS_CHANGE',
          payload: {
            isChating,
          },
        },
        '*'
      )
      console.log('消息已发送')
    } catch (error) {
      console.error('发送消息失败:', error)
    }
  }, [isChating])

  // 获取问题列表

  return (
    <div className={styles.embedChatContainer}>
      <ChatMessageBase
        initialMessage={initialMessage}
        initialDeepthink={initialDeepthink}
        entityType={entityType ?? undefined}
        entityName={entityName ?? undefined}
      />
    </div>
  )
}

/**
 * 嵌入式聊天页面组件
 *
 * 仅包含基础问答功能，无历史会话恢复
 * 适合通过iframe嵌入到其他应用
 *
 * 支持URL参数:
 * - initialMsg: 初始问题
 * - initialDeepthink: 是否开启深度思考模式 (1 或 0)
 * - entityType: 实体类型
 * - entityName: 实体名称
 *
 * 示例: /embed-chat?initialMsg=你好&initialDeepthink=1&entityType=company&entityName=阿里巴巴
 */
const EmbedChat: React.FC = () => {
  return (
    <ChatRoomProvider>
      <PresetQuestionBaseProvider>
        <ConversationsBaseProvider>
          <EmbedModeProvider isEmbedMode={true}>
            <EmbedChatInner />
          </EmbedModeProvider>
        </ConversationsBaseProvider>
      </PresetQuestionBaseProvider>
    </ChatRoomProvider>
  )
}

export default EmbedChat
