/**
 * 自定义值处理钩子
 * 用于管理自定义输入值的状态和处理逻辑
 */
import { CDEDateFormat } from '@/config.ts'
import { message } from '@wind/wind-ui'
import { DateRangeValue } from '@wind/wind-ui/lib/date-picker/index'
import { intl } from 'gel-util/intl'
import { useState } from 'react'
import { OptionItem } from './useOptionItems.ts'

/**
 * 自定义值处理钩子的属性接口
 * @interface UseCustomValueProps
 * @property {string} defaultValue - 默认值
 * @property {OptionItem[]} itemOption - 选项列表
 * @property {Function} onValueChange - 值变更回调函数
 */
interface UseCustomValueProps {
  defaultValue: string
  itemOption: OptionItem[]
  onValueChange: (value: string) => void
}

export const useCustomValue = ({ defaultValue, itemOption, onValueChange }: UseCustomValueProps) => {
  // 初始化自定义值状态
  // 如果 defaultValue 存在于预定义选项中，说明用户选择的是预定义选项，此时自定义值为空
  // 如果 defaultValue 不存在于预定义选项中，说明这是一个自定义输入的值，使用 defaultValue 作为自定义值
  const [customValue, setCustomValue] = useState<string>(() => {
    const isPreDefinedOption = itemOption.find((option) => option.value === defaultValue)
    return isPreDefinedOption ? '' : defaultValue
  })

  /**
   * 处理日期值变更
   * @param {DateRangeValue} dates - 日期范围值
   */
  const handleDateValueChange = (dates: DateRangeValue) => {
    const validDates = dates.filter((date) => date && date.isValid())
    if (validDates.length === 0) {
      setCustomValue('')
      onValueChange('')
      return
    }

    // 如果只选择了一个日期，将其作为起始日期
    if (validDates.length === 1) {
      const dateStr = `${validDates[0]?.format(CDEDateFormat)}-`
      setCustomValue(dateStr)
      onValueChange(dateStr)
      return
    }

    // 选择了日期范围
    const dateStr = validDates.map((d) => d?.format(CDEDateFormat)).join('-')
    setCustomValue(dateStr)
    onValueChange(dateStr)
  }

  /**
   * 处理数字值变更
   * @param {string} val - 输入的数字值
   */
  const handleNumberValueChange = (val: string) => {
    if (val === '-' || !val) {
      setCustomValue('')
      onValueChange('')
      return
    }
    setCustomValue(val)
    onValueChange(val)
  }

  /**
   * 验证自定义值是否有效
   * @returns {boolean} 验证结果
   */
  const validateCustomValue = () => {
    if (!customValue) {
      message.warning(intl('355820', '请填写自定义内容'))
      return false
    }
    return true
  }

  return {
    customValue,
    handleDateValueChange,
    handleNumberValueChange,
    validateCustomValue,
  }
}
