import type { Meta, StoryObj } from '@storybook/react'
import { WelcomeSection } from '../../components/ChatMessage/Welcome'

const meta = {
  title: 'Chat/PlaceholderPrompts/WelcomeSection',
  component: WelcomeSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WelcomeSection>

export default meta
type Story = StoryObj<typeof WelcomeSection>

export const Desktop: Story = {
  args: {
    isLargeScreen: true,
  },
}

export const Mobile: Story = {
  args: {
    isLargeScreen: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
