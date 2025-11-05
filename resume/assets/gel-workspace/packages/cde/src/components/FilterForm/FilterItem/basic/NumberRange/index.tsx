import React, { useState, useEffect } from 'react'
import { InputNumber } from '@wind/wind-ui'
import { CustomComponentProps, PrimitiveValue } from '../../../types'
import styles from './index.module.less'

const PREFIX = 'base-number-range'

const NumberRange: React.FC<CustomComponentProps> = ({ value, onChange, placeholder, suffix, itemRemark, ...rest }) => {
  const _suffix = suffix || itemRemark
  const [min, setMin] = useState<number | null>(null)
  const [max, setMax] = useState<number | null>(null)
  const [isSwapping, setIsSwapping] = useState(false)
  const [swapKey, setSwapKey] = useState(0)

  useEffect(() => {
    if (isSwapping) return

    const [minFromProps, maxFromProps] = Array.isArray(value?.value) ? value.value : [null, null]
    setMin(minFromProps as number | null)
    setMax(maxFromProps as number | null)
  }, [value, isSwapping])

  const handleCommit = (finalMin: number | null, finalMax: number | null) => {
    if (finalMin === null && finalMax === null) {
      onChange?.(undefined)
    } else {
      onChange?.({ value: [finalMin, finalMax] as PrimitiveValue })
    }
  }

  const handleBlur = () => {
    if (isSwapping) return

    if (typeof min === 'number' && typeof max === 'number' && min > max) {
      setIsSwapping(true)
      setSwapKey((key) => key + 1)
      setTimeout(() => {
        setMin(max)
        setMax(min)
        handleCommit(max, min)
        setTimeout(() => setIsSwapping(false), 0)
      }, 300)
    } else {
      handleCommit(min, max)
    }
  }

  const handleMinChange = (val: number | string | null | undefined) => {
    const num = val === '' || val === null || val === undefined ? null : Number(val)
    setMin(num)
  }

  const handleMaxChange = (val: number | string | null | undefined) => {
    const num = val === '' || val === null || val === undefined ? null : Number(val)
    setMax(num)
  }

  const placeholders = placeholder?.split(',') || ['最小值', '最大值']

  return (
    <div key={swapKey} className={`${styles[`${PREFIX}-container`]} ${isSwapping ? styles.swapping : ''}`}>
      <div className={styles.inputWrapper} onBlur={handleBlur}>
        <InputNumber
          size="large"
          value={isSwapping ? (max ?? undefined) : (min ?? undefined)}
          onChange={handleMinChange}
          placeholder={placeholders[0]}
          {...rest}
        />
      </div>
      <span className={styles[`${PREFIX}-separator`]}>-</span>
      <div className={styles.inputWrapper} onBlur={handleBlur}>
        <InputNumber
          size="large"
          value={isSwapping ? (min ?? undefined) : (max ?? undefined)}
          onChange={handleMaxChange}
          placeholder={placeholders[1]}
          {...rest}
        />
      </div>
      {_suffix && <span className={styles[`${PREFIX}-suffix`]}>{_suffix}</span>}
    </div>
  )
}

export default NumberRange
