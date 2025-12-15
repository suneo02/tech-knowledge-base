//@ts-nocheck
import React from 'react'
import '../select.less'
import { PRIMARY_COLOR_1, SelectOptionProps, WSelectProps } from '../type'
import { Select } from '@wind/wind-ui'
import { LabeledValue } from '@wind/wind-ui/lib/select'

const SingleSelect = ({ options, label, onChange, value, showVipIcon, ...rest }: WSelectProps) => {
  const handleChange: WSelectProps['onChange'] = (value, option) => {
    const val = (options as SelectOptionProps[]).find((res) => res.value === (value as LabeledValue)?.value)
    onChange?.({ ...val, filterLabel: label }, option)
  }
  return (
    <div className="select-container">
      {showVipIcon && <i className={`vip-icon ${showVipIcon === 'svip' ? 'svip' : 'vip'}`}></i>}
      <Select
        labelInValue
        onChange={handleChange}
        placeholder={label}
        style={{ width: 120 }}
        options={options}
        {...rest}
        value={value?.value ? { ...value, label: <span style={{ color: PRIMARY_COLOR_1 }}>{label}1</span> } : value}
        data-uc-id="fwJvgp5BOz"
        data-uc-ct="select"
      />
    </div>
  )
}

export default SingleSelect
