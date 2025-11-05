import type { Meta, StoryObj } from '@storybook/react'

import { EditableLabel } from '../EditableLabel'

const meta = {
  title: 'Display/EditableLabel',
  component: EditableLabel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '可编辑的标签组件，点击可进行编辑，支持保存和取消操作。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'text' },
      description: '标签显示的文本值',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    onSave: {
      description: '保存编辑后的回调函数，需要返回一个Promise',
      table: {
        type: { summary: '(value: string) => Promise<void>' },
        defaultValue: { summary: 'undefined' },
      },
    },
    style: {
      control: 'object',
      description: '组件外层容器的样式',
      table: {
        type: { summary: 'React.CSSProperties' },
        defaultValue: { summary: 'undefined' },
      },
    },
    inputStyle: {
      control: 'object',
      description: '输入框的样式',
      table: {
        type: { summary: 'React.CSSProperties' },
        defaultValue: { summary: 'undefined' },
      },
    },
    placeholder: {
      control: { type: 'text' },
      description: '输入框的占位文本',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '请输入' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: '是否禁用编辑功能',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    maxLength: {
      control: { type: 'number' },
      description: '最大输入长度限制',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    validateFn: {
      description: '自定义验证函数',
      table: {
        type: { summary: '(value: string) => { isValid: boolean; errorMsg?: string }' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
} satisfies Meta<typeof EditableLabel>

export default meta
type Story = StoryObj<typeof EditableLabel>

// 基础用法
export const Basic: Story = {
  args: {
    value: '点击可编辑',
    onSave: async (value) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('保存的值:', value)
          resolve()
        }, 1000)
      })
    },
  },
}

// 禁用状态
export const Disabled: Story = {
  args: {
    value: '禁用状态不可编辑',
    disabled: true,
    onSave: async () => {},
  },
}

// 自定义占位符
export const CustomPlaceholder: Story = {
  args: {
    value: '自定义占位符',
    placeholder: '请输入自定义内容',
    onSave: async (value) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('保存的值:', value)
          resolve()
        }, 1000)
      })
    },
  },
}

// 最大长度限制
export const MaxLength: Story = {
  args: {
    value: '最大长度限制',
    maxLength: 10,
    onSave: async (value) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('保存的值:', value)
          resolve()
        }, 1000)
      })
    },
  },
}

// 自定义验证
export const CustomValidation: Story = {
  args: {
    value: '自定义验证',
    validateFn: (value) => {
      if (value.length < 5) {
        return { isValid: false, errorMsg: '输入内容不能少于5个字符' }
      }
      return { isValid: true }
    },
    onSave: async (value) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('保存的值:', value)
          resolve()
        }, 1000)
      })
    },
  },
}

// 自定义样式
export const CustomStyle: Story = {
  args: {
    value: '自定义样式',
    style: { backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' },
    inputStyle: { width: '300px', backgroundColor: '#fff' },
    onSave: async (value) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('保存的值:', value)
          resolve()
        }, 1000)
      })
    },
  },
}
