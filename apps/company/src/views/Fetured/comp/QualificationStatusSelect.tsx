import { Select } from '@wind/wind-ui'
import React, { FC } from 'react'
import { SelectProps } from '@wind/wind-ui/lib/select'

const SelectOptions = [
  {
    value: '108020200',
    key: '有效',
  },
  {
    value: '108020204',
    key: '拟公告',
  },
  {
    value: '108020207',
    key: '拟通过复核',
  },
  {
    value: '108020205',
    key: '通过复核',
  },
]

export const QualificationStatusSelect: FC<Pick<SelectProps, 'value' | 'onChange'>> = () => {
  return (
    <Select
      mode="combobox"
      options={SelectOptions.map((option) => ({
        ...option,
        label: option.key,
      }))}
    />
  )
}
