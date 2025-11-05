import { Radio } from '@wind/wind-ui'
import React from 'react'
import { CustomComponentProps, FilterOption, PrimitiveValue } from '../../../types'
import styles from './index.module.less'

const PREFIX = 'base-radio-group'
const STRINGS = {
  all: '不限',
}

const RadioGroup: React.FC<CustomComponentProps> = ({ value, onChange, options, defaultValue, ...restProps }) => {
  console.log('🚀 ~ value:', value)
  const handleChange = (e: any) => {
    const newValue = e.target.value
    onChange?.({
      ...value,
      value: newValue as PrimitiveValue,
    })
  }

  return (
    <Radio.Group
      value={value?.value || defaultValue}
      onChange={handleChange}
      {...restProps}
      className={styles[`${PREFIX}-container`]}
    >
      <Radio key={''} value={''} className={styles[`${PREFIX}-option`]}>
        {STRINGS.all}
      </Radio>
      {options?.map((option: FilterOption) => (
        <Radio key={option.value} value={option.value} className={styles[`${PREFIX}-option`]}>
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  )
}

export default RadioGroup
