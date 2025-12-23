import { InputNumber } from '@wind/wind-ui'
import { InputNumberProps } from '@wind/wind-ui/lib/input-number'
import classNames from 'classnames'
import { isEn } from 'gel-util/intl'
import { CSSProperties, FC, ReactNode, useEffect, useState } from 'react'
import styles from './index.module.less'

export type NumberRangeValue = [number | undefined, number | undefined]

export interface NumberRangeProps {
  /**
   * 最小值
   */
  min?: number
  /**
   * 最大值
   */
  max?: number
  /**
   * 步长
   */
  step?: number
  /**
   * 精度
   */
  precision?: number
  /**
   * 占位符
   */
  placeholder?: [string, string]
  /**
   * 禁用状态
   */
  disabled?: boolean
  /**
   * 默认值
   */
  defaultValue?: NumberRangeValue
  /**
   * 值
   */
  value?: NumberRangeValue
  /**
   * 值变化回调
   */
  onChange?: (value: NumberRangeValue) => void
  /**
   * 自定义类名
   */
  className?: string
  /**
   * 自定义样式
   */
  style?: CSSProperties
  /**
   * 前缀
   */
  prefix?: ReactNode
  /**
   * 后缀
   */
  suffix?: ReactNode
  /**
   * 连接符
   */
  separator?: ReactNode

  firstProps?: InputNumberProps
  secondProps?: InputNumberProps
}

/**
 * 数字范围选择器
 */
export const NumberRange: FC<NumberRangeProps> = ({
  min,
  max,
  step = 1,
  precision,
  placeholder = [isEn() ? 'Min' : '最小值', isEn() ? 'Max' : '最大值'],
  disabled = false,
  value,
  onChange,
  className,
  style,
  prefix,
  suffix,
  separator = '-',
  firstProps,
  secondProps,
}) => {
  const [innerValue, setInnerValue] = useState<[number | undefined, number | undefined] | undefined>(value)
  const { className: firstClassName, ...firstRestProps } = firstProps || {}
  const { className: secondClassName, ...secondRestProps } = secondProps || {}
  // 同步外部值
  useEffect(() => {
    setInnerValue(value)
  }, [value])

  // 处理最小值变化
  const handleMinChange = (minValue: string | number | undefined) => {
    const minValueNumber = Number(minValue)
    const [, maxValue] = innerValue || [undefined, undefined]
    const newValue: NumberRangeValue = [minValueNumber, maxValue]

    setInnerValue(newValue)
    onChange?.(newValue)
  }

  // 处理最大值变化
  const handleMaxChange = (maxValue: string | number | undefined) => {
    const maxValueNumber = Number(maxValue)
    const [minValue] = innerValue || [undefined, undefined]
    const newValue: NumberRangeValue = [minValue, maxValueNumber]

    setInnerValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div className={`${styles['number-range']} ${className || ''}`} style={style}>
      {prefix && <span className={styles['number-range__prefix']}>{prefix}</span>}
      <div className={styles['number-range__content']}>
        <InputNumber
          className={classNames(styles['number-range__input'], firstClassName)}
          min={min}
          max={max}
          step={step}
          precision={precision}
          value={innerValue?.[0]}
          onChange={handleMinChange}
          placeholder={placeholder[0]}
          disabled={disabled}
          {...firstRestProps}
        />
        <span className={styles['number-range__separator']}>{separator}</span>
        <InputNumber
          className={classNames(styles['number-range__input'], secondClassName)}
          min={min}
          max={max}
          step={step}
          precision={precision}
          value={innerValue?.[1]}
          onChange={handleMaxChange}
          placeholder={placeholder[1]}
          disabled={disabled}
          {...secondRestProps}
        />
      </div>

      {suffix && <span className={styles['number-range__suffix']}>{suffix}</span>}
    </div>
  )
}
