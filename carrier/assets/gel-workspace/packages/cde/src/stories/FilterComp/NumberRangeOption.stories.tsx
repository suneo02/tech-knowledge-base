import { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { NumberRangeOption } from '../../FilterItem/filterOptions/NumberRangeOption'

const meta: Meta<typeof NumberRangeOption> = {
  title: 'filter_comp/NumberRangeOption',
  component: NumberRangeOption,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '300px', padding: '24px', border: '1px solid #eee' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof NumberRangeOption>

/**
 * 默认展示
 */
export const Default: Story = {
  args: {
    onChange: (value) => console.log('Value changed:', value),
    value: '10-100',
  },
}

/**
 * 带单位
 */
export const WithUnit: Story = {
  args: {
    onChange: (value) => console.log('Value changed:', value),
    value: '100-1000',
    suffix: '万元',
  },
}

/**
 * 开区间（仅下限）
 */
export const OnlyMin: Story = {
  args: {
    onChange: (value) => console.log('Value changed:', value),
    value: '100-',
  },
}

/**
 * 开区间（仅上限）
 */
export const OnlyMax: Story = {
  args: {
    onChange: (value) => console.log('Value changed:', value),
    value: '-500',
  },
}

/**
 * 空值
 */
export const Empty: Story = {
  args: {
    onChange: (value) => console.log('Value changed:', value),
    value: '',
  },
}

/**
 * 使用数组值
 */
export const ArrayValue: Story = {
  args: {
    onChange: (value) => console.log('Value changed:', value),
    value: [50, 200],
  },
}

/**
 * 带最大值限制
 */
export const WithMaxValue: Story = {
  args: {
    onChange: (value) => console.log('Value changed:', value),
    value: '',
    max: 1000,
  },
}

/**
 * 交互式示例
 */
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('10-100')
    return (
      <div>
        <NumberRangeOption onChange={(newValue) => setValue(newValue)} value={value} />
        <div style={{ marginTop: '16px' }}>当前值: {value || '(空)'}</div>
      </div>
    )
  },
}

/**
 * 禁用状态
 */
export const Disabled: Story = {
  args: {
    onChange: (value) => console.log('Value changed:', value),
    value: '50-150',
    disabled: true,
  },
}
