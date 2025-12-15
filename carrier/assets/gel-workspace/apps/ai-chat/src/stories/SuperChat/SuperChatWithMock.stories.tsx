import { ChatRoomSuperProvider } from '@/contexts/ChatRoom/super'
import { ConversationsSuperProvider } from '@/contexts/Conversations'
import { PresetQuestionSuperProvider } from '@/contexts/PresetQuestion/ChatSuper'
import { Meta, StoryObj } from '@storybook/react'
import { ApiCodeForWfc } from 'gel-api'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SuperChat from '../../pages/SuperChat'

// 模拟 API 响应
const mockApiResponses = {
  'conversation/conversationDetail': {
    ErrorCode: ApiCodeForWfc.SUCCESS,
    ErrorMessage: 'success',
    Data: {
      data: {
        conversationId: '123456',
        tableId: 'table_123456',
        chatId: 'chat_123456',
        title: '模拟对话标题',
      },
    },
  },
  selectChatAIRecord: {
    ErrorCode: ApiCodeForWfc.SUCCESS,
    ErrorMessage: 'success',
    Data: [
      {
        sender: 'USER',
        content: '历史消息1',
        createTime: new Date().toISOString(),
      },
      {
        sender: 'ROBOT',
        content: '这是一条历史回复消息',
        createTime: new Date().toISOString(),
      },
    ],
  },
}

// 创建一个模拟的 API 拦截器
const withMockApi = (Story) => {
  // 模拟 API 请求
  const originalFetch = window.fetch
  window.fetch = async function (...args) {
    const url = args[0].toString()

    // 检查 URL 是否匹配我们要模拟的 API
    for (const [endpoint, response] of Object.entries(mockApiResponses)) {
      if (url.includes(endpoint)) {
        return {
          ok: true,
          json: async () => response,
        }
      }
    }

    // 对于其他请求，使用原始的 fetch
    return originalFetch.apply(this, args)
  }

  // 渲染故事
  const result = <Story />

  // 恢复原始的 fetch
  window.fetch = originalFetch

  return result
}

// 定义 Meta 对象
const meta: Meta<typeof SuperChat> = {
  title: 'SuperChat/SuperChatWithMock',
  component: SuperChat,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withMockApi],
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
        <Route
          path="/super/chat/:conversationId"
          element={
            <ChatRoomSuperProvider>
              <PresetQuestionSuperProvider>
                <ConversationsSuperProvider>
                  <SuperChat />
                </ConversationsSuperProvider>
              </PresetQuestionSuperProvider>
            </ChatRoomSuperProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

// 模拟从历史记录恢复的故事
export const RestoreFromHistory: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/123456" />,
  parameters: {
    docs: {
      description: {
        story: '模拟从历史记录恢复对话，显示之前的对话内容',
      },
    },
  },
}

// 模拟带有初始消息的故事
export const WithInitialMessage: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/123456?initialMsg=这是一条初始消息" />,
  parameters: {
    docs: {
      description: {
        story: '模拟带有初始消息的情况，即使有历史记录也应该忽略它',
      },
    },
  },
}

// 模拟带有初始消息和深度思考模式的故事
export const WithDeepthinkMode: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/123456?initialMsg=深度分析问题&initialDeepthink=1" />,
  parameters: {
    docs: {
      description: {
        story: '模拟带有初始消息和深度思考模式的情况',
      },
    },
  },
}

// 模拟错误情况
export const ErrorState: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/invalid_id" />,
  parameters: {
    docs: {
      description: {
        story: '模拟 API 错误的情况',
      },
    },
  },
}
