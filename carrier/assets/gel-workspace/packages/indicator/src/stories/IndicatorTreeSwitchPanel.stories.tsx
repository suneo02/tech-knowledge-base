import { IndicatorTreePanelSwitch } from '@/TreePanel/TreePanelSwitch'
import type { Meta, StoryObj } from '@storybook/react'

import { IndicatorTreeProvider } from '../TreePanel/context'
import { indicatorTreeDefault } from './mock/indicatorTreeDefault'
const meta: Meta<typeof IndicatorTreePanelSwitch> = {
  title: 'TreePanel/IndicatorTreePanelSwitch',
  component: IndicatorTreePanelSwitch,
  decorators: [
    (Story) => (
      <IndicatorTreeProvider data={indicatorTreeDefault}>
        <div style={{ maxHeight: '100vh', height: '100vh' }}>
          <Story />
        </div>
      </IndicatorTreeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof IndicatorTreePanelSwitch>

export const Default: Story = {
  args: {
    onConfirm: (checkedIndicators, classificationList) => {
      console.log(checkedIndicators, classificationList)
    },
  },
}
