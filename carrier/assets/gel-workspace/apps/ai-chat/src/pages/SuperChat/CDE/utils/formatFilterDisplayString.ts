import { CDEFormBizValues, CDEFormConfigItem } from 'cde'
import { flattenTree, getIndustryTreeByField } from './cascadeUtils'
import { selectFilterCategoriesFlatMap } from '@/store/CDE'
import { store } from '@/store'

// TODO: Move this enum to a shared location
export enum CDEFilterType {
  CASCADER_WITH_CONFIDENCE = '0',
  LOGICAL_KEYWORD = '1',
  TAGS_INPUT = '2',
  CHECKBOX = '3',
  RADIO = '4',
  RADIO_ALT = '5',
  NUMBER_RANGE = '6',
  SEARCH = '9',
  CASCADER_WITH_CONFIDENCE_ALT = '10',
}

// 新的返回格式类型
export interface FilterDisplayItem {
  title: string
  values: string[]
}

const getLabelFromOptions = (options: { name: string; value: string }[], value: string): string => {
  const option = options.find((opt) => opt.value === value)
  return option ? option.name : value
}

// 处理层级化选项的标签获取
interface HierarchicalOption {
  name: string
  value: string
  itemOption?: Array<{ name?: string; label?: string; value: string }>
}

const getHierarchicalLabels = (options: HierarchicalOption[], selectedValues: string[]): string[] => {
  const labels: string[] = []
  const usedValues = new Set<string>()

  // 先处理有子选项的父级选项
  options.forEach((option) => {
    if (option.itemOption && Array.isArray(option.itemOption)) {
      // 检查这个父级选项的子选项哪些被选中
      const selectedSubOptions = option.itemOption.filter((subOption) => {
        const subValue = typeof subOption.value === 'string' ? subOption.value : String(subOption.value)
        return selectedValues.includes(subValue)
      })

      if (selectedSubOptions.length > 0) {
        if (selectedSubOptions.length === option.itemOption.length) {
          // 如果所有子选项都被选中，显示父级名称
          labels.push(option.name)
          selectedSubOptions.forEach((subOption) => {
            const subValue = typeof subOption.value === 'string' ? subOption.value : String(subOption.value)
            usedValues.add(subValue)
          })
        } else {
          // 如果只选中部分子选项，显示具体的子选项名称
          selectedSubOptions.forEach((subOption) => {
            const subValue = typeof subOption.value === 'string' ? subOption.value : String(subOption.value)
            labels.push(subOption.name || subOption.label || subValue)
            usedValues.add(subValue)
          })
        }
      }
    }
  })

  // 处理没有子选项的简单选项和未被使用的值
  options.forEach((option) => {
    if (!option.itemOption || !Array.isArray(option.itemOption)) {
      const optionValue = typeof option.value === 'string' ? option.value : String(option.value)
      if (selectedValues.includes(optionValue) && !usedValues.has(optionValue)) {
        labels.push(option.name)
        usedValues.add(optionValue)
      }
    }
  })

  // 处理剩余未匹配的值
  selectedValues.forEach((value) => {
    if (!usedValues.has(value)) {
      labels.push(value)
    }
  })

  return labels
}

// 格式化单个过滤器值
const formatSingleFilterValue = (currentValue: CDEFormBizValues, item: CDEFormConfigItem): string => {
  let formattedValue = ''
  const { value } = currentValue as { value: unknown }
  const options = (item.itemOption as { name: string; value: string }[]) || []

  switch (item.itemType) {
    case CDEFilterType.CASCADER_WITH_CONFIDENCE:
    case CDEFilterType.CASCADER_WITH_CONFIDENCE_ALT:
      if (Array.isArray(value) && value.length > 0) {
        const treeOptions = getIndustryTreeByField(item.itemField)
        const allNodes = flattenTree(treeOptions)
        const selectedNodes = allNodes.filter((node) => (value as (string | number)[]).includes(node.value))
        formattedValue = selectedNodes.map((node) => node.label).join('/')
      }
      break

    case CDEFilterType.LOGICAL_KEYWORD: {
      if (Array.isArray(value) && value.length > 0) {
        formattedValue = value.join('/')
        break
      }
      const logicalValue = value as {
        logicalOperator?: string
        keywords?: string[]
      }
      if (
        typeof logicalValue === 'object' &&
        logicalValue !== null &&
        Array.isArray(logicalValue.keywords) &&
        logicalValue.keywords.length > 0
      ) {
        formattedValue = `(${logicalValue.keywords.join(` ${logicalValue.logicalOperator?.toUpperCase() ?? 'AND'} `)})`
      }
      break
    }
    case CDEFilterType.TAGS_INPUT:
      if (Array.isArray(value) && value.length > 0) {
        formattedValue = value.join('/')
      }
      break

    case CDEFilterType.CHECKBOX:
      if (Array.isArray(value)) {
        const labels = getHierarchicalLabels(options as HierarchicalOption[], value)
        formattedValue = labels.join('/')
      } else if (typeof value === 'string') {
        formattedValue = getLabelFromOptions(options, value)
      }
      break
    case CDEFilterType.RADIO:
    case CDEFilterType.RADIO_ALT:
      if (Array.isArray(value)) {
        formattedValue = value.map((v) => getLabelFromOptions(options, v)).join('/')
      } else if (typeof value === 'string') {
        formattedValue = getLabelFromOptions(options, value)
      }
      break

    case CDEFilterType.NUMBER_RANGE:
      if (Array.isArray(value) && value.length === 2) {
        const [min, max] = value
        if (min !== undefined && max !== undefined && min !== null && max !== null) {
          formattedValue = `${min}-${max}`
        } else if (min !== undefined && min !== null) {
          formattedValue = `≥${min}`
        } else if (max !== undefined && max !== null) {
          formattedValue = `≤${max}`
        }
      }
      break

    case CDEFilterType.SEARCH:
      if (Array.isArray(value) && value.length > 0) {
        formattedValue = value.join(' ')
      } else if (typeof value === 'string' && value.trim() !== '') {
        formattedValue = value
      }
      break

    default:
      break
  }

  return formattedValue
}

