import { Checkbox } from '@wind/wind-ui'
import { CDEFilterItem } from 'gel-api/*'
import React, { FC, useMemo } from 'react'

export const CheckBoxGroupForOptionViewport: FC<{
  value: string[]
  itemOptions: CDEFilterItem['itemOption']
  onChange: () => void
}> = ({ value, itemOptions, onChange }) => {
  const optionsFiltered = useMemo<
    {
      label: string
      value: string
    }[]
  >(() => {
    return itemOptions
      .filter((item) => {
        return item.value !== '-1'
      })
      .map((item) => ({
        label: item.label || item.name,
        value: Array.isArray(item.value) ? item.value.join(',') : item.value,
      }))
  }, [itemOptions])
  return <Checkbox.Group value={value} options={optionsFiltered} onChange={() => onChange()} />
}
