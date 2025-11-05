import { useEmbedMode } from '@/context'
import { getNewWorkflow, setNewWorkflow } from '@/util'
import { EnterOutlined } from '@ant-design/icons'
import { Sender, XProvider } from '@ant-design/x'
import { Button, message, Switch } from '@wind/wind-ui'
import { Flex, Input, Space, Typography } from 'antd'
import React, { useState } from 'react'
import { ChatSender } from './ChatSender'
import { DeepThinkBtn } from './DeepThinkBtn'
import { ChatActionsProps } from './types'

export const ChatActions: React.FC<ChatActionsProps> = ({
  isLoading,
  content,
  onCancel,
  handleContentChange,
  sendMessage,
  senderClassName,
  deepthink,
  setDeepthink,
  placeholder,
  className,
}) => {
  const [hasRef, setHasRef] = useState(false)
  const { isEmbedMode = false } = useEmbedMode()
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
    <Flex wrap className={className}>
      <Space style={{ marginBottom: '12px' }}>
        {!isEmbedMode && (
          <XProvider theme={{ components: { Button: { ghostBg: '#eaf6fa' } } }}>
            <DeepThinkBtn
              deepthink={deepthink}
              onClick={() => {
                if (isLoading) {
                  message.error('正在对话中，请先暂停对话再进行深度思考')
                  return
                }
                setDeepthink(!deepthink)
              }}
            />
          </XProvider>
        )}
      </Space>
      <ChatSender
        isLoading={isLoading}
        content={content}
        placeholder={placeholder}
        className={senderClassName}
        onCancel={onCancel}
        handleContentChange={handleContentChange}
        sendMessage={sendMessage}
        deepthink={deepthink}
        headerNode={headerNode}
      />
    </Flex>
  )
}
