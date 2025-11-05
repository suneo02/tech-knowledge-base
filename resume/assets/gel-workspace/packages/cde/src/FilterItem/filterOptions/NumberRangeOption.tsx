import classNames from 'classnames'
import { NumberRange, NumberRangeProps, NumberRangeValue } from 'gel-ui'
import { FC } from 'react'
import styles from './style/numberRange.module.less'

export interface NumberRangeOptionProps extends Omit<NumberRangeProps, 'onChange' | 'value'> {
  onChange: (value: string) => void
  value: string | NumberRangeValue
}

/**
 * 将范围值编码为字符串格式
 * @param value 范围值对象
 * @returns 编码后的字符串，格式为 "min-max"
 */
export const encodeRangeValue = (value?: NumberRangeValue): string => {
  if (!value) return ''
  const [min, max] = value
  if (min === undefined && max === undefined) return ''
  if (min === undefined) return `-${max}`
  if (max === undefined) return `${min}-`
  return `${min}-${max}`
}

/**
 * 将字符串格式的范围值解码为对象
 * @param value 编码的字符串值
 * @returns 解码后的范围值对象
 */
export const decodeRangeValue = (value?: string): NumberRangeValue => {
  try {
    const [min = '', max = ''] = value ? value.split('-') : ['', '']
    const minNum = min ? Number(min) : undefined
    const maxNum = max ? Number(max) : undefined
    return [
      minNum !== undefined && !isNaN(minNum) ? minNum : undefined,
      maxNum !== undefined && !isNaN(maxNum) ? maxNum : undefined,
    ]
  } catch (e) {
    console.error(e)
    return [undefined, undefined]
  }
}

/**
 * 数字范围选择器组件
 * 支持受控和非受控两种使用方式
 *
 * @param {number|undefined} props.min - 范围的最小值（受控）
 * @param {number|undefined} props.max - 范围的最大值（受控）
 * @param {RangeValue} props.defaultValue - 默认值（非受控）
 * @param {function} props.onChange - 值变更时的回调函数
 * @param {string} [props.className] - 组件的样式类名
 * @param {string} [props.unit] - 单位
 * @param {number} [props.maxVal] - 最大差值限制
 */
export const NumberRangeOption: FC<NumberRangeOptionProps> = ({ className, ...props }) => {
  const valueParsed = typeof props.value === 'string' ? decodeRangeValue(props.value) : props.value
  const handleChange = (value: NumberRangeValue) => {
    props.onChange(encodeRangeValue(value))
  }
  return (
    <NumberRange
      className={classNames(styles.numberRangeOption, className)}
      firstProps={{ className: styles.numberRangeOptionFirst }}
      secondProps={{ className: styles.numberRangeOptionSecond }}
      placeholder={['', '']}
      
      {...props}
      onChange={handleChange}
      value={valueParsed}
    />
  )
}
