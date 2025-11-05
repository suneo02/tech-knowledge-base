import styles from '@/components/ChatMessage/index.module.less'
import { createBubbleItemsByParsedMessages } from '@/components/ChatMessage/useBubbleItems'
import { rolesSuper } from '@/components/ChatRoles/RolesSuperChat'
import { ChatRoomSuperProvider } from '@/contexts/ChatRoom/super'
import { ConversationsSuperProvider } from '@/contexts/Conversations'
import { PresetQuestionSuperProvider } from '@/contexts/PresetQuestion/ChatSuper'
import { useXChatParserSuper } from '@/hooks/useChat/XChatParser/super'
import { transformChatRestoreToRawMessages } from '@/hooks/useChatRestore'
import { MessageParsedSuper, MessageRaw } from '@/types/message'
import { Meta, StoryObj } from '@storybook/react'
import { ChatRestoreResponse } from 'gel-api'
import { BrowserRouter } from 'react-router-dom'
import { selectChatAiRecordRes1 } from './mock/actualRes1'
import { selectChatAiRecordRes2 } from './mock/actualRes2'

// 组件包装器，提供必要的上下文
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <ChatRoomSuperProvider>
        <PresetQuestionSuperProvider>
          <ConversationsSuperProvider>{children}</ConversationsSuperProvider>
        </PresetQuestionSuperProvider>
      </ChatRoomSuperProvider>
    </BrowserRouter>
  )
}

// 示例气泡列表组件
interface ChatRolesTestProps {
  chatHistoryData?: ChatRestoreResponse[]
}

const ChatRolesTest: React.FC<ChatRolesTestProps> = ({ chatHistoryData = [] }) => {
  // 使用请求处理器初始化智能体
  const [agent] = useXAgent<MessageRaw>({
    request: () => Promise.resolve(),
  })
  // 使用工厂创建消息解析器
  const parser = useXChatParserSuper()

  /**
   * 使用智能体和解析器初始化聊天功能
   * 这提供了消息处理、状态管理和请求触发
   */
  const { parsedMessages } = useXChat<MessageRaw, MessageParsedSuper>({
    agent,
    parser,
    defaultMessages: transformChatRestoreToRawMessages(chatHistoryData),
  })

  return (
    <div className={styles.chat}>
      <div className={`${styles.chatContainer} ${styles.chatContainerTop}`}>
        <Bubble.List
          className={styles.bubbleListContainer}
          roles={rolesSuper}
          items={createBubbleItemsByParsedMessages(parsedMessages)}
        />
      </div>
    </div>
  )
}

const meta = {
  title: 'chat_roles/super',
  component: ChatRolesTest,
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
} satisfies Meta<typeof ChatRolesTest>

export default meta
type Story = StoryObj<typeof ChatRolesTest>

// Default story showing a complete chat history
export const First: Story = {
  args: {
    chatHistoryData: selectChatAiRecordRes1,
  },
}

export const Second: Story = {
  args: {
    chatHistoryData: selectChatAiRecordRes2,
  },
}
