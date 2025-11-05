import { Meta, StoryObj } from '@storybook/react'

import { CDEFilterItem, CDEFilterOption } from 'gel-api'
import { useState } from 'react'

import { CheckBoxOption } from '../../FilterItem/filterOptions/CheckBox/CheckBoxOption'

const meta: Meta<typeof CheckBoxOption> = {
  title: 'filter_comp/CheckBoxOption',
  component: CheckBoxOption,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '24px', border: '1px solid #eee' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CheckBoxOption>

// Mock filter item for basic usage
const basicFilterItem: CDEFilterItem = {
  itemType: '3',
  itemEn: 'capital_amount',
  selfDefine: 2,
  itemOption: [
    {
      name: '100万以内',
      value: '0-100',
    },
    {
      name: '100万-500万',
      value: '100-500',
    },
    {
      name: '500万-1000万',
      value: '500-1000',
    },
    {
      name: '1000万-3000万',
      value: '1000-3000',
    },
    {
      name: '3000万-5000万',
      value: '3000-5000',
    },
    {
      name: '5000万以上',
      value: '5000-',
    },
  ],
  hasExtra: false,
  parentId: 0,
  isVip: 0,
  itemId: 10,
  itemName: '注册资本',
  itemField: 'register_capital',
  itemRemark: '万',
  logicOption: 'range',
}

// Basic options for simple checkbox group
const basicOptions: CDEFilterOption[] = [
  {
    name: '100万以内',
    value: '0-100',
  },
  {
    name: '100万-500万',
    value: '100-500',
  },
  {
    name: '500万-1000万',
    value: '500-1000',
  },
  {
    name: '1000万-3000万',
    value: '1000-3000',
  },
  {
    name: '3000万-5000万',
    value: '3000-5000',
  },
  {
    name: '5000万以上',
    value: '5000-',
  },
]
// Options with hover hints
const optionsWithHints: CDEFilterOption[] = [
  { name: '选项一', value: 'option1', hoverHint: '这是选项一的提示信息' },
  { name: '选项二', value: 'option2', hoverHint: '这是选项二的提示信息' },
  { name: '选项三', value: 'option3' },
  { name: '选项四', value: 'option4', hoverHint: '这是选项四的提示信息' },
]

// Multi-level options for hierarchical checkboxes
const multiLevelOptions: CDEFilterOption[] = [
  {
    name: '分组一',
    value: 'group1',
    itemOption: [
      { name: '子选项 1-1', value: 'option1-1' },
      { name: '子选项 1-2', value: 'option1-2' },
      {
        name: '子选项 1-3',
        value: 'option1-3',
        itemOption: [
          { name: '三级选项 1-3-1', value: 'option1-3-1' },
          { name: '三级选项 1-3-2', value: 'option1-3-2' },
        ],
      },
    ],
  },
  {
    name: '分组二',
    value: 'group2',
    itemOption: [
      { name: '子选项 2-1', value: 'option2-1' },
      { name: '子选项 2-2', value: 'option2-2' },
    ],
  },
]

/**
 * 基础复选框组（非受控模式）
 *
 * 展示普通的平铺复选框组模式，使用非受控方式（通过defaultValue设置初始值）
 */
export const Basic: Story = {
  args: {
    itemOption: basicOptions,
    info: basicFilterItem,
    defaultValue: ['0-100'],
    onChange: (values) => console.log('Selected values:', values),
  },
}

/**
 * 基础复选框组（受控模式）
 *
 * 展示普通的平铺复选框组模式，使用受控方式（通过value传入值）
 */
export const BasicControlled: Story = {
  args: {
    itemOption: basicOptions,
    info: basicFilterItem,
    value: ['0-100'],
    onChange: (values) => console.log('Selected values:', values),
  },
}

/**
 * 带提示信息的复选框组（非受控）
 *
 * 展示包含鼠标悬停提示信息的复选框组，使用非受控方式
 */
export const WithHoverHints: Story = {
  args: {
    itemOption: optionsWithHints,
    defaultValue: ['option1'],
    info: basicFilterItem,
    onChange: (values) => console.log('Selected values:', values),
  },
}

/**
 * 带提示信息的复选框组（受控）
 *
 * 展示包含鼠标悬停提示信息的复选框组，使用受控方式
 */
export const WithHoverHintsControlled: Story = {
  args: {
    itemOption: optionsWithHints,
    value: ['option1'],
    info: basicFilterItem,
    onChange: (values) => console.log('Selected values:', values),
  },
}

/**
 * 多级嵌套复选框（非受控）
 *
 * 展示多级嵌套的复选框组，支持最多三级嵌套和全选/半选状态，使用非受控方式
 */
export const MultiLevel: Story = {
  args: {
    itemOption: multiLevelOptions,
    defaultValue: ['option1-1', 'option1-3-1'],
    info: {
      ...basicFilterItem,
      itemName: '多级复选框',
    },
    multiCbx: 1,
    onChange: (values) => console.log('Selected values:', values),
  },
}

/**
 * 多级嵌套复选框（受控）
 *
 * 展示多级嵌套的复选框组，支持最多三级嵌套和全选/半选状态，使用受控方式
 */
export const MultiLevelControlled: Story = {
  args: {
    itemOption: multiLevelOptions,
    value: ['option1-1', 'option1-3-1'],
    info: {
      ...basicFilterItem,
      itemName: '多级复选框',
    },
    multiCbx: 1,
    onChange: (values) => console.log('Selected values:', values),
  },
}

/**
 * 支持自定义日期（非受控）
 *
 * 展示带日期选择器的复选框组，使用非受控方式
 */
export const WithDateCustomization: Story = {
  args: {
    itemOption: basicOptions,
    defaultValue: ['option1', '2023-01-01-2023-12-31'],
    info: {
      ...basicFilterItem,
      itemName: '日期选择',
      selfDefine: 2, // 使用2，表示自定义输入
    },
    onChange: (values) => console.log('Selected values:', values),
  },
}

/**
 * 支持自定义日期（受控）
 *
 * 展示带日期选择器的复选框组，使用受控方式
 */
export const WithDateCustomizationControlled: Story = {
  args: {
    itemOption: basicOptions,
    value: ['option1', '2023-01-01-2023-12-31'],
    info: {
      ...basicFilterItem,
      itemName: '日期选择',
      selfDefine: 2, // 使用2，表示自定义输入
    },
    onChange: (values) => console.log('Selected values:', values),
  },
}

/**
 * 支持自定义数值范围（非受控）
 *
 * 展示带数值范围输入的复选框组，使用非受控方式
 */
export const WithNumberRangeCustomization: Story = {
  args: {
    itemOption: basicOptions,
    defaultValue: ['option1', '100-500'],
    info: {
      ...basicFilterItem,
      itemName: '数值范围',
      selfDefine: 2, // 2代表数值范围
      itemRemark: '万元', // 单位
    },
    onChange: (values) => console.log('Selected values:', values),
  },
}

/**
 * 支持自定义数值范围（受控）
 *
 * 展示带数值范围输入的复选框组，使用受控方式
 */
export const WithNumberRangeCustomizationControlled: Story = {
  args: {
    itemOption: basicOptions,
    value: ['option1', '100-500'],
    info: {
      ...basicFilterItem,
      itemName: '数值范围',
      selfDefine: 2, // 2代表数值范围
      itemRemark: '万元', // 单位
    },
    onChange: (values) => console.log('Selected values:', values),
  },
}

/**
 * 交互式示例（受控）
 *
 * 提供可交互的复选框组示例，展示状态变更
 */
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['option1'])
    return (
      <div>
        <CheckBoxOption
          itemOption={basicOptions}
          info={basicFilterItem}
          value={value}
          multiCbx={1}
          onChange={setValue}
        />
        <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f5f5f5' }}>
          当前选中: {value.join(', ') || '(无)'}
        </div>
      </div>
    )
  },
}

