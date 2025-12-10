import { InputKeyWords } from '@/FilterItem/filterOptions/InputKeyWords'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof InputKeyWords> = {
  title: 'filter_comp/InputKeyWords',
  component: InputKeyWords,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof InputKeyWords>

// 空状态 - 无关键词
export const Empty: Story = {
  args: {
    defaultValue: [],
  },
}

// 默认状态 - 有预设关键词
export const WithDefaultKeywords: Story = {
  args: {
    defaultValue: ['React', 'TypeScript', 'JavaScript'],
  },
}

// 受控组件模式
export const Controlled: Story = {
  args: {
    value: ['Vue', 'Angular', 'Svelte'],
    onChange: (value: string[]) => console.log('Keywords changed:', value),
  },
}

// 自定义样式
export const WithCustomStyle: Story = {
  args: {
    defaultValue: ['Design', 'UI/UX'],
    className: 'custom-input-keywords',
  },
}
