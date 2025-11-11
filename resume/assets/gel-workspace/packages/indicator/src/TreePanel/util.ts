import { AddIndicatorDataToSheetRequest, IndicatorTreeClassification, IndicatorTreeIndicator } from 'gel-api'

/**
 * 将指标树和选中的指标转换为分类列表数据
 * 现在支持两种输入格式：newMap (Map<number, IndicatorTreeIndicator>) 或原有的 Set<number>
 *
 * @param indicatorTree 指标树
 * @param checkedIndicators 选中的指标（可以是 Set<number> 或 Map<number, IndicatorTreeIndicator>）
 * @returns 分类列表数据
 */
export const convertIndicatorKeysToClassificationList = (
  indicatorTree: IndicatorTreeClassification[],
  checkedIndicators: Set<number> | Map<number, IndicatorTreeIndicator>
): AddIndicatorDataToSheetRequest['classificationList'] => {
  const classificationList: AddIndicatorDataToSheetRequest['classificationList'] = []

  // 统一处理：将输入转换为 Set<number> 用于检查是否选中
  const checkedIds = checkedIndicators instanceof Map ? new Set(checkedIndicators.keys()) : checkedIndicators

  // 递归遍历指标树
  const traverseTree = (classifications: IndicatorTreeClassification[]) => {
    classifications.forEach((classification) => {
      // 检查当前分类是否有选中的指标
      const checkedIndicatorsInCurrent = classification.indicators?.filter((indicator) =>
        checkedIds.has(indicator.spId)
      )

      // 如果有选中的指标，添加到分类列表中
      if (checkedIndicatorsInCurrent && checkedIndicatorsInCurrent.length > 0) {
        classificationList.push({
          id: classification.key,
          rootName: classification.title,
          displayName: classification.title,
          indicators: checkedIndicatorsInCurrent.map((indicator) => ({
            spId: indicator.spId,
            displayName: indicator.indicatorDisplayName,
          })),
        })
      }

      // 递归处理子分类
      if (classification.children) {
        traverseTree(classification.children)
      }
    })
  }

  traverseTree(indicatorTree)

  return classificationList
}

/**
 * 将新的 Map 格式转换为选中的指标对象数组
 *
 * @param checkedIndicatorsMap 选中的指标 Map
 * @returns 指标对象数组
 */
export const convertMapToIndicatorArray = (
  checkedIndicatorsMap: Map<number, IndicatorTreeIndicator>
): IndicatorTreeIndicator[] => {
  return Array.from(checkedIndicatorsMap.values())
}

/**
 * 将选中的指标 Map 转换为 ID 集合（兼容性方法）
 *
 * @param checkedIndicatorsMap 选中的指标 Map
 * @returns 指标 ID 集合
 */
export const convertMapToIdSet = (checkedIndicatorsMap: Map<number, IndicatorTreeIndicator>): Set<number> => {
  return new Set(checkedIndicatorsMap.keys())
}
