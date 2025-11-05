import React, { ChangeEvent, KeyboardEvent } from 'react'
import { Button, Input, List, Spin } from '@wind/wind-ui'
import styles from './Conversation.module.less'
import { AliceIcon } from '.'

/**
 * 消息类型接口
 */
interface Message {
  id: string
  content: string
  type: 'user' | 'ai'
  timestamp: string
  loading?: boolean
}

/**
 * ChatUI Props接口
 */
interface ChatUIProps {
  messages: Message[]
  inputValue: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSend: () => void
}

/**
 * 聊天界面组件
 * 负责展示消息列表和处理用户输入
 */
const ChatUI: React.FC<ChatUIProps> = ({ messages, inputValue, isLoading, onInputChange, onSend }) => {
  const chatContainerRef = React.useRef<HTMLDivElement>(null)

  // 当消息列表更新时滚动到底部
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // 处理Enter键按下事件
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className={styles.conversationContainer}>
      <div className={styles.chatContainer} ref={chatContainerRef}>
        <List
          className={styles.messageList}
          dataSource={messages}
          renderItem={(item) => (
            <List.Item className={styles.messageItem}>
              <List.Item.Meta
                className={item.type === 'user' ? styles.userMessageMeta : ''}
                avatar={item.type === 'ai' ? <AliceIcon /> : null}
                title={
                  <span className={item.type === 'ai' ? styles.aiMessageTitle : styles.userMessageTitle}>
                    {item.type === 'ai' ? 'Alice' : ''}
                  </span>
                }
                description={
                  item.loading ? (
                    <div className={styles.aiLoading}>
                      <Spin size="small" />
                    </div>
                  ) : (
                    item.content
                  )
                }
              />
            </List.Item>
          )}
        />
      </div>
      <div className={styles.inputContainer}>
        <Input.TextArea
          className={styles.textarea}
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onInputChange(e.target.value)}
          placeholder="请输入您的问题..."
          autosize={{ minRows: 2, maxRows: 4 }}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <Button
          className={styles.sendButton}
          type="primary"
          onClick={onSend}
          disabled={!inputValue.trim() || isLoading}
          loading={isLoading}
        >
          {isLoading ? '思考中...' : '发送'}
        </Button>
      </div>
    </div>
  )
}

export default ChatUI
