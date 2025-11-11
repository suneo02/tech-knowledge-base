import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { IndicatorSelectedIndicators } from '../TreePanel/SelectedIndicators'
import { IndicatorTreeIndicator } from 'gel-api'

const meta: Meta<typeof IndicatorSelectedIndicators> = {
  title: 'TreePanel/IndicatorSelectedIndicators',
  component: IndicatorSelectedIndicators,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checkedIndicators: { control: false },
    handleIndicatorCheck: { action: 'checked' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 创建一些示例指标数据
const sampleIndicators: Map<number, IndicatorTreeIndicator> = new Map([
  [
    1,
    {
      spId: 1,
      indicatorDisplayName: '企业总资产',
      key: '1',
      classificationId: 1,
      points: 10,
      baseInfo: {
        unit: '万元',
        dataType: 'number',
        accuracy: '2',
        definition: '企业拥有的全部资产',
        displaywordwarp: 0,
        displaylen: '150px',
        displaylentype: 1,
        __typename: 'BaseIndicatorInfo',
      },
      __typename: 'Indicator',
    },
  ],
  [
    2,
    {
      spId: 2,
      indicatorDisplayName: '净利润',
      key: '2',
      classificationId: 1,
      points: 15,
      baseInfo: {
        unit: '万元',
        dataType: 'number',
        accuracy: '2',
        definition: '企业净利润',
        displaywordwarp: 0,
        displaylen: '120px',
        displaylentype: 1,
        __typename: 'BaseIndicatorInfo',
      },
      __typename: 'Indicator',
    },
  ],
  [
    3,
    {
      spId: 3,
      indicatorDisplayName: '营业收入',
      key: '3',
      classificationId: 1,
      points: 12,
      baseInfo: {
        unit: '万元',
        dataType: 'number',
        accuracy: '2',
        definition: '企业营业收入',
        displaywordwarp: 0,
        displaylen: '120px',
        displaylentype: 1,
        __typename: 'BaseIndicatorInfo',
      },
      __typename: 'Indicator',
    },
  ],
])

// 基础示例 - 使用新的 Map 数据结构
export const Basic: Story = {
  args: {
    checkedIndicators: sampleIndicators,
    handleIndicatorCheck: (key, checked) => console.log('取消选择指标:', key, checked),
    initialCheckedIndicators: new Set([]),
  },
}

// 交互式示例
export const Interactive = () => {
  const [checkedIndicators, setCheckedIndicators] = useState<Map<number, IndicatorTreeIndicator>>(sampleIndicators)

  const handleIndicatorCheck = (key: number, checked: boolean) => {
    setCheckedIndicators((prev) => {
      const newMap = new Map(prev)
      if (!checked) {
        newMap.delete(key)
      }
      return newMap
    })
  }

  return (
    <div style={{ width: '300px' }}>
      <IndicatorSelectedIndicators
        checkedIndicators={checkedIndicators}
        handleIndicatorCheck={handleIndicatorCheck}
        initialCheckedIndicators={new Set([])}
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
