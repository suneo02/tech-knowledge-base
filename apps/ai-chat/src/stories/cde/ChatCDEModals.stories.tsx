import { ChatCDEModals } from '@/components/CDE/SuperChat/ChatCDEModals'
import { store } from '@/store'
import { Meta, StoryObj } from '@storybook/react'
import { Provider } from 'react-redux'

/**
 * ChatCDEModals story for storybook
 * This component is a collection of CDE modals used in the chat page
 */
const meta: Meta<typeof ChatCDEModals> = {
  title: 'CDE/ChatCDEModals',
  component: ChatCDEModals,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ChatCDEModals>

/**
 * Default story that allows controlling the modal state
 */
export const Default: Story = {
  args: {
    actionModal: undefined,
    tableId: 'test-table-id',
    setActionModal: () => {},
  },
}

/**
 * Story with the CDE filter modal open by default
 */
export const WithCDEModalOpen: Story = {
  args: {
    actionModal: 'cde',
    tableId: 'test-table-id',
    setActionModal: () => {},
  },
}

/**
 * Story with the monitor modal open by default
 */
export const WithMonitorModalOpen: Story = {
  args: {
    actionModal: 'monitor',
    tableId: 'test-table-id',
    setActionModal: () => {},
  },
}

/**
 * Story with the monitor preview modal open by default
 */
export const WithMonitorPreviewOpen: Story = {
  args: {
    actionModal: 'monitorPreview',
    tableId: 'test-table-id',
    setActionModal: () => {},
  },
}
