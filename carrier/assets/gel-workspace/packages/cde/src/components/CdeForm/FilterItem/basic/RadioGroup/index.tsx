import { Radio } from '@wind/wind-ui'
import React from 'react'
import { CustomComponentProps, FilterOption } from '../../../types'
import { useSingleValue } from '../../../hooks/useSingleValue'
import styles from './index.module.less'

const PREFIX = 'base-radio-group'
const STRINGS = {
  all: '不限',
}

const RadioGroup: React.FC<CustomComponentProps> = ({ value, onChange, options, defaultValue, ...restProps }) => {
  // 无论 value.value 或 defaultValue 是数组还是单值，都转换为单值
  const radioValue = useSingleValue(value?.value ?? defaultValue)

  const handleChange = (e: any) => {
    const newValue = e.target.value as string
    onChange?.({
      ...value,
      value: newValue,
    })
  }

  return (
    <Radio.Group value={radioValue} onChange={handleChange} {...restProps} className={styles[`${PREFIX}-container`]}>
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
