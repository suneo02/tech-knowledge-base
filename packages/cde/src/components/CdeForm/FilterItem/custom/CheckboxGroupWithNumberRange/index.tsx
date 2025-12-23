import { Checkbox, message } from '@wind/wind-ui'
import { CheckboxValueType } from '@wind/wind-ui/es/checkbox/Group'
import React, { useEffect, useState } from 'react'
import { CustomComponentProps } from '../../../types'
import NumberRange from '../../basic/NumberRange'
import styles from './index.module.less'

const PREFIX = 'cgnr' // CheckboxGroupWithNumberRange

type CheckedValue = null | number | string
type RangeValue = [CheckedValue, CheckedValue]

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
  const [checkedList, setCheckedList] = useState<CheckedValue[]>([])
  const [customRange, setCustomRange] = useState<RangeValue>([null, null])

  useEffect(() => {
    const initialValues = (value?.value ?? defaultValue ?? []) as CheckedValue[]
    if (!Array.isArray(initialValues) || initialValues.length === 0) return

    const optionValues = options?.map((o) => o.value) ?? []
    const newCheckedList: CheckedValue[] = []
    let min: number | null = null
    let max: number | null = null
    let customSelected = false

    initialValues.forEach((val) => {
      if (optionValues.includes(val as string)) {
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

  const getCustomValue = (range: RangeValue = customRange) => {
    if (range[0] !== null || range[1] !== null) {
      return `${range[0] ?? ''}-${range[1] ?? ''}`
    }
    return 'custom'
  }

  const updateValue = (list: CheckedValue[], range?: RangeValue) => {
    const finalValue: (string | number)[] = list.filter((item) => item !== 'custom') as number[]

    if (list.includes('custom')) {
      const _range = range || customRange
      if (_range[0] !== null || _range[1] !== null) {
        finalValue.push(getCustomValue(_range))
      }
    }
    onChange?.({ value: finalValue as number[] })
  }

  const handleRangeChange = (rangeValue?: { value: RangeValue }) => {
    const newRange = rangeValue?.value || ([null, null] as RangeValue)
    setCustomRange(newRange)

    const isRangeValid = newRange[0] !== null || newRange[1] !== null
    const isCustomChecked = checkedList.includes('custom')

    if (isRangeValid) {
      if (!isCustomChecked) {
        const newList = [...checkedList, 'custom']
        setCheckedList(newList)
        updateValue(newList, newRange)
      } else {
        updateValue(checkedList, newRange)
      }
    } else if (isCustomChecked) {
      const newList = checkedList.filter((item) => item !== 'custom')
      setCheckedList(newList)
      updateValue(newList)
    }
  }

  const handleGroupChange = (list: CheckboxValueType[]) => {
    const isCheckingCustom = list.includes('custom') && !checkedList.includes('custom')

    if (isCheckingCustom && customRange[0] === null && customRange[1] === null) {
      message.error('请输入自定义范围')
      return
    }

    setCheckedList(list)
    updateValue(list)
  }

  return (
    <div className={styles[`${PREFIX}-container`]} {...rest}>
      <Checkbox.Group value={checkedList} onChange={handleGroupChange}>
        {options?.map((item) => (
          <Checkbox key={item.value} value={item.value} className={styles[`${PREFIX}-option`]}>
            {item.label}
          </Checkbox>
        ))}
        <Checkbox value={'custom'} className={styles[`${PREFIX}-custom-checkbox`]}>
          <div className={styles[`${PREFIX}-custom-section`]}>
            <div className={styles[`${PREFIX}-custom-label`]}>自定义</div>
            <NumberRange value={{ value: customRange as string[] }} onChange={handleRangeChange} suffix={_suffix} />
          </div>
        </Checkbox>
      </Checkbox.Group>
    </div>
  )
}

export default CheckboxGroupWithNumberRange
