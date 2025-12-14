import { CDEFilterPreviewModal } from '@/components/CDE/component/FilterPreviewModal'
import { store } from '@/store'
import { Meta, StoryObj } from '@storybook/react'
import { CDEFilterCfgProvider, CDEMeasureDefaultForSL, MeasuresProvider } from 'cde'
import { Provider } from 'react-redux'

/**
 * CDEFilterAndPreviewInner story for storybook
 * This component is a modal for CDE (Corporate Data Explorer) that allows users to filter and preview data
 */
const meta = {
  title: 'CDE/CDEFilterPreviewModal',
  component: CDEFilterPreviewModal,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <CDEFilterCfgProvider>
          <MeasuresProvider measuresDefault={CDEMeasureDefaultForSL}>
            <Story />
          </MeasuresProvider>
        </CDEFilterCfgProvider>
      </Provider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof CDEFilterPreviewModal>

export default meta
type Story = StoryObj<typeof CDEFilterPreviewModal>

/**
 * Default story showing the modal in its closed state
 */
export const Default: Story = {
  args: {
    open: false,
    close: () => console.log('Modal closed'),
    onFinish: (cdeDescription, cdeFilterCondition) => {
      console.log('Finished with:', { cdeDescription, cdeFilterCondition })
    },
    confirmLoading: false,
    confirmText: '添加至表格',
  },
}

/**
 * Story showing the modal in its open state
 */
export const Open: Story = {
  args: {
    ...Default.args,
    open: true,
  },
}

// subscribe mode
export const SubscribeMode: Story = {
  args: {
    ...Default.args,
    defaultViewMode: 'subscribe',
    open: true,
  },
}

/**
 * Story showing the modal with custom dimensions
 */
export const CustomSize: Story = {
  args: {
    open: true,
    close: () => console.log('Modal closed'),
    onFinish: (cdeDescription, cdeFilterCondition) => {
      console.log('Finished with:', { cdeDescription, cdeFilterCondition })
    },
    width: '90%',
    height: '90%',
    confirmLoading: false,
    confirmText: '添加至表格',
  },
}

/**
 * Story showing the modal with confirm loading
 */
export const ConfirmLoading: Story = {
  args: {
    open: true,
    close: () => console.log('Modal closed'),
    onFinish: (cdeDescription, cdeFilterCondition) => {
      console.log('Finished with:', { cdeDescription, cdeFilterCondition })
    },
    confirmLoading: true,
    confirmText: '添加至表格',
  },
}
