import type { Meta, StoryObj } from '@storybook/react'

import { QuickBtnGroup } from '../../components/SuperList/HomeContent/QuickBtnGroup'

const meta = {
  title: 'SuperHome/QuickBtnGroup',
  component: QuickBtnGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QuickBtnGroup>

export default meta
type Story = StoryObj<typeof QuickBtnGroup>

export const Default: Story = {
  args: {
    onClickCDE: () => console.log('CDE clicked'),
    onClickUpload: () => console.log('Upload clicked'),
  },
}

export const WithCustomClass: Story = {
  args: {
    className: 'custom-class',
    onClickCDE: () => console.log('CDE clicked'),
    onClickUpload: () => console.log('Upload clicked'),
  },
}
