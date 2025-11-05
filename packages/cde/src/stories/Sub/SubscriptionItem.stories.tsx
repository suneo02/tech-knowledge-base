import { Meta, StoryObj } from '@storybook/react'

import { ApiCodeForWfc, ApiResponseForWFC, CDESubscribeItem } from 'gel-api'
import { SubscriptionItem } from '../../subscribe/SubscriptionListOverall'

const mockSubscription: CDESubscribeItem = {
  id: '1',
  subName: '高科技公司筛选',
  subPush: false,
  superQueryLogic: JSON.stringify({
    filters: [{ itemId: 'industry', value: '高科技', logic: 'eq' }],
  }),
  subEmail: 'test@example.com',
}

// Mock API response
const mockApiResponse: ApiResponseForWFC<never> = {
  Data: {} as never,
  ErrorCode: ApiCodeForWfc.SUCCESS,
  ErrorMessage: '',
  status: '200',
  Page: {
    CurrentPage: 1,
    PageSize: 10,
    Records: 0,
    TotalPage: 0,
  },
}

const meta: Meta<typeof SubscriptionItem> = {
  title: 'sub/SubscriptionItem',
  component: SubscriptionItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '500px', padding: '24px', border: '1px solid #eee' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SubscriptionItem>

/**
 * 默认展示
 */
export const Default: Story = {
  args: {
    item: mockSubscription,
    getCDESubscribeText: (item) => `筛选条件: ${JSON.parse(item.superQueryLogic).filters[0].value}`,
    onClickApply: (item) => {
      console.log('Apply subscription:', item)
    },
    delSubFunc: async (item) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Delete subscription', item)
      return mockApiResponse
    },
    updateSubFunc: async (item) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Update subscription', item)
      return mockApiResponse
    },
  },
}

/**
 * 删除中状态
 */
export const DeletingState: Story = {
  args: {
    ...Default.args,
    delSubFunc: async (item) => {
      console.log('Delete subscription', item)
      // 模拟删除延迟
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return mockApiResponse
    },
  },
  play: async ({ canvasElement }) => {
    // 点击删除按钮
    const deleteButton = canvasElement.querySelector('button')
    if (deleteButton) {
      deleteButton.click()
    }
  },
}

/**
 * 长名称
 */
export const LongName: Story = {
  args: {
    ...Default.args,
    item: {
      ...mockSubscription,
      subName: '这是一个特别长的订阅名称，用来测试组件在长文本情况下的展示效果和截断处理',
    },
  },
}

/**
 * 长描述文本
 */
export const LongDescription: Story = {
  args: {
    ...Default.args,
    getCDESubscribeText: (item) =>
      `筛选条件: ${JSON.parse(item.superQueryLogic).filters[0].value} | 这是一段很长的描述文本，用来测试组件在长文本情况下的展示效果。可能会出现换行或者省略号等情况。这段文本包含了很多的筛选条件和其他相关信息，用户可以通过这些信息了解订阅内容的详情。`,
  },
}

/**
 * 自定义样式
 */
export const CustomStyle: Story = {
  args: {
    ...Default.args,
    className: 'custom-item-class',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px', padding: '24px', background: '#f5f5f5' }}>
        <Story />
      </div>
    ),
  ],
}

/**
 * 多个筛选条件
 */
export const MultipleFilters: Story = {
  args: {
    ...Default.args,
    item: {
      ...mockSubscription,
      superQueryLogic: JSON.stringify({
        filters: [
          { itemId: 'industry', value: '高科技', logic: 'eq' },
          { itemId: 'scale', value: '大型', logic: 'eq' },
          { itemId: 'region', value: '北京', logic: 'eq' },
        ],
      }),
    },
    getCDESubscribeText: (item) => {
      const filters = JSON.parse(item.superQueryLogic).filters
      return `筛选条件: ${filters.map((f: any) => f.value).join(' + ')}`
    },
  },
}

/**
 * 更新中状态
 */
export const UpdatingState: Story = {
  args: {
    ...Default.args,
    updateSubFunc: async () => {
      // 模拟更新延迟
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return mockApiResponse
    },
  },
}
