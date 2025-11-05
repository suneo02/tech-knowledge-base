import { ChatRoomSuperProvider } from '@/contexts/ChatRoom/super'
import { ConversationsSuperProvider } from '@/contexts/Conversations'
import { PresetQuestionSuperProvider } from '@/contexts/PresetQuestion/ChatSuper'
import { Meta, StoryObj } from '@storybook/react'
import { ApiCodeForWfc } from 'gel-api'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SuperChat from '../../pages/SuperChat'

// 定义模拟 API 控制参数的接口
interface MockApiControlsProps {
  shouldReturnHistoryMessages: boolean
  shouldFailApiCalls: boolean
  conversationId: string
  delayMs: number
}

// 创建一个带有 API 控制面板的模拟装饰器
const withMockApiControls = (Story, context) => {
  // 从 Story 参数中获取模拟配置
  const mockConfig: MockApiControlsProps = context.parameters.mockApi || {
    shouldReturnHistoryMessages: true,
    shouldFailApiCalls: false,
    conversationId: '123456',
    delayMs: 500,
  }

  // 模拟 conversation/conversationDetail 的响应
  const mockConversationDetail = {
    ErrorCode: mockConfig.shouldFailApiCalls ? ApiCodeForWfc.CORP_ERROR : ApiCodeForWfc.SUCCESS,
    ErrorMessage: mockConfig.shouldFailApiCalls ? 'Mock API Error' : 'success',
    Data: mockConfig.shouldFailApiCalls
      ? null
      : {
          data: {
            conversationId: mockConfig.conversationId,
            tableId: `table_${mockConfig.conversationId}`,
            chatId: `chat_${mockConfig.conversationId}`,
            title: '模拟对话标题',
          },
        },
  }

  // 模拟 selectChatAIRecord 的响应
  const mockChatHistory = {
    ErrorCode: mockConfig.shouldFailApiCalls ? ApiCodeForWfc.CORP_ERROR : ApiCodeForWfc.SUCCESS,
    ErrorMessage: mockConfig.shouldFailApiCalls ? 'Mock API Error' : 'success',
    Data:
      mockConfig.shouldFailApiCalls || !mockConfig.shouldReturnHistoryMessages
        ? []
        : [
            {
              sender: 'USER',
              content: '这是历史记录中的用户消息',
              createTime: new Date(Date.now() - 60000).toISOString(), // 1分钟前
            },
            {
              sender: 'ROBOT',
              content: '这是历史记录中的机器人回复',
              createTime: new Date(Date.now() - 30000).toISOString(), // 30秒前
            },
          ],
  }

  // 模拟 API 请求
  const originalFetch = window.fetch
  window.fetch = async function (...args) {
    const url = args[0].toString()

    // 添加延迟模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, mockConfig.delayMs))

    // 检查 URL 匹配
    if (url.includes('conversation/conversationDetail')) {
      return {
        ok: true,
        json: async () => mockConversationDetail,
      }
    } else if (url.includes('selectChatAIRecord')) {
      return {
        ok: true,
        json: async () => mockChatHistory,
      }
    }

    // 对于其他请求，使用原始的 fetch
    return originalFetch.apply(this, args)
  }

  // 渲染带有控制面板的故事
  const result = (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <h3>模拟 API 配置</h3>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <strong>对话 ID:</strong> {mockConfig.conversationId}
          </div>
          <div>
            <strong>返回历史消息:</strong> {mockConfig.shouldReturnHistoryMessages ? '是' : '否'}
          </div>
          <div>
            <strong>API 调用失败:</strong> {mockConfig.shouldFailApiCalls ? '是' : '否'}
          </div>
          <div>
            <strong>网络延迟:</strong> {mockConfig.delayMs}ms
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <Story />
      </div>
    </div>
  )

  // 恢复原始的 fetch
  window.fetch = originalFetch

  return result
}

// 定义 Meta 对象
const meta: Meta<typeof SuperChat> = {
  title: 'SuperChat/SuperChatWithControls',
  component: SuperChat,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withMockApiControls],
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

// 正常恢复历史消息的故事
export const NormalWithHistory: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/123456" />,
  parameters: {
    mockApi: {
      shouldReturnHistoryMessages: true,
      shouldFailApiCalls: false,
      conversationId: '123456',
      delayMs: 500,
    },
    docs: {
      description: {
        story: '正常场景：加载现有会话并显示历史消息',
      },
    },
  },
}

// 带有初始消息的故事（不应恢复历史）
export const WithInitialMessage: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/123456?initialMsg=新对话的初始消息" />,
  parameters: {
    mockApi: {
      shouldReturnHistoryMessages: true, // 即使有历史消息，由于有初始消息参数，也不应该显示历史
      shouldFailApiCalls: false,
      conversationId: '123456',
      delayMs: 500,
    },
    docs: {
      description: {
        story: '带有初始消息的场景：即使存在历史消息也应忽略它',
      },
    },
  },
}

// API 调用失败的故事
export const ApiFailure: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/123456" />,
  parameters: {
    mockApi: {
      shouldReturnHistoryMessages: true,
      shouldFailApiCalls: true, // 模拟 API 失败
      conversationId: '123456',
      delayMs: 500,
    },
    docs: {
      description: {
        story: '错误场景：API 调用失败',
      },
    },
  },
}

// 新会话（带前缀）且带初始消息的故事
export const NewConversationWithMessage: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/temp_123456?initialMsg=新会话的消息" />,
  parameters: {
    mockApi: {
      shouldReturnHistoryMessages: false,
      shouldFailApiCalls: false,
      conversationId: 'temp_123456',
      delayMs: 500,
    },
    docs: {
      description: {
        story: '新会话场景：会话 ID 带临时前缀且有初始消息',
      },
    },
  },
}

// 高延迟场景
export const HighLatency: Story = {
  render: () => <SuperChatWithRouter initialPath="/super/chat/123456" />,
  parameters: {
    mockApi: {
      shouldReturnHistoryMessages: true,
      shouldFailApiCalls: false,
      conversationId: '123456',
      delayMs: 2000, // 模拟高网络延迟
    },
    docs: {
      description: {
        story: '网络场景：高延迟环境下的加载行为',
      },
    },
  },
}
