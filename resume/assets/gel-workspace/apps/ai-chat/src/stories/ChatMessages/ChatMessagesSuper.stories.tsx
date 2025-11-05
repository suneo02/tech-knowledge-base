import { ChatMessageSuper } from '@/components/ChatMessage'
import { ChatRoomSuperProvider, useChatRoomSuperContext } from '@/contexts/ChatRoom/super'
import { ConversationsSuperProvider } from '@/contexts/Conversations'
import { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'

// 模拟聊天记录数据

// 将模拟数据转换为消息列表

interface WrapperProps {
  children: React.ReactNode
  initialChatId?: string
}

// 故事包装器组件，用于提供上下文和模拟状态
const StoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateRoomId, setChatId } = useChatRoomSuperContext()

  useEffect(() => {
    // 设置模拟的聊天ID和房间ID
    updateRoomId('chat-1')
    setChatId('chat-1')
  }, [updateRoomId, setChatId])

  return <>{children}</>
}

// 提供全局上下文的包装器
const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <ChatRoomSuperProvider>
        <ConversationsSuperProvider>
          <StoryWrapper>{children}</StoryWrapper>
        </ConversationsSuperProvider>
      </ChatRoomSuperProvider>
    </BrowserRouter>
  )
}

// Storybook 元数据配置
const meta = {
  title: 'ChatMessages/ChatMessagesSuper',
  component: ChatMessageSuper,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <div style={{ width: '800px', height: '600px', border: '1px solid #eee' }}>
          <Story />
        </div>
      </Wrapper>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ChatMessageSuper>

export default meta
type Story = StoryObj<typeof ChatMessageSuper>

// 默认故事：显示初始消息
export const Default: Story = {
  args: {},
}

// 带有初始消息的故事
export const WithInitialMessage: Story = {
  args: {
    initialMessage: '请帮我分析一下这个月的销售数据',
  },
}

// 带有深度思考模式的故事
export const WithDeepThink: Story = {
  args: {
    initialMessage: '这个问题需要深度思考',
    initialDeepthink: 1,
  },
}
