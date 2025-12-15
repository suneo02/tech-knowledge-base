import type { Meta, StoryObj } from '@storybook/react'
import { SuperListPresetQuestion } from 'gel-api'
import { RecommendQuestion } from '../../components/SuperList/HomeContent/RecommendQuestion'

const meta = {
  title: 'SuperHome/RecommendQuestion',
  component: RecommendQuestion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecommendQuestion>

export default meta
type Story = StoryObj<typeof RecommendQuestion>

const mockQuestions: SuperListPresetQuestion[] = [
  {
    rawSentenceID: '1',
    rawSentence:
      '分析某公司的基本信息和经营状况，分析某公司的基本信息和经营状况，分析某公司的基本信息和经营状况，分析某公司的基本信息和经营状况，分析某公司的基本信息和经营状况',
  },
  {
    rawSentenceID: '2',
    rawSentence: '查询某个行业的发展趋势',
  },
  {
    rawSentenceID: '3',
    rawSentence: '了解某公司的关联企业',
  },
]

export const Default: Story = {
  args: {
    questions: mockQuestions,
    onQuestionClick: (item) => {
      console.log('Clicked item:', item)
    },
  },
}

export const Empty: Story = {
  args: {
    questions: [],
  },
}
