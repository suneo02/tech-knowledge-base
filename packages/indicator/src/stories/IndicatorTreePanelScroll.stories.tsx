import { IndicatorTreePanelScroll } from '@/TreePanel/TreePanelScroll'
import type { Meta, StoryObj } from '@storybook/react'

import { IndicatorTreeProvider } from '../TreePanel/context' // Assuming context is needed, like in SwitchPanel
import { indicatorTreeDefault } from './mock/indicatorTreeDefault'

const meta: Meta<typeof IndicatorTreePanelScroll> = {
  title: 'TreePanel/IndicatorTreePanelScroll',
  component: IndicatorTreePanelScroll,
  decorators: [
    (Story) => (
      // Assuming IndicatorTreeProvider is needed here as well for context/hooks within the component
      // If not, this decorator can be removed.
      <IndicatorTreeProvider data={indicatorTreeDefault}>
        <div style={{ height: '600px', border: '1px solid #eee', position: 'relative' }}>
          {' '}
          {/* Added container for better visualization */}
          <Story />
        </div>
      </IndicatorTreeProvider>
    ),
  ],
  parameters: {
    // Adjust layout if fullscreen is not desired for this component
    layout: 'centered',
  },
  argTypes: {
    // Define argTypes for controls in Storybook UI if needed
    loading: { control: 'boolean' },
    confirmLoading: { control: 'boolean' },
    indicatorTree: { control: false }, // Disable control for complex data
    close: { action: 'closed' },
    onConfirm: { action: 'confirmed' },
  },
}

export default meta

type Story = StoryObj<typeof IndicatorTreePanelScroll>

export const Default: Story = {
  args: {
    indicatorTree: indicatorTreeDefault,
    loading: false,
    confirmLoading: false,
    onConfirm: (checkedIndicators) => {
      console.log('Confirmed Indicators:', checkedIndicators)
    },
    close: () => {
      console.log('Close button clicked')
    },
  },
}

export const Loading: Story = {
  args: {
    ...Default.args, // Inherit default args
    loading: true,
  },
}

export const ConfirmLoading: Story = {
  args: {
    ...Default.args, // Inherit default args
    // Note: To see the confirm loading state, you'll need to select an indicator first
    // Then click the confirm button in the Storybook canvas.
    confirmLoading: true,
  },
}

export const EmptyTree: Story = {
  args: {
    ...Default.args, // Inherit default args
    indicatorTree: [],
    loading: false,
  },
}
