import { Meta, StoryObj } from '@storybook/react'

import { ApiCodeForWfc, ApiResponseForWFC, CDESubscribeItem } from 'gel-api'
import { CDEUpdateSubButton } from '../../components/UpdateSubBtn'

const mockSubscription: CDESubscribeItem = {
  id: '1',
  subName: '高科技公司筛选',
  subPush: false,
  superQueryLogic: JSON.stringify({
    filters: [{ itemId: 'industry', value: '高科技', logic: 'eq' }],
  }),
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

const meta: Meta<typeof CDEUpdateSubButton> = {
  title: 'sub/CDEUpdateSubButton',
  component: CDEUpdateSubButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', border: '1px solid #eee' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CDEUpdateSubButton>

/**
 * 默认展示
 */
export const Default: Story = {
  args: {
    item: mockSubscription,
    updateSubFunc: async () => {
      console.log('Update subscription')
      return mockApiResponse
    },
    onUpdateFinish: () => {
      console.log('Update finished')
    },
  },
}

/**
 * 自定义按钮文本
 */
export const CustomButtonText: Story = {
  args: {
    ...Default.args,
    buttonText: '修改订阅',
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
  play: async ({ canvasElement }) => {
    // 点击更新按钮，然后点击确认按钮
    const updateButton = canvasElement.querySelector('button')
    if (updateButton) {
      updateButton.click()
      // Simulate typing into the input
      setTimeout(() => {
        const confirmButton = document.querySelector('.filter-popover__button-group button:last-child')
        if (confirmButton) {
          ;(confirmButton as HTMLButtonElement).click()
        }
      }, 500)
    }
  },
}