// 格式化为数组格式（用于Tag展示）
const formatSingleFilterValueArray = (currentValue: CDEFormBizValues, item: CDEFormConfigItem): string[] => {
  const { value } = currentValue as { value: unknown }
  const options = (item.itemOption as { name: string; value: string }[]) || []

  switch (item.itemType) {
    case CDEFilterType.CASCADER_WITH_CONFIDENCE:
    case CDEFilterType.CASCADER_WITH_CONFIDENCE_ALT:
      if (Array.isArray(value) && value.length > 0) {
        const treeOptions = getIndustryTreeByField(item.itemField)
        const allNodes = flattenTree(treeOptions)
        const selectedNodes = allNodes.filter((node) => (value as (string | number)[]).includes(node.value))
        return selectedNodes.map((node) => node.label)
      }
      break

    case CDEFilterType.LOGICAL_KEYWORD: {
      const logicalValue = value as
        | {
            logicalOperator?: string
            keywords?: string[]
          }
        | string[]
      if (Array.isArray(logicalValue)) {
        return logicalValue
      }
      if (
        typeof logicalValue === 'object' &&
        logicalValue !== null &&
        Array.isArray(logicalValue.keywords) &&
        logicalValue.keywords.length > 0
      ) {
        return [`(${logicalValue.keywords.join(` ${logicalValue.logicalOperator?.toUpperCase() ?? 'AND'} `)})`]
      }
      break
    }
    case CDEFilterType.TAGS_INPUT:
      if (Array.isArray(value) && value.length > 0) {
        return value as string[]
      }
      break

    case CDEFilterType.CHECKBOX:
      if (Array.isArray(value)) {
        return getHierarchicalLabels(options as HierarchicalOption[], value)
      } else if (typeof value === 'string') {
        return [getLabelFromOptions(options, value)]
      }
      break
    case CDEFilterType.RADIO:
    case CDEFilterType.RADIO_ALT:
      if (Array.isArray(value)) {
        return value.map((v) => getLabelFromOptions(options, v))
      } else if (typeof value === 'string') {
        return [getLabelFromOptions(options, value)]
      }
      break

    case CDEFilterType.NUMBER_RANGE:
      if (Array.isArray(value) && value.length === 2) {
        const [min, max] = value
        if (min !== undefined && max !== undefined && min !== null && max !== null) {
          return [`${min}-${max}`]
        } else if (min !== undefined && min !== null) {
          return [`≥${min}`]
        } else if (max !== undefined && max !== null) {
          return [`≤${max}`]
        }
      }
      break

    case CDEFilterType.SEARCH:
      if (typeof value === 'string' && value.trim() !== '') {
        return [value]
      }
      break

    default:
      break
  }

  return []
}

/**
 * 格式化过滤器显示字符串
 * @param initialValues 过滤器值数组
 * @param config 可选的配置项，如果不传则自动使用Redux中的flatMap
 * @returns 格式化后的字符串
 */
export const formatFilterDisplayString = (initialValues: CDEFormBizValues[], config?: CDEFormConfigItem[]): string => {
  // 如果没有传入config，则使用Redux中的flatMap
  const finalConfig = config || selectFilterCategoriesFlatMap(store.getState()) || []

  if (!finalConfig.length) {
    console.warn('formatFilterDisplayString: No config available')
    return ''
  }

  const configMap = new Map(finalConfig.map((item) => [item.itemId.toString(), item]))

  const parts = initialValues
    .map((currentValue) => {
      const item = configMap.get(String(currentValue.itemId))
      if (!item) {
        return ''
      }

      const formattedValue = formatSingleFilterValue(currentValue, item)
      if (formattedValue) {
        return `${item.itemName} - ${formattedValue}`
      }
      return ''
    })
    .filter((part) => part !== '')

  return parts.join(' · ')
}

/**
 * 格式化过滤器为数组格式（用于Tag展示）
 * @param initialValues 过滤器值数组
 * @param config 可选的配置项，如果不传则自动使用Redux中的flatMap
 * @returns 格式化后的数组，包含title和values
 */
export const formatFilterDisplayArray = (
  initialValues: CDEFormBizValues[],
  config?: CDEFormConfigItem[]
): FilterDisplayItem[] => {
  // 如果没有传入config，则使用Redux中的flatMap
  const finalConfig = config || selectFilterCategoriesFlatMap(store.getState()) || []
  console.log('🚀 ~ formatFilterDisplayArray ~ finalConfig:', finalConfig)

  if (!finalConfig.length) {
    console.warn('formatFilterDisplayArray: No config available')
    return []
  }

  const configMap = new Map(finalConfig.map((item) => [item.itemId.toString(), item]))
  // console.log('🚀 ~ configMap:', configMap)

  const items: FilterDisplayItem[] = initialValues
    .map((currentValue) => {
      const item = configMap.get(String(currentValue.itemId))
      // console.log('🚀 ~ .map ~ item:', item)
      if (!item) {
        return null
      }

      const values = formatSingleFilterValueArray(currentValue, item)
      // console.log('🚀 ~ .map ~ values:', values)
      if (values.length > 0) {
        return {
          title: item.itemName,
          values,
        }
      }
      return null
    })
    .filter((item): item is FilterDisplayItem => item !== null)

  // console.log('🚀 ~ formatFilterDisplayArray ~ items:', items)
  return items
}
