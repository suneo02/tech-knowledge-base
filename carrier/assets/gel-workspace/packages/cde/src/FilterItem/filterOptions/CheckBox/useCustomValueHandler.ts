import { CustomValueHandlerProps } from './types'
import { getCustomValueFromSelectedValues } from './useOptionsTransformer'

/**
 * 自定义值处理Hook
 * 处理自定义值的添加、删除等功能
 */
export const useCustomValueHandler = ({ selectedValues, itemOption, setSelectedValues }: CustomValueHandlerProps) => {
  /**
   * 处理自定义值变更
   * 通过回调通知父组件
   *
   * @param newValue 新的自定义值
   */
  const handleCustomValueChange = (newValue: string) => {
    // 通知父组件值已更新
    setSelectedValues((prev) => {
      // 过滤掉当前值列表中的所有自定义值
      // 自定义值是指那些不在选项列表中的值

      // 获取 custom value
      const customVal = getCustomValueFromSelectedValues(prev, itemOption)
      // 获取 prev 中除了 custom value 的值
      const next = prev.filter((v) => v !== customVal)

      // 只有当新值非空才添加自定义值
      if (newValue) {
        next.push(newValue)
      } else {
        console.warn('handleCustomValueChange 没有勾选自定义选项 或 自定义值为空', newValue, selectedValues)
      }
      console.log('handleCustomValueChange', newValue, next)
      return next
    })
  }

  /**
   * 处理日期选择变更
   * 将日期数组转换为带分隔符的字符串，并通知父组件
   *
   * @param _ 原始日期对象（未使用）
   * @param dateString 日期字符串数组 [开始日期, 结束日期]
   */
  const handleDateChange = (_: any, dateString: [string, string]) => {
    const dateValue = dateString.join('-')
    handleCustomValueChange(dateValue)
  }

  return {
    handleCustomValueChange,
    handleDateChange,
  }
}
