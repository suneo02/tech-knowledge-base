import {
  mockCDECorpOwnershipCfg,
  mockCDECorpOwnershipCfgDepre,
  mockCDEFinanceCodeCfg,
} from '@/__mocks__/cde/cdeConfig.mock'
import { findCDEItemOptionByValue } from '@/components/filterOptions/OptionViewPort/hook'
import type { Meta, StoryObj } from '@storybook/react'
import { CDEFilterItem } from 'gel-api'
import React, { useState } from 'react'
import { CheckBoxMulti } from '../../components/restructFilter/comps/filterOptions/CheckBoxMulti'

/**
 * @description CheckBoxMulti组件用于展示多级复选框选项，支持全选和部分选择
 */
const meta = {
  title: 'CDE/FilterOption/CheckBoxMulti',
  component: CheckBoxMulti,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CheckBoxMulti>

export default meta
type Story = StoryObj<typeof CheckBoxMulti>

const SelectedValuesComp: React.FC<{ selectedValues: string[]; optionCfg: CDEFilterItem }> = ({
  selectedValues,
  optionCfg,
}) => {
  return (
    <h4>
      <p>当前选中值：{selectedValues.length}</p>
      {selectedValues.map((v) => {
        const item = findCDEItemOptionByValue(optionCfg.itemOption, v)
        return (
          <p key={v}>
            {item?.name} , {item?.value}
          </p>
        )
      })}
    </h4>
  )
}

/**
 * @description 基础多选模式示例
 */
export const Ownership: Story = {
  render: () => {
    const [selectedValues, setSelectedValues] = useState<string[]>([])

    return (
      <div style={{ width: '600px' }}>
        <CheckBoxMulti
          optionsFromConfig={mockCDECorpOwnershipCfg.itemOption}
          onChange={(value) => {
            console.log('Selected values:', value)
            setSelectedValues(value)
          }}
          value={selectedValues}
          data-uc-id="ILd6iGPFf"
          data-uc-ct="checkboxmulti"
        />
        <div style={{ marginTop: '20px' }}>
          <SelectedValuesComp
            selectedValues={selectedValues}
            optionCfg={mockCDECorpOwnershipCfg}
            data-uc-id="glMwmTfWiK"
            data-uc-ct="selectedvaluescomp"
          />
        </div>
      </div>
    )
  },
}

export const OwnershipDeprecated: Story = {
  render: () => {
    const [selectedValues, setSelectedValues] = useState<string[]>([])

    return (
      <div style={{ width: '600px' }}>
        <CheckBoxMulti
          optionsFromConfig={mockCDECorpOwnershipCfgDepre.itemOption}
          onChange={(value) => {
            console.log('Selected values:', value)
            setSelectedValues(value)
          }}
          value={selectedValues}
          data-uc-id="enW7IEhdTU"
          data-uc-ct="checkboxmulti"
        />
        <div style={{ marginTop: '20px' }}>
          <SelectedValuesComp
            selectedValues={selectedValues}
            optionCfg={mockCDECorpOwnershipCfgDepre}
            data-uc-id="EF4Rg0zIwY"
            data-uc-ct="selectedvaluescomp"
          />
        </div>
      </div>
    )
  },
}

export const FinanceCode: Story = {
  render: () => {
    const [selectedValues, setSelectedValues] = useState<string[]>([])

    return (
      <div style={{ width: '600px' }}>
        <CheckBoxMulti
          optionsFromConfig={mockCDEFinanceCodeCfg.itemOption}
          onChange={(value) => {
            console.log('Selected values:', value)
            setSelectedValues(value)
          }}
          value={selectedValues}
          data-uc-id="Lc7FtHIxPU"
          data-uc-ct="checkboxmulti"
        />
        <div style={{ marginTop: '20px' }}>
          <SelectedValuesComp
            selectedValues={selectedValues}
            optionCfg={mockCDEFinanceCodeCfg}
            data-uc-id="3zBA9KNiBV"
            data-uc-ct="selectedvaluescomp"
          />
        </div>
      </div>
    )
  },
}

/**
 * @description 带初始值的多选模式示例
 */
export const WithInitialValue: Story = {
  render: () => {
    const [selectedValues, setSelectedValues] = useState<string[]>(['2010100664', '2010100765'])

    return (
      <div style={{ width: '600px' }}>
        <CheckBoxMulti
          optionsFromConfig={mockCDECorpOwnershipCfg.itemOption}
          onChange={(value) => {
            console.log('Selected values:', value)
            setSelectedValues(value)
          }}
          value={selectedValues}
          data-uc-id="WVVddieMqZ"
          data-uc-ct="checkboxmulti"
        />
        <div style={{ marginTop: '20px' }}>
          <SelectedValuesComp
            selectedValues={selectedValues}
            optionCfg={mockCDECorpOwnershipCfg}
            data-uc-id="5gL2HLm4Ml"
            data-uc-ct="selectedvaluescomp"
          />
        </div>
      </div>
    )
  },
}
