import { CDEFilterItem, CDEFilterOption } from 'gel-api'

/**
 * @function getAllChildValues
 * @description 递归地获取一个筛选选项节点及其所有后代节点（子、孙等）的 `value` 值。
 * 这个函数会遍历整个 `itemOption` 树，收集所有层级的 `value`。
 * 它能正确处理 `value` 属性为字符串或字符串数组的情况，并对无效或非预期的 `value` 类型进行容错处理。
 *
 * @param {CDEFilterOption} item - 要遍历的筛选选项节点。这是树的根节点或任何一个分支节点。
 *
 * @returns {string[]} 返回一个包含所有收集到的 `value` 值的字符串数组。
 * 如果节点的 `value` 类型不正确，会打印错误日志并跳过该值，最终返回一个扁平化的、只包含有效字符串值的数组。
 */
export const getAllChildValues = (item: CDEFilterOption): string[] => {
  // 基本情况：如果节点没有子选项 (itemOption)，则处理当前节点的 value
  if (!item.itemOption || item.itemOption.length === 0) {
    // 容错与类型检查：确保 value 是字符串或字符串数组
    if (Array.isArray(item.value)) {
      return item.value
    }
    if (typeof item.value === 'string') {
      return [item.value]
    }
    // 如果 value 类型不匹配，打印错误日志并返回空数组，避免下游逻辑出错
    console.error(
      `[getAllChildValues] Invalid 'value' in CDEFilterOption, expected string or string[] but got ${typeof item.value}:`,
      item
    )
    return []
  }
  // 递归情况：如果节点有子选项，则遍历所有子节点并递归调用本函数
  // 使用 flatMap 将所有子节点返回的数组合并成一个单一的扁平数组
  return item.itemOption.flatMap((child) => getAllChildValues(child))
}

export const getCDEItemOptionLabel = (item: CDEFilterOption): string => {
  return item.label || item.name
}

export const getOptionsByItem = (item: CDEFilterOption): { label: string; value: string }[] => {
  if (!item.itemOption) {
    return []
  }
  if (item.itemOption.some((o) => Array.isArray(o.value))) {
    console.error('[getOptionsByItem] Invalid value in CDEFilterOption, expected string but got array:', item)
    return []
  }
  return item.itemOption
    .map((o) => ({ label: getCDEItemOptionLabel(o), value: o.value }))
    .filter((o): o is { label: string; value: string } => typeof o.value === 'string')
}

/**
 * @function hasGrandChildren
 * @description 检查一个筛选选项节点是否有"孙子"节点。
 * 这用于判断当前节点的子节点是分支节点（需要递归渲染）还是叶子节点（可以渲染为Group）。
 *
 * @param {CDEFilterOption} item - 要检查的筛选选项节点。
 *
 * @returns {boolean} 如果任何一个子节点还拥有自己的子节点 (itemOption)，则返回 `true`；否则返回 `false`。
 */
export const hasGrandChildren = (item: CDEFilterOption): boolean => {
  if (!item.itemOption) {
    return false
  }
  return item.itemOption.some((subItem) => subItem.itemOption && subItem.itemOption.length > 0)
}

/**
 * 获取一个 check box item 配置 的 value
 */
export const getCheckBoxItemValue = (item: CDEFilterOption): string => {
  if (Array.isArray(item.value)) {
    console.error('[getCheckBoxItemValue] Invalid value in CDEFilterOption, expected string but got array:', item)
    return item.value.join(',')
  }
  if (!item.value) {
    console.error('[getCheckBoxItemValue] Invalid value in CDEFilterOption, expected string but got undefined:', item)
    return ''
  }
  return item.value
}

export interface IRelationMaps {
  nodeMap: Map<string, CDEFilterOption>
  parentMap: Map<string, string>
  childrenMap: Map<string, string[]>
  descendantsMap: Map<string, string[]>
}

/**
 * Traverses the options tree to build relationship maps for efficient lookups.
 * @param options - The root level options array.
 * @returns An object containing nodeMap, parentMap, childrenMap, and descendantsMap.
 */
export const buildRelationMaps = (options: CDEFilterItem['itemOption']): IRelationMaps => {
  const nodeMap = new Map<string, CDEFilterOption>()
  const parentMap = new Map<string, string>()
  const childrenMap = new Map<string, string[]>()
  const descendantsMap = new Map<string, string[]>()

  const traverse = (items: CDEFilterItem['itemOption'], parentValue?: string) => {
    if (!items) return

    items.forEach((item) => {
      const { itemOption } = item
      const valueProcessed = getCheckBoxItemValue(item)

      nodeMap.set(valueProcessed, item)
      if (parentValue) {
        parentMap.set(valueProcessed, parentValue)
      }

      const directChildren: string[] = []
      if (itemOption && itemOption.length > 0) {
        itemOption.forEach((child) => {
          directChildren.push(getCheckBoxItemValue(child))
        })
        childrenMap.set(valueProcessed, directChildren)
        traverse(itemOption, valueProcessed)
      }
    })
  }

  traverse(options)

  // Post-process to build the full descendants map for each node
  nodeMap.forEach((_, value) => {
    const descendants: string[] = []
    const queue = [...(childrenMap.get(value) || [])]
    while (queue.length > 0) {
      const current = queue.shift()!
      descendants.push(current)
      const grandChildren = childrenMap.get(current) || []
      queue.push(...grandChildren)
    }
    if (descendants.length > 0) {
      descendantsMap.set(value, descendants)
    }
  })

  return { nodeMap, parentMap, childrenMap, descendantsMap }
}