/**
 * 交互式示例（非受控）
 *
 * 提供可交互的复选框组示例，展示非受控模式的使用
 * 注意：由于是非受控模式，外部无法直接获取到最新值，需要通过回调函数获取
 */
export const InteractiveUncontrolled: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState<string[]>(['option1'])

    const handleChange = (values: string[]) => {
      console.log('Values changed:', values)
      setSelectedValue(values)
    }

    return (
      <div>
        <CheckBoxOption
          itemOption={basicOptions}
          info={basicFilterItem}
          defaultValue={['option1']}
          multiCbx={1}
          onChange={handleChange}
        />
        <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f5f5f5' }}>
          最后一次选中: {selectedValue.join(', ') || '(无)'}
        </div>
      </div>
    )
  },
}

/**
 * 多级嵌套交互式示例（受控）
 *
 * 提供可交互的多级复选框组示例，展示嵌套选择和父子选项联动
 */
export const MultiLevelInteractive: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['option1-1'])
    return (
      <div>
        <CheckBoxOption
          itemOption={multiLevelOptions}
          info={{
            ...basicFilterItem,
            itemName: '多级复选框',
          }}
          value={value}
          multiCbx={1}
          onChange={setValue}
        />
        <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f5f5f5' }}>
          当前选中: {value.join(', ') || '(无)'}
        </div>
      </div>
    )
  },
}

