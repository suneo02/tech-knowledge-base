// @ts-nocheck
import React, { useState } from 'react'
import { Button, InputNumber, Space } from 'antd'

export type NumberRangeProps = {
  value?: [number | null, number | null]
  suffix?: string
  onChange?: (range?: [number | null, number | null]) => void
}
const NumberRange: React.FC<NumberRangeProps> = ({ value, suffix, onChange }) => {
  const [minValue, setMinValue] = useState<number | null>(value || value === 0 ? value[0] : null)
  const [maxValue, setMaxValue] = useState<number | null>(value || value === 0 ? value[1] : null)
  const [tuple, setTuple] = useState<[number | null, number | null]>()

  const handleBlur = () => {
    if (minValue !== null && maxValue !== null) {
      const newValue: [number | null, number | null] = maxValue < minValue ? [maxValue, minValue] : [minValue, maxValue]
      setMaxValue(newValue?.[1])
      setMinValue(newValue?.[0])
      handleChange(newValue)
    } else if (minValue === null && maxValue == null) {
      handleChange()
    }
  }

  const handleChange = (val?: [number | null, number | null]) => {
    if (val?.[0] === null && val?.[1] === null) return
    if (tuple?.[0] === val?.[0] && tuple?.[1] === val?.[1]) return
    setTuple(val)
    onChange?.(val)
  }

  React.useEffect(() => {
    setTuple([value?.[0] ?? null, value?.[1] ?? null])
    setMinValue(value?.[0] ?? null)
    setMaxValue(value?.[1] ?? null)
  }, [value])

  return (
    <Space>
      <InputNumber
        size="small"
        value={minValue}
        onBlur={handleBlur}
        onChange={setMinValue}
        placeholder="最小值"
        suffix={suffix}
        controls={false}
      />
      -
      <InputNumber
        size="small"
        value={maxValue}
        onBlur={handleBlur}
        onChange={setMaxValue}
        placeholder="最大值"
        suffix={suffix}
        controls={false}
      />
      <Button size="small" type="text" onClick={() => handleChange([minValue, maxValue])}>
        确认
      </Button>
    </Space>
  )
}

export default NumberRange
