import { ChatRoomSuperProvider } from '@/contexts/ChatRoom/super'
import { ConversationsSuperProvider } from '@/contexts/Conversations'
import { PresetQuestionSuperProvider } from '@/contexts/PresetQuestion/ChatSuper'
import { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SuperChat from '../../pages/SuperChat'

// 交互式控制面板组件
const UrlParameterControls: React.FC<{
  onNavigate: (path: string) => void
}> = ({ onNavigate }) => {
  const [conversationId, setConversationId] = useState('123456')
  const [initialMsg, setInitialMsg] = useState('')
  const [initialDeepthink, setInitialDeepthink] = useState(false)
  const [isTemporary, setIsTemporary] = useState(false)

  // 构建路径
  const buildPath = () => {
    let id = conversationId
    if (isTemporary && !id.startsWith('temp_')) {
      id = `temp_${id}`
    }

    const params = new URLSearchParams()
    if (initialMsg) {
      params.append('initialMsg', initialMsg)
    }
    if (initialDeepthink) {
      params.append('initialDeepthink', '1')
    }

    const queryString = params.toString()
    return `/super/chat/${id}${queryString ? `?${queryString}` : ''}`
  }

  return (
    <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
      <h3 style={{ marginTop: 0, marginBottom: '12px' }}>URL 参数控制面板</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>会话 ID:</label>
          <input
            type="text"
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            style={{ padding: '8px', width: '180px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>初始消息:</label>
          <input
            type="text"
            value={initialMsg}
            onChange={(e) => setInitialMsg(e.target.value)}
            placeholder="输入初始消息"
            style={{ padding: '8px', width: '250px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label>
            <input
              type="checkbox"
              checked={initialDeepthink}
              onChange={(e) => setInitialDeepthink(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            启用深度思考模式
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label>
            <input
              type="checkbox"
              checked={isTemporary}
              onChange={(e) => setIsTemporary(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            临时会话 (temp_ 前缀)
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button
            onClick={() => onNavigate(buildPath())}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1677ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            应用参数
          </button>
        </div>

        <div style={{ fontSize: '14px' }}>
          <strong>当前路径:</strong> {buildPath()}
        </div>
      </div>
    </div>
  )
}

// 创建可控导航的包装组件
const SuperChatWithControls: React.FC = () => {
  const [path, setPath] = useState('/super/chat/123456')

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <UrlParameterControls onNavigate={setPath} />
      <div style={{ flex: 1 }}>
        <MemoryRouter initialEntries={[path]} key={path}>
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
      </div>
    </div>
  )
}

// 定义 Meta 对象
const meta: Meta<typeof SuperChatWithControls> = {
  title: 'SuperChat/SuperChatInteractive',
  component: SuperChatWithControls,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# 交互式 SuperChat 测试页面

这个页面允许你通过控制面板动态修改 URL 参数，以测试不同参数对组件行为的影响。

## 可用参数
- **会话 ID**: 设置会话的唯一标识符
- **初始消息**: 设置初始消息内容
- **深度思考模式**: 启用/禁用深度思考模式
- **临时会话**: 添加 \`temp_\` 前缀到会话 ID，表示这是一个新会话

点击"应用参数"按钮后，组件将使用新的参数重新渲染。
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SuperChatWithControls>

// 交互式故事
export const Interactive: Story = {}
