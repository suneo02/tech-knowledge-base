import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import Cascader from '../../components/FilterForm/FilterItem/basic/Cascader'
import { FilterConfigItem } from '../../components/FilterForm/types'

const meta: Meta<typeof Cascader> = {
  title: 'FilterForm/Cascader',
  component: Cascader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const mockOptions = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]

const filterConfig: FilterConfigItem = {
  itemId: 'area',
  itemName: 'Area',
  itemType: 'cascader',
  options: mockOptions,
}

export const Basic: Story = {
  args: {
    ...filterConfig,
    placeholder: 'Please select an area',
  },
}

export const WithDefaultValue: Story = {
  args: {
    ...filterConfig,
    value: { value: ['zhejiang', 'hangzhou', 'xihu'] },
  },
}

export const CustomRender: Story = {
  args: {
    ...filterConfig,
    displayRender: (labels: string[]) => labels.join(' / '),
    placeholder: 'Select area with custom render',
  },
}
