import { Select } from 'antd'
import type { SelectProps } from 'antd'
import React, { useState } from 'react'

const WSelect = (props: SelectProps) => {
  const { defaultValue, onChange: _onChange, ...rest } = props
  const [value, setValue] = useState(defaultValue)
  return (
    <Select
      style={{ minWidth: 200 }}
      value={value}
      allowClear
      onClear={() => setValue(defaultValue)}
      onChange={(value, options) => _onChange?.(value === undefined ? defaultValue : value, options)}
      {...rest}
    ></Select>
  )
}

export default WSelect
