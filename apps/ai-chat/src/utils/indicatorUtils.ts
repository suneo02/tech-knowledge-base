import { IndicatorTreeClassification } from 'gel-api'

// 保持与项目中实际类型一致，这里假设 IndicatorTreeClassification 就是我们定义的 IndicatorTreeClassification
// 如果 IndicatorTreeClassification 有更多或不同的字段，需要在这里调整
// type IndicatorTreeClassification = IndicatorTreeClassification

/**
 * 递归过滤指标树，根据 displayName 排除指定的指标。
 * 同时也会移除过滤后变为空的子节点。
 *
 * @param nodes - 当前需要过滤的节点数组。
 * @param excludedDisplayNames - 需要排除的 displayName 列表。
 * @returns 过滤后的节点数组。
 */
export const filterIndicatorsByDisplayName = (
  nodes: IndicatorTreeClassification[] | undefined,
  excludedDisplayNames: string[]
): IndicatorTreeClassification[] => {
  if (!nodes) {
    return []
  }

  const excludedSet = new Set(excludedDisplayNames)

  const filterNode = (node: IndicatorTreeClassification): IndicatorTreeClassification | null => {
    // 1. 过滤当前节点的 indicators
    const filteredIndicators = node.indicators?.filter((indicator) => !excludedSet.has(indicator.indicatorDisplayName))

    // 2. 递归过滤子节点
    const filteredChildren = node.children
      ?.map(filterNode)
      .filter((child): child is IndicatorTreeClassification => child !== null) // 去除返回 null 的子节点

    // 3. 更新当前节点的 indicators 和 children
    //    确保所有原始属性都被保留
    const newNode: IndicatorTreeClassification = {
      ...node, // 展开原始节点以保留所有属性
      indicators: filteredIndicators,
      children: filteredChildren,
    }

    // 4. 如果当前节点过滤后既没有有效的 indicators 也没有有效的 children，则移除该节点 (返回 null)
    const hasIndicators = newNode.indicators && newNode.indicators.length > 0
    const hasChildren = newNode.children && newNode.children.length > 0

    // 仅当节点不是顶层（有parentId）且内部为空时才考虑移除
    // 或者可以根据需要调整移除逻辑
    if (!hasIndicators && !hasChildren /* && node.parentId */) {
      // return null; // 暂时注释掉移除逻辑，避免意外移除顶层节点
    }

    return newNode
  }

  // 过滤顶层节点数组
  const result = nodes.map(filterNode).filter((node): node is IndicatorTreeClassification => node !== null) //确保类型正确

  return result
}

/**
 * (可选) 进一步过滤函数，用于根据顶层节点的 title 排除。
 * @param nodes
 * @param excludedTitles
 * @returns
 */
export const filterNodesByTitle = (
  nodes: IndicatorTreeClassification[] | undefined,
  excludedTitles: string[]
): IndicatorTreeClassification[] => {
  if (!nodes) {
    return []
  }
  const excludedSet = new Set(excludedTitles)
  return nodes.filter((node) => !excludedSet.has(node.title))
}
