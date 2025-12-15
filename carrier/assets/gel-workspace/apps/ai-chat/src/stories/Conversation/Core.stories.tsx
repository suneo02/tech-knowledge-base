import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ChatConversationBase } from '../../components/Conversation/base'

const meta = {
  title: 'Conversation/Core',
  component: ChatConversationBase,
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
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {},
} satisfies Meta<typeof ChatConversationBase>

export default meta
type Story = StoryObj<typeof ChatConversationBase>

// Define default args that provide all required props
const defaultArgs = {}

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
