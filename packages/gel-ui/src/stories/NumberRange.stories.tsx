import type { Meta, StoryObj } from '@storybook/react'

import { NumberRange } from '../form/NumRange'

const meta = {
  title: 'Form/NumberRange',
  component: NumberRange,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '数字范围选择器，用于输入一个数字范围。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: { type: 'number' },
      description: '最小可输入值',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    max: {
      control: { type: 'number' },
      description: '最大可输入值',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    step: {
      control: { type: 'number' },
      description: '步长，点击上下按钮时改变的数值',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    precision: {
      control: { type: 'number' },
      description: '数值精度，小数点后位数',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: '是否禁用',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    placeholder: {
      control: 'object',
      description: '占位文本，[最小值占位符, 最大值占位符]',
      table: {
        type: { summary: '[string, string]' },
        defaultValue: { summary: "['最小值', '最大值']" },
      },
    },
    value: {
      control: 'object',
      description: '当前值，[最小值, 最大值]',
      table: {
        type: { summary: '[number | null, number | null]' },
        defaultValue: { summary: '[null, null]' },
      },
    },
    separator: {
      control: { type: 'text' },
      description: '分隔符',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: "'-'" },
      },
    },
    prefix: {
      control: { type: 'text' },
      description: '前缀',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    suffix: {
      control: { type: 'text' },
      description: '后缀',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
} satisfies Meta<typeof NumberRange>

export default meta
type Story = StoryObj<typeof NumberRange>

// 基础用法
export const Basic: Story = {
  args: {
    min: 0,
    max: 10000,
    prefix: '条数选择',
  },
}

// 带精度
export const WithPrecision: Story = {
  args: {
    min: 0,
    max: 1,
    step: 0.1,
    precision: 2,
    value: [0.25, 0.75],
  },
}

// 禁用状态
export const Disabled: Story = {
  args: {
    min: 0,
    max: 100,
    value: [20, 80],
    disabled: true,
  },
}

// 自定义分隔符
export const CustomSeparator: Story = {
  args: {
    min: 0,
    max: 100,
    value: [20, 80],
    separator: '至',
  },
}

// 带前缀和后缀
export const WithPrefixAndSuffix: Story = {
  args: {
    min: 0,
    max: 10002,
    value: [20, 80],
    prefix: '范围:',
    suffix: '元',
  },
}

// 自定义占位符
export const CustomPlaceholder: Story = {
  args: {
    min: 0,
    max: 100,
    placeholder: ['起始值', '结束值'],
  },
}

// 大步长
export const LargeStep: Story = {
  args: {
    min: 0,
    max: 1000,
    step: 100,
    value: [200, 800],
  },
}
