import { IndicatorTreeOverall } from '@/TreePanel/overall'
import { Meta, StoryObj } from '@storybook/react'
import { indicatorTreeDefault } from './mock/indicatorTreeDefault'

const meta: Meta<typeof IndicatorTreeOverall> = {
  title: 'TreePanel/IndicatorTreeOverall',
  component: IndicatorTreeOverall,
  decorators: [
    (Story) => (
      <div style={{ maxHeight: '100vh', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof IndicatorTreeOverall>

export const Default: Story = {
  args: {
    indicatorTree: indicatorTreeDefault,
  },
}
