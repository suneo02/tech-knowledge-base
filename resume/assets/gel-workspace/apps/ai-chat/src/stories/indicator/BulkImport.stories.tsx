import { BulkImportModalLocal } from '@/components/Indicator/BulkImport'
import { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

const meta = {
  title: 'indicator/BulkImport/BulkImportModalLocal',
  component: BulkImportModalLocal,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof BulkImportModalLocal>

export default meta
type Story = StoryObj<typeof BulkImportModalLocal>

export const Default: Story = {
  args: {
    open: true,
    handleCancel: () => console.log('Modal cancelled'),
  },
}

export const Closed: Story = {
  args: {
    open: false,
    handleCancel: () => console.log('Modal cancelled'),
  },
}
