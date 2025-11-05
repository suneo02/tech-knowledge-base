import { CDEFilterCfgProvider } from '@/ctx'
import type { Meta, StoryObj } from '@storybook/react'

import { CDEFilterMenu } from '../components/FilterMenu'
import { filterCfg } from './mock/filterCfg'

const meta: Meta<typeof CDEFilterMenu> = {
  title: 'panel/FilterMenu',
  component: CDEFilterMenu,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <CDEFilterCfgProvider filterCfgDefault={filterCfg}>
        <div style={{ width: 200 }}>
          <Story />
        </div>
      </CDEFilterCfgProvider>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CDEFilterMenu>

// 基础用例
export const Basic: Story = {
  args: {
    current: 0,
    onSelect: (index) => console.log('Selected:', index),
    filters: undefined,
  },
}

// 带有选中项和过滤条件的用例
export const WithFilters: Story = {
  args: {
    current: 1,
    onSelect: (index) => console.log('Selected:', index),
    filters: [
      {
        title: '营业状态',
        itemId: 77,
        logic: 'any',
        field: 'govlevel',
        value: ['存续'],
      },
      {
        title: '机构类型',
        itemId: 78,
        logic: 'any',
        field: 'data_from',
        value: ['298010000,298020000,298040000'],
      },
    ],
  },
}

// 全部类别都有过滤条件的用例
export const AllFiltered: Story = {
  args: {
    current: 2,
    onSelect: (index) => console.log('Selected:', index),
    filters: [
      {
        title: '营业状态',
        itemId: 77,
        logic: 'any',
        field: 'govlevel',
        value: ['存续'],
      },
      {
        title: '机构类型',
        itemId: 78,
        logic: 'any',
        field: 'data_from',
        value: ['298010000,298020000,298040000'],
      },
    ],
  },
}
