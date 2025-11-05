import { ChatRoomSuperProvider, useChatRoomSuperContext } from '@/contexts/ChatRoom/super'
import { PresetQuestionSuperProvider } from '@/contexts/PresetQuestion/ChatSuper'
import { Meta, StoryObj } from '@storybook/react'
import { SuperListPresetQuestion } from 'gel-api'
import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { PlaceholderSuper } from '../../components/ChatMessage/PlaceholderPrompts/super'

const mockQuestions: SuperListPresetQuestion[] = [
  {
    rawSentenceID: '1',
    rawSentence: '这是一个示例问题1',
  },
  {
    rawSentenceID: '2',
    rawSentence: '这是一个示例问题2',
  },
]

interface WrapperProps {
  children: React.ReactNode
  initialChatId?: string
}

const StoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateRoomId, setChatId } = useChatRoomSuperContext()

  useEffect(() => {
    // 如果是 WithChatId story，设置初始 chatId
    const params = new URLSearchParams(window.location.search)
    const storyId = params.get('id')
    if (storyId?.includes('with-chat-id')) {
      updateRoomId('mock-room-id-123')
      setChatId('mock-chat-id-123')
    }
  }, [updateRoomId])

  return <>{children}</>
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <ChatRoomSuperProvider>
        <PresetQuestionSuperProvider initialQuestions={mockQuestions}>
          <StoryWrapper>{children}</StoryWrapper>
        </PresetQuestionSuperProvider>
      </ChatRoomSuperProvider>
    </BrowserRouter>
  )
}

const meta = {
  title: 'chat/PlaceholderSuper',
  component: PlaceholderSuper,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <Story />
      </Wrapper>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PlaceholderSuper>

export default meta
type Story = StoryObj<typeof PlaceholderSuper>

export const Default: Story = {
  args: {
    handleSendPresetMsg: (message) => {
      console.log('send message', message)
    },
  },
}

// kong 有引用资料，没有引用资料，loading ，流式输出中，
export const WithChatId: Story = {
  args: {
    handleSendPresetMsg: (message) => {
      console.log('send message', message)
    },
  },
}
