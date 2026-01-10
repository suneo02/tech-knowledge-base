import { CompanyTableSelectOptionItem, CompanyTableSelectOptions, CorpTableCfg } from '@/types/corpDetail'
import { Select } from '@wind/wind-ui'
import { result } from 'lodash'
import React, { FC } from 'react'

const Option = Select.Option

// 获取当前索引对应的选项数据
const getCurrentOptions = (
  selOption: CompanyTableSelectOptions | undefined,
  index: number
): CompanyTableSelectOptionItem[] => {
  if (!selOption?.length) return []

  const currentOption = selOption[index]
  if (!currentOption) return []

  // 遍历对象的所有键，找到有效的 items 数组
  for (const key in currentOption) {
    const items = currentOption[key]
    if (items?.length) {
      return items
    }
  }

  return []
}

// 渲染单个 Option
const renderOption = (item: CompanyTableSelectOptionItem) => {
  // 本企业投标单独处理 相当于 全部筛选项，但有计数
  const disabled = item.doc_count === 0 && item.key !== '本企业投标'
  const countText = item.doc_count ? `(${result?.length ? item.doc_count : 0})` : ''

  return (
    <Option
      onChange
      key={item.key}
      value={item.value}
      disabled={disabled}
      data-uc-id={`X2YFHkWlsXf${item.key}`}
      data-uc-ct="option"
      data-uc-x={item.key}
    >
      {item.key + countText}
    </Option>
  )
}

export const CompanyTableRightSelect: FC<{
  index: number
  selOptionValue: string[]
  t: any
  eachTable: CorpTableCfg<any>
  handleSelectChange: (value: string, t: any, index: number) => void
  selOption: CompanyTableSelectOptions
}> = ({ index, selOptionValue, t, eachTable, handleSelectChange, selOption }) => {
  const options = getCurrentOptions(selOption, index)

  return (
    <Select
      key={index}
      defaultValue={t.name}
      value={selOptionValue[index]}
      style={{
        width: t.width || 120,
        marginRight: index == eachTable.rightFilters.length - 1 && !eachTable.downDocType ? 0 : 10,
      }}
      onChange={(val) => {
        handleSelectChange(val, t, index)
      }}
      data-uc-id="FXCNakypfL"
      data-uc-ct="select"
      data-uc-x={index}
    >
      {options.map(renderOption)}
    </Select>
  )
}
