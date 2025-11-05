import React, { useState, useEffect } from 'react'
import { Checkbox } from '@wind/wind-ui'
import { CustomComponentProps, FilterValue, PrimitiveValue } from '../../../types'
import styles from './index.module.less'
import { CheckboxValueType } from '@wind/wind-ui/es/checkbox/Group'
import NumberRange from '../../basic/NumberRange'

const PREFIX = 'cgnr' // CheckboxGroupWithNumberRange

const CheckboxGroupWithNumberRange: React.FC<CustomComponentProps> = ({
  value,
  onChange,
  options,
  suffix,
  itemRemark,
  defaultValue,
  ...rest
}) => {
  const _suffix = suffix || itemRemark
  const [checkedList, setCheckedList] = useState<(string | number)[]>([])
  const [customRange, setCustomRange] = useState<[number | null, number | null]>([null, null])

  useEffect(() => {
    const initialValues = (value?.value ?? defaultValue ?? []) as (string | number)[]
    if (!Array.isArray(initialValues) || initialValues.length === 0) return

    const optionValues = options?.map((o) => o.value) ?? []
    const newCheckedList: (string | number)[] = []
    let min: number | null = null
    let max: number | null = null
    let customSelected = false

    initialValues.forEach((val) => {
      if (optionValues.includes(val)) {
        newCheckedList.push(val)
      } else if (typeof val === 'string' && /^-?(\d*)-(\d*)-?$/.test(val)) {
        customSelected = true
        const parts = val.split('-')
        const currentMin = parts[0] !== '' ? Number(parts[0]) : null
        const currentMax = parts[1] !== '' ? Number(parts[1]) : null

        if (currentMin !== null) {
          min = min === null ? currentMin : Math.min(min, currentMin)
        }
        if (currentMax !== null) {
          max = max === null ? currentMax : Math.max(max, currentMax)
        }
      }
    })

    if (customSelected) {
      newCheckedList.push('custom')
      setCustomRange([min, max])
    }

    setCheckedList(newCheckedList)
  }, [value, defaultValue, options])

  const getCustomValue = (range: [number | null, number | null] = customRange) => {
    if (range[0] || range[1]) {
      return `${range[0] ? range[0] : ''}-${range[1] ? range[1] : ''}`
    }
    return 'custom'
  }

  const handleRangeChange = (rangeValue?: FilterValue) => {
    const range = (rangeValue?.value as [number | null, number | null]) || [null, null]
    if (range && (range?.[0] || range?.[1])) {
      if (!checkedList.includes('custom')) checkedList.push('custom')
      updateValue(checkedList, range)
    } else {
      updateValue(checkedList.filter((item) => item !== 'custom'))
    }
    setCustomRange(range)
  }

  const updateValue = (value: (string | number)[], range?: [number | null, number | null]) => {
    setCheckedList(value)
    if (value.includes('custom')) {
      const _range = range || customRange
      onChange?.({
        value: [...value.filter((item) => item !== 'custom'), getCustomValue(_range)] as PrimitiveValue,
      })
      return
    }
    onChange?.({ value: value as PrimitiveValue }) // 兼容旧的配置
  }

  const handleGroupChange = (list: CheckboxValueType[]) => {
    updateValue(list)
  }

  return (
    <div className={styles[`${PREFIX}-container`]} {...rest}>
      {/* @ts-expect-error wind-ui */}
      <Checkbox.Group value={checkedList} onChange={handleGroupChange}>
        {options?.map((item) => (
          <Checkbox key={item.value} value={item.value} className={styles[`${PREFIX}-option`]}>
            {item.label}
          </Checkbox>
        ))}
        <Checkbox value={'custom'} className={styles[`${PREFIX}-custom-checkbox`]}>
          <div className={styles[`${PREFIX}-custom-section`]}>
            <div className={styles[`${PREFIX}-custom-label`]}>自定义</div>
            <NumberRange
              value={{ value: customRange as PrimitiveValue }}
              onChange={handleRangeChange}
              suffix={_suffix}
            />
          </div>
        </Checkbox>
      </Checkbox.Group>
    </div>
  )
}

export default CheckboxGroupWithNumberRange
