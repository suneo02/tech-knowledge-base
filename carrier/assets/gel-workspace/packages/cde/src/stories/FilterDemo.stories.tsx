import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import mock from '../components/FilterMenu/config/mock.json'
import FilterMenuDemo from '../components/FilterMenu/Demo'

const meta: Meta<typeof FilterMenuDemo> = {
  title: 'Components/FilterDemo',
  component: FilterMenuDemo,
  tags: ['autodocs'],
  decorators: [(Story) => <Story />],
}

export default meta
type Story = StoryObj<typeof FilterMenuDemo>

export const WithMockData: Story = {
  args: {
    config: mock.map((item) => ({
      label: item.category,
      value: item.categoryId,
      id: item.categoryId,
      children: item.newFilterItemList,
    })),
  },
  name: '企业数据浏览器',
}
