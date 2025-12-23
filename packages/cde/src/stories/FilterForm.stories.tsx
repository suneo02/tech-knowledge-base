import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { mockFilterConfig } from '../__mocks__/form/filterConfig.mock'
import { FilterFormItem } from '../components/CdeForm/components/FilterFormItem'

const meta: Meta<typeof FilterFormItem> = {
  title: 'Components/FilterFormItem',
  component: FilterFormItem,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof meta>

const InteractiveFilterForm = () => {
  return (
    <div>
      <FilterFormItem config={mockFilterConfig} />
    </div>
  )
}

export const Default: Story = {
  render: () => <InteractiveFilterForm />,
}
