import { SuperLogoSection } from '@/components/SuperList/HomeSider/LogoSection'
import { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

const meta: Meta<typeof SuperLogoSection> = {
  title: 'SuperHome/SuperLogoSection',
  component: SuperLogoSection,
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

type Story = StoryObj<typeof SuperLogoSection>

export const Default: Story = {
  args: {
    collapse: false,
    toggleCollapse: () => {},
  },
}

export const Collapsed: Story = {
  args: {
    collapse: true,
    toggleCollapse: () => {},
  },
}
