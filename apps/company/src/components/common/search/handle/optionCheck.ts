import { SelectProps } from '@wind/wind-ui/lib/select'
import { isNil } from 'lodash'

export function checkSelectOption(options: SelectProps['options']): SelectProps['options'] {
  // 检查 options 是否为数组
  if (!Array.isArray(options)) {
    console.error('OptionCheck: options 必须是数组')
    return []
  }

  // 过滤掉值为 null 或 undefined 的 option
  const filteredOptions = options.filter((option) => {
    if (isNil(option)) {
      console.error('OptionCheck: 移除无效的 option', option)
      return false
    }
    return true
  })

  // 检查是否有 option 缺少 value 或 label
  if (filteredOptions.length !== options.length) {
    console.warn('OptionCheck: 已移除包含无效值的 option', options, filteredOptions)
  }

  return filteredOptions
}
