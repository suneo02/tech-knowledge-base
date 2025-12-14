import React, { useState } from 'react'
import '../select.less'
import { WSelectProps, PRIMARY_COLOR_1, SelectOptionProps } from '../type'
import { Select } from '@wind/wind-ui'
const MultiSelect = ({ options, label, suffix, onChange, showVipIcon, showCustom, ...rest }: WSelectProps) => {
  const [selectedItems, setSelectedItems] = useState<SelectOptionProps[]>([])

  const handleChange: WSelectProps['onChange'] = (value: SelectOptionProps[], option) => {
    console.log('🚀 ~ MultiSelect ~ value:', value)

    setSelectedItems(value)
    onChange?.(
      value.map((res) => Object.assign(res, { filterLabel: label })),
      option
    )
  }

  return (
    <div className="select-container">
      {showVipIcon && <i className={`vip-icon ${showVipIcon === 'svip' ? 'svip' : 'vip'}`}></i>}
      <Select
        mode="multiple"
        onChange={handleChange}
        labelInValue={true}
        allowClear={true}
        placeholder={label}
        maxTagCount={0}
        dropdownMatchSelectWidth={false}
        // @ts-ignore
        maxTagPlaceholder={() => (
          <span style={{ color: selectedItems?.length ? PRIMARY_COLOR_1 : '#000' }}>
            {label + selectedItems?.length}
          </span>
        )}
        simple
        maxCount={9}
        style={{ width: 120 }}
        options={options}
        tagRender={(props) => <span style={{ marginInlineStart: 8 }}>{props.label}</span>}
        {...rest}
        data-uc-id="NQFG2fUH8T"
        data-uc-ct="select"
      />
    </div>
  )
}

export default MultiSelect
