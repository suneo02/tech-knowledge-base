import { WuiAliceBtn } from '@/common'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'common/WuiAliceBtn',
  component: WuiAliceBtn,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Alice 风格的按钮组件，支持激活状态和图标显示。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: '按钮内容',
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    active: {
      control: { type: 'boolean' },
      description: '是否处于激活状态',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    icon: {
      description: '按钮图标',
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onClick: {
      description: '点击事件回调函数',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
} satisfies Meta<typeof WuiAliceBtn>

export default meta
type Story = StoryObj<typeof WuiAliceBtn>

// 基础用法
export const Basic: Story = {
  args: {
    children: '基础按钮',
    onClick: () => {
      console.log('按钮被点击')
    },
  },
}

// 激活状态
export const Active: Story = {
  args: {
    children: '激活状态',
    active: true,
    onClick: () => {
      console.log('激活按钮被点击')
    },
  },
}

// 带图标
export const WithIcon: Story = {
  args: {
    children: '带图标按钮',
    icon: <span>📁</span>,
    onClick: () => {
      console.log('带图标按钮被点击')
    },
  },
}

// 激活状态带图标
export const ActiveWithIcon: Story = {
  args: {
    children: '激活状态带图标',
    active: true,
    icon: <span>✅</span>,
    onClick: () => {
      console.log('激活状态带图标按钮被点击')
    },
  },
}

// 自定义图标
export const CustomIcon: Story = {
  args: {
    children: '上传文件',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1v10.5M3.5 6.5L8 11l4.5-4.5" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    onClick: () => {
      console.log('上传文件按钮被点击')
    },
  },
}
