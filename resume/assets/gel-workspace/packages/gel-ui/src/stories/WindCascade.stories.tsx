import { Meta, StoryObj } from '@storybook/react'
import { globalAreaTreeCn, industryOfNationalEconomyCfg } from 'gel-util/config'
import { WindCascade } from '../cascade'
import { WindCascadeProps } from '../cascade/type'

const meta = {
  title: 'Components/WindCascade',
  component: WindCascade,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '级联选择器组件，支持多选和自定义字段名',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: '可选项数据源',
      control: 'object',
    },
    value: {
      description: '指定选中的选项',
      control: 'object',
    },
    onChange: {
      description: '选择完成后的回调',
      action: 'changed',
    },
    placeholder: {
      description: '输入框占位文本',
      control: 'text',
    },
    fieldNames: {
      description: '自定义 options 中 label value children 的字段',
      control: 'object',
    },
    style: {
      description: '自定义样式',
      control: 'object',
    },
    defaultOpen: {
      description: '是否默认展开下拉菜单',
      control: 'boolean',
    },
  },
} satisfies Meta<WindCascadeProps<any, any>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: [],
    style: { width: '500px' },
    onChange: console.log,
  },
}
// 禁用状态
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    style: { width: '300px' },
    placeholder: '请选择',
  },
}

export const AreaCascade: Story = {
  args: {
    ...Default.args,
    options: globalAreaTreeCn,
    fieldNames: {
      label: 'name',
      value: 'code',
      children: 'node',
    },
    dropdownMatchSelectWidth: true,
  },
}

export const AreaCascadeEn: Story = {
  args: {
    ...AreaCascade.args,
    options: globalAreaTreeCn,
    fieldNames: {
      label: 'nameEn',
      value: 'code',
      children: 'node',
    },
    open: true,
  },
}

export const IndustryCascade: Story = {
  args: {
    ...Default.args,
    options: industryOfNationalEconomyCfg,
    fieldNames: {
      label: 'nameEn',
      value: 'code',
      children: 'node',
    },
    open: true,
  },
}

export const DefaultOpen: Story = {
  args: {
    ...AreaCascade.args,
    defaultOpen: true,
  },
}

export const Open: Story = {
  args: {
    ...DefaultOpen.args,
    open: true,
  },
}

export const DropdownWidth: Story = {
  args: {
    ...IndustryCascade.args,
    dropdownMenuColumnStyle: {
      width: 280,
    },
  },
}

export const DropdownMatchSelectWidth: Story = {
  args: {
    ...IndustryCascade.args,
    dropdownMatchSelectWidth: true,
  },
}