/**
 * 多级嵌套交互式示例（非受控）
 *
 * 提供可交互的多级复选框组示例，使用非受控模式
 */
export const MultiLevelInteractiveUncontrolled: Story = {
  render: () => {
    const [lastSelected, setLastSelected] = useState<string[]>(['option1-1'])

    return (
      <div>
        <CheckBoxOption
          itemOption={multiLevelOptions}
          info={{
            ...basicFilterItem,
            itemName: '多级复选框',
          }}
          defaultValue={['option1-1']}
          multiCbx={1}
          onChange={(values) => setLastSelected(values)}
        />
        <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f5f5f5' }}>
          最后一次选中: {lastSelected.join(', ') || '(无)'}
        </div>
      </div>
    )
  },
}

/**
 * 带自定义日期交互式示例（受控）
 *
 * 展示如何交互式使用带日期选择的复选框组
 */
export const DateCustomizationInteractive: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['option1'])
    return (
      <div>
        <CheckBoxOption
          itemOption={basicOptions}
          info={{
            ...basicFilterItem,
            itemName: '日期范围',
            selfDefine: 2,
          }}
          value={value}
          multiCbx={1}
          onChange={setValue}
        />
        <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f5f5f5' }}>
          当前选中: {value.join(', ') || '(无)'}
        </div>
      </div>
    )
  },
}

/**
 * 带自定义数值范围交互式示例（受控）
 *
 * 展示如何交互式使用带数值范围输入的复选框组
 */
export const NumberRangeCustomizationInteractive: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['option1'])
    return (
      <div>
        <CheckBoxOption
          itemOption={basicOptions}
          info={{
            ...basicFilterItem,
            itemName: '数值范围',
            selfDefine: 2,
            itemRemark: '万元',
          }}
          value={value}
          multiCbx={1}
          onChange={setValue}
        />
        <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f5f5f5' }}>
          当前选中: {value.join(', ') || '(无)'}
        </div>
      </div>
    )
  },
}

/**
 * 全选状态示例（非受控）
 *
 * 展示所有选项被选中的状态，使用非受控方式
 */
export const AllSelected: Story = {
  args: {
    itemOption: basicOptions,
    defaultValue: basicOptions.map((opt) => (typeof opt.value === 'string' ? opt.value : opt.value?.[0] || '')),
    info: basicFilterItem,
    onChange: (values) => console.log('Selected values:', values),
  },
}

/**
 * 空选项示例（非受控）
 *
 * 展示没有选中任何选项的状态，使用非受控方式
 */
export const EmptySelection: Story = {
  args: {
    itemOption: basicOptions,
    defaultValue: [],
    info: basicFilterItem,
    onChange: (values) => console.log('Selected values:', values),
  },
}
