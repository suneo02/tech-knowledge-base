import { mockCDECorpOwnershipCfg } from '@/__mocks__/cde/cdeConfig.mock'
import type { Meta, StoryObj } from '@storybook/react'
import { CheckBoxOption } from '../../components/restructFilter/comps/filterOptions/CheckBoxOption'

/**
 * @description CheckBoxOption组件用于展示复选框选项，支持单选和多选模式，可自定义选项内容
 */
const meta: Meta<typeof CheckBoxOption> = {
  title: 'CDE/FilterOption/CheckBoxOption',
  component: CheckBoxOption,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CheckBoxOption>

/**
 * @description 基础单选模式示例
 */
export const Default: Story = {
  args: {
    changeOptionCallback: (value) => {
      console.log('Selected values:', value)
    },
    value: [],
    filterItem: mockCDECorpOwnershipCfg,
  },
}
