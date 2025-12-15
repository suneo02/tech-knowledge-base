import type { CDEFilterOptionFront } from '@/types/filter'

/**
 * 处理默认值，返回处理后的选中值数组
 * @param option 选项数据
 * @param defaults 默认值数组
 * @returns 处理后的选中值数组
 */
export function processDefaultValues(option: CDEFilterOptionFront, defaults: string[]): string[] {
  if (!defaults?.length) {
    return []
  }

  if (!option.itemOption?.length) {
    return defaults.filter((d) => d === option.value)
  }

  // 获取所有可能的值
  const allPossibleValues = getAllPossibleValues(option)
  // 返回所有存在于默认值中的值
  return defaults.filter((d) => allPossibleValues.includes(d))
}

/**
 * 获取选项及其子选项的所有可能值
 * @param item 选项数据
 * @returns 所有可能的值的数组
 */
export function getAllPossibleValues(item: CDEFilterOptionFront): string[] {
  if (!item.itemOption?.length) {
    return typeof item.value === 'string' ? [item.value] : (item.value as string[])
  }

  return item.itemOption.reduce<string[]>((acc, curr) => {
    if (curr.itemOption?.length) {
      return [...acc, ...curr.itemOption.map((opt) => (typeof opt.value === 'string' ? opt.value : String(opt.value)))]
    }
    return [...acc, ...(typeof curr.value === 'string' ? [curr.value] : (curr.value as string[]))]
  }, [])
}

/**
 * 计算选项是否处于全选状态
 * @param item 选项数据
 * @param selectedValues 已选中的值数组
 * @returns 是否全选
 */
export function isCheckAll(item: CDEFilterOptionFront, selectedValues: string[]): boolean {
  if (!selectedValues?.length) return false

  const allValues = getAllPossibleValues(item)
  return allValues.length > 0 && allValues.every((val) => selectedValues.includes(val))
}

/**
 * 计算选项是否处于半选状态（部分选中）
 * @param item 选项数据
 * @param selectedValues 已选中的值数组
 * @returns 是否半选
 */
export function isIndeterminate(item: CDEFilterOptionFront, selectedValues: string[]): boolean {
  if (!selectedValues?.length) return false

  const allValues = getAllPossibleValues(item)
  // 如果全选或者完全没有选中，则不是半选状态
  const hasSelected = allValues.some((val) => selectedValues.includes(val))
  const allSelected = allValues.every((val) => selectedValues.includes(val))

  return hasSelected && !allSelected
}

/**
 * 检查选项是否可见（根据选中状态）
 * 如果选项被部分选中或全选，则可见
 * @param item 选项数据
 * @param selectedValues 已选中的值数组
 * @returns 是否可见
 */
export function isVisible(item: CDEFilterOptionFront, selectedValues: string[]): boolean {
  return isIndeterminate(item, selectedValues) || isCheckAll(item, selectedValues)
}
