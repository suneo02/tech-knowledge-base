import { HomeSider } from '@/components/SuperList/HomeSider'
import { Meta, StoryObj } from '@storybook/react'

import { BrowserRouter } from 'react-router-dom'

const meta: Meta<typeof HomeSider> = {
  title: 'SuperHome/HomeSider',
  component: HomeSider,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ width: '100%', height: '100%' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof HomeSider>

export const Default: Story = {
  args: {},
}

export const Loading: Story = {
  args: {},
}
