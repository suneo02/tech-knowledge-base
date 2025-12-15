import type { Meta, StoryObj } from '@storybook/react'
import { PromptsSection } from '../components/ChatMessage/PlaceholderPrompts/PromptsSection'

const meta = {
  title: 'Chat/PlaceholderPrompts/PromptsSection',
  component: PromptsSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PromptsSection>

export default meta
type Story = StoryObj<typeof PromptsSection>

const mockQuestions = [
  {
    id: '1',
    rawSentence: '分析某公司的基本信息和经营状况',
  },
  {
    id: '2',
    rawSentence: '查询某个行业的发展趋势',
  },
  {
    id: '3',
    rawSentence: '了解某公司的关联企业',
  },
]

const mockProps = {
  questions: mockQuestions,
  getDescriptionText: (question: { rawSentence: string }) => question.rawSentence,
  onItemClick: (item: any) => {
    console.log('Clicked item:', item)
  },
}

export const Desktop: Story = {
  args: {
    ...mockProps,
    isLargeScreen: true,
  },
}

export const Mobile: Story = {
  args: {
    ...mockProps,
    isLargeScreen: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const Empty: Story = {
  args: {
    ...mockProps,
    questions: [],
    isLargeScreen: true,
  },
}
