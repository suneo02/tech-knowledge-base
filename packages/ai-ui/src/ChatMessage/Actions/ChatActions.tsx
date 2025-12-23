import { EnterOutlined } from '@ant-design/icons'
import { Sender } from '@ant-design/x'
import { Input, Space, Typography } from 'antd'
import classNames from 'classnames'
import React, { useState } from 'react'
import styles from './ChatActions.module.less'
import { ChatSender } from './ChatSender'
import { ChatActionsProps } from './types'

export const ChatActions: React.FC<ChatActionsProps> = ({
  isLoading,
  content,
  onCancel,
  handleContentChange,
  sendMessage,
  senderClassName,
  placeholder,
  className,
  suggestions,
  renderLeftActions,
  renderRightActions,
  focus,
  maxLength,
}) => {
  const [hasRef, setHasRef] = useState(false)
  // 构建 Sender 的 header node
  const headerNode = (
    <Sender.Header
      open={hasRef}
      title={
        <Space>
          <EnterOutlined />
          <Typography.Text type="secondary">生成股权穿透图</Typography.Text>
          <Input placeholder="请输入公司名称" />
        </Space>
      }
      onOpenChange={setHasRef}
    />
  )

  return (
    <div className={classNames(styles.chatActions, className)}>
      <ChatSender
        isLoading={isLoading}
        content={content}
        placeholder={placeholder}
        className={classNames(styles.sender, senderClassName)}
        onCancel={onCancel}
        handleContentChange={handleContentChange}
        sendMessage={sendMessage}
        headerNode={headerNode}
        suggestions={suggestions}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        focus={focus}
        maxLength={maxLength}
      />
    </div>
  )
}
