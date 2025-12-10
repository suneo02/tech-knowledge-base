import { CDEFilterConsoleFooter } from '@/components/CDE/component/CDEFilterConsoleFooter'
import { Meta, StoryObj } from '@storybook/react'
import { CDEFilterItemUser } from 'cde'
import { ApiCodeForWfc, TRequestToWFCSpacfic } from 'gel-api'

/**
 * CDEFilterConsoleFooter component story
 *
 * This component is the footer for the CDE Filter Console, containing buttons for saving filters,
 * resetting filters, adding data to a table, and switching view modes.
 */
const meta = {
  title: 'CDE/CDEFilterConsoleFooter',
  component: CDEFilterConsoleFooter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CDEFilterConsoleFooter>

export default meta
type Story = StoryObj<typeof CDEFilterConsoleFooter>

// Mock filter items for demonstration
const mockFilters: CDEFilterItemUser[] = [
  {
    title: '营业状态',
    itemId: 77,
    logic: 'any',
    field: 'govlevel',
    value: ['存续'],
  },
  {
    title: '机构类型',
    itemId: 78,
    logic: 'any',
    field: 'data_from',
    value: ['298010000,298020000,298040000'],
  },
]

/**
 * Default story showing the footer in its basic state
 */
export const Default: Story = {
  args: {
    hasValidFilter: true,
    resetFilters: () => console.log('Reset filters'),
    filtersValid: mockFilters,
    saveSubFunc: (async () => ({
      Data: { id: '123' },
      ErrorCode: ApiCodeForWfc.SUCCESS,
      ErrorMessage: '',
      Page: {},
      status: '200',
    })) as unknown as TRequestToWFCSpacfic<'operation/insert/addsubcorpcriterion'>,
    onSaveFilterFinish: () => console.log('Save filter finished'),
    total: 1500,
    confirmLoading: false,
    handleAddToTable: () => console.log('Add to table'),
    style: {
      width: '800px',
    },
    confirmText: '添加至表格',
  },
}

/**
 * Story showing the footer in subscribe view mode
 */
export const SubscribeViewMode: Story = {
  args: {
    ...Default.args,
  },
}

/**
 * Story showing the footer with no valid filters
 */
export const NoValidFilters: Story = {
  args: {
    ...Default.args,
    hasValidFilter: false,
    filtersValid: [],
    total: 0,
  },
}

/**
 * no total
 */
export const NoTotal: Story = {
  args: {
    ...Default.args,
    total: undefined,
  },
}

/**
 * Story showing the footer in loading state
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    confirmLoading: true,
  },
}

/**
 * 大量数据
 */
export const LargeData: Story = {
  args: {
    ...Default.args,
    total: 150012312430,
  },
}

/**
 * zero data
 */
export const ZeroData: Story = {
  args: {
    ...Default.args,
    total: 0,
  },
}
