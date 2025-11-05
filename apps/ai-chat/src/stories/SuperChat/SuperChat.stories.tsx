import { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SuperChat from '../../pages/SuperChat'

// 定义 Meta 对象
const meta: Meta<typeof SuperChat> = {
  title: 'SuperChat/index',
  component: SuperChat,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SuperChat>

// 创建一个包装组件，用于提供必要的上下文和路由
const SuperChatWithRouter: React.FC<{
  initialPath: string
}> = ({ initialPath }) => {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/super/chat/:conversationId" element={<SuperChat />} />
      </Routes>
    </MemoryRouter>
  )
}

// 基础故事 - 没有任何参数
export const Default: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/123456" />,
}

// 带有初始消息参数的故事
export const WithInitialMessage: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/123456?initialMsg=Hello%20World" />,
  parameters: {
    docs: {
      description: {
        story: '模拟带有初始消息的情况，URL 包含 initialMsg 参数',
      },
    },
  },
}

// 带有初始消息和深度思考模式的故事
export const WithInitialMessageAndDeepthink: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/123456?initialMsg=Hello%20World&initialDeepthink=1" />,
  parameters: {
    docs: {
      description: {
        story: '模拟带有初始消息和深度思考模式的情况，URL 包含 initialMsg 和 initialDeepthink 参数',
      },
    },
  },
}

// 新会话故事 - 使用带前缀的临时 ID
export const NewConversation: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/temp_123456" />,
  parameters: {
    docs: {
      description: {
        story: '模拟新创建的会话，会话 ID 带有临时前缀',
      },
    },
  },
}

// 现有会话故事 - 应该恢复历史消息
export const ExistingConversation: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/123456" />,
  parameters: {
    docs: {
      description: {
        story: '模拟访问现有会话，应该尝试恢复历史消息',
      },
    },
  },
}
