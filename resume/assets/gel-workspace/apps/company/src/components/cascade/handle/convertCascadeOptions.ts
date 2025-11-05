/**
 * 根据 field names convert options
 * @param options 级联选择器的选项数据
 * @param fieldNames 字段名称映射
 * @returns 转换后的选项数据
 */

export const convertCascadeOptions = <OptionType extends Record<string, any>>(
  options: OptionType[] | null | undefined,
  fieldNames:
    | {
        label: keyof OptionType
        value: keyof OptionType
        children: keyof OptionType
      }
    | null
    | undefined
) => {
  // 如果 options 为空，返回空数组
  if (!options || !Array.isArray(options) || options.length === 0) {
    return []
  }

  // 如果 fieldNames 为空，使用默认值
  const defaultFieldNames = {
    label: 'label' as keyof OptionType,
    value: 'value' as keyof OptionType,
    children: 'children' as keyof OptionType,
  }

  const mergedFieldNames = fieldNames || defaultFieldNames

  // 定义返回的选项类型
  type ResultOptionType = {
    label: string
    value: string
    children?: ResultOptionType[]
    [key: string]: any
  }

  // 递归转换选项及其子选项
  const convertOptionsRecursively = (items: OptionType[]): ResultOptionType[] => {
    if (!items || !Array.isArray(items)) return []

    return items.map((opt) => {
      if (!opt || typeof opt !== 'object') {
        return { label: '', value: '' }
      }

      // 创建结果对象
      const result: ResultOptionType = { ...opt, label: '', value: '' }

      // 赋值标准字段
      result.label = opt[mergedFieldNames.label] ?? ''
      result.value = opt[mergedFieldNames.value] ?? ''

      // 递归处理子选项
      const children = opt[mergedFieldNames.children]
      if (Array.isArray(children)) {
        result.children = convertOptionsRecursively(children)
      }

      return result
    })
  }

  return convertOptionsRecursively(options)
}
