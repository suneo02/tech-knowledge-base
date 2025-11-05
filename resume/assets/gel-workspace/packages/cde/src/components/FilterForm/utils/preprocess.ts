import { FilterConfigItem, FilterOption, ItemOptionItem } from '../types'

// --- 辅助函数 ---

/**
 * 检查选项数组是否存在嵌套的子选项。
 * @param options - 待检查的选项数组。
 * @returns 如果存在嵌套子选项则返回 true，否则返回 false。
 */
const hasNestedChildren = (options: any[]): boolean => {
  if (!options) return false
  return options.some((option) => option.itemOption && Array.isArray(option.itemOption) && option.itemOption.length > 0)
}

/**
 * 将后端返回的 itemOption 格式转换为前端 UI 组件可用的 FilterOption 格式。
 * @param itemOptions - 原始的选项数组。
 * @returns 转换后的选项数组。
 */
const transformOptions = (itemOptions: { name: string; value?: any }[]): FilterOption[] => {
  return itemOptions ? itemOptions.map((item) => ({ label: item.name, value: item.value as string })) : []
}

// --- 各种独立的预处理器函数 (策略) ---

/**
 * 处理复选框类型的筛选器 (itemType: '3')。
 * 根据配置动态决定渲染为树形、带数字范围或普通的复选框组。
 * @param item - 原始的筛选器配置。
 * @returns 经过预处理后的配置。
 */
const processCheckboxItems = (item: FilterConfigItem): FilterConfigItem => {
  const itemOptions = (item.itemOption as ItemOptionItem[]) || []

  if (hasNestedChildren(itemOptions)) {
    /**
     * 递归地将嵌套选项转换为树形结构。
     * @param options - 当前层级的选项。
     * @returns 树形结构的 FilterOption 数组。
     */
    const transformToTree = (options: ItemOptionItem[]): FilterOption[] => {
      return options.map((option) => {
        const hasChildren = option.itemOption && option.itemOption.length > 0
        return {
          label: option.name,
          value: (hasChildren ? option.name : option.value) as string,
          children: hasChildren ? transformToTree(option.itemOption!) : [],
        }
      })
    }
    return { ...item, itemType: 'treeCheckbox', options: transformToTree(itemOptions) }
  }

  if (item.logicOption === 'range') {
    return {
      ...item,
      itemType: 'checkboxGroupWithNumberRange',
      options: transformOptions(itemOptions),
      value: item.value,
    }
  }

  return {
    ...item,
    itemType: 'checkboxGroup',
    options: transformOptions(itemOptions),
  }
}

/**
 * 处理单选框类型的筛选器 (itemType: '4' 和 '5')。
 * 根据配置决定渲染为带日期范围或普通的单选框组。
 * @param item - 原始的筛选器配置。
 * @returns 经过预处理后的配置。
 */
const processRadioItems = (item: FilterConfigItem): FilterConfigItem => {
  const base = {
    ...item,
    options: transformOptions(item.itemOption || []),
  }

  if (item.logicOption === 'range') {
    return { ...base, itemType: 'radioWithDateRange' }
  }

  return { ...base, itemType: 'radioGroup', defaultValue: item.defaultValue ?? '' }
}

// --- 预处理器映射表 ---

/**
 * 存储后端 itemType 到对应预处理函数的映射关系。
 * 这是策略模式的核心，用于动态选择处理逻辑。
 */
const itemPreprocessors: Partial<Record<string, (item: FilterConfigItem) => FilterConfigItem>> = {
  '2': (item) => ({ ...item, itemType: 'tagsInput' }),
  '3': processCheckboxItems,
  '4': processRadioItems,
  '5': processRadioItems,
  '6': (item) => ({ ...item, itemType: 'numberRange' }),
  '9': (item) => ({ ...item, itemType: 'search' }),
  '91': (item) => ({ ...item, itemType: 'logicWithSearchableTags' }),
}

// --- 主预处理函数 ---

/**
 * 根据筛选器配置的 itemType，动态选择并应用相应的预处理逻辑。
 * @param itemConfig - 从后端接收的原始筛选器配置。
 * @returns 经过预处理后，可以直接用于前端渲染的配置。
 */
export const preprocessFilterItem = (itemConfig: FilterConfigItem): FilterConfigItem => {
  const preprocessor = itemPreprocessors[itemConfig.itemType]
  if (preprocessor) {
    return preprocessor(itemConfig)
  }
  // 如果没有找到对应的预处理器，则返回原始配置
  return itemConfig
}
