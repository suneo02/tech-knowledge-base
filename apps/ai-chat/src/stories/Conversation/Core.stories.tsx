import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ConversationCore, ConversationCoreProps } from '../../components/Conversation/core'
import { conversationsMock } from './conversationsMock'

const meta = {
  title: 'Conversation/Core',
  component: ConversationCore,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Conversation sidebar component for AI chat applications',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const [items] = useState(context.args.items || conversationsMock)

      return (
        <div style={{ height: '100vh' }}>
          <Story items={items} hasMore={false} {...context.args} />
        </div>
      )
    },
  ],
  argTypes: {
    roomId: {
      control: { type: 'text' },
      description: 'Active conversation ID',
    },
    isChating: {
      control: { type: 'boolean' },
      description: 'Whether user is currently chatting',
    },
    collapse: {
      control: { type: 'boolean' },
      description: 'Whether the conversation sidebar is collapsed',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether items are loading',
    },
  },
} satisfies Meta<typeof ConversationCore>

export default meta
type Story = StoryObj<typeof ConversationCore>

// Define default args that provide all required props
const defaultArgs: ConversationCoreProps = {
  roomId: '1',
  isChating: false,
  onRoomIdChange: () => {},
  onDeleteConversation: () => {},
  onAddConversation: () => {},
  items: conversationsMock,
  loadMoreItems: () => {},
}

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
}

export const EmptyConversation: Story = {
  args: {
    ...defaultArgs,
    items: [],
  },
}

export const CollapsedView: Story = {
  args: {
    ...defaultArgs,
    collapse: true,
  },
}

export const Loading: Story = {
  args: {
    ...defaultArgs,
    loading: true,
  },
}

export const Chatting: Story = {
  args: {
    ...defaultArgs,
    isChating: true,
  },
}
