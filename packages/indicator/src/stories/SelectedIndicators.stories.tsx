import { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { IndicatorSelectedIndicators } from '../TreePanel/SelectedIndicators'

const meta: Meta<typeof IndicatorSelectedIndicators> = {
  title: 'TreePanel/SelectedIndicators',
  component: IndicatorSelectedIndicators,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof IndicatorSelectedIndicators>

// 基础示例
export const Basic: Story = {
  args: {
    checkedIndicators: new Set(['indicator1', 'indicator2', 'indicator3']),
    getIndicatorName: (key) => `指标${key.replace('indicator', '')}`,
    handleIndicatorCheck: (key, checked) => console.log('取消选择指标:', key, checked),
  },
}

// 交互式示例
export const Interactive = () => {
  const [checkedIndicators, setCheckedIndicators] = useState(new Set(['indicator1', 'indicator2', 'indicator3']))

  const handleIndicatorCheck = (key: string, checked: boolean) => {
    setCheckedIndicators((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(key)
      } else {
        newSet.delete(key)
      }
      return newSet
    })
  }

  const getIndicatorName = (key: string) => `指标${key.replace('indicator', '')}`

  return (
    <div style={{ width: '300px' }}>
      <IndicatorSelectedIndicators
        checkedIndicators={checkedIndicators}
        getIndicatorName={getIndicatorName}
        handleIndicatorCheck={handleIndicatorCheck}
      />
    </div>
  )
}

// 空状态示例
export const Empty: Story = {
  args: {
    checkedIndicators: new Set([]),
    getIndicatorName: (key) => `指标${key.replace('indicator', '')}`,
    handleIndicatorCheck: (key, checked) => console.log('取消选择指标:', key, checked),
  },
}

// 多个指标示例
export const ManyIndicators: Story = {
  args: {
    checkedIndicators: new Set([
      'indicator1',
      'indicator2',
      'indicator3',
      'indicator4',
      'indicator5',
      'indicator6',
      'indicator7',
      'indicator8',
    ]),
    getIndicatorName: (key) => `指标${key.replace('indicator', '')}`,
    handleIndicatorCheck: (key, checked) => console.log('取消选择指标:', key, checked),
  },
}

// 自定义样式示例
export const CustomStyle: Story = {
  args: {
    className: 'custom-class',
    checkedIndicators: new Set(['indicator1', 'indicator2']),
    getIndicatorName: (key) => `指标${key.replace('indicator', '')}`,
    handleIndicatorCheck: (key, checked) => console.log('取消选择指标:', key, checked),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '20px', background: '#f5f5f5' }}>
        <Story />
      </div>
    ),
  ],
}
