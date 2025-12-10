import { CDESubscribeModals } from '@/subscribe'
import { Meta, StoryObj } from '@storybook/react'

import { ApiCodeForWfc, ApiResponseForWFC, CDESubscribeItem } from 'gel-api'

const meta: Meta<typeof CDESubscribeModals> = {
  title: 'sub/CDESubscribeModals',
  component: CDESubscribeModals,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CDESubscribeModals>

// Mock data
const mockSubscribeItem = {
  id: '1',
  subName: '测试订阅',
  superQueryLogic:
    '{"queryLogic":"AND","queryItems":[{"fieldName":"companyName","operator":"CONTAINS","value":"科技"}]}',
  createTime: '2024-04-02',
  updateTime: '2024-04-02',
  subPush: true,
} as CDESubscribeItem

// Mock API response
const mockApiResponse = {
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
} as const satisfies ApiResponseForWFC<never>

// Mock functions
const mockFunctions = {
  close: () => console.log('Modal closed'),
  fetchCDESubscriptions: () => console.log('Fetching subscriptions...'),
  handleClickApply: (item: CDESubscribeItem) => console.log('Apply clicked:', item),
  updateSubFunc: async () => mockApiResponse,
  addSubFunc: async () => mockApiResponse,
}

// Base story with common props
const baseStory: Story = {
  args: {
    actionModal: null,
    close: mockFunctions.close,
    fetchCDESubscriptions: mockFunctions.fetchCDESubscriptions,
    handleClickApply: mockFunctions.handleClickApply,
    subEmail: 'test@example.com',
    updateSubFunc: mockFunctions.updateSubFunc,
    addSubFunc: mockFunctions.addSubFunc,
  },
}

// Story variants
export const Default: Story = {
  ...baseStory,
}

export const SaveMode: Story = {
  ...baseStory,
  args: {
    ...baseStory.args,
    actionModal: {
      type: 'save',
      item: {
        superQueryLogic: mockSubscribeItem.superQueryLogic!,
        subName: '新建订阅',
      },
    },
  },
}

export const EditMode: Story = {
  ...baseStory,
  args: {
    ...baseStory.args,
    actionModal: {
      type: 'edit',
      item: mockSubscribeItem,
    },
  },
}

export const WithoutEmail: Story = {
  ...baseStory,
  args: {
    ...baseStory.args,
    subEmail: undefined,
    actionModal: {
      type: 'save',
      item: {
        superQueryLogic: mockSubscribeItem.superQueryLogic!,
      },
    },
  },
}
