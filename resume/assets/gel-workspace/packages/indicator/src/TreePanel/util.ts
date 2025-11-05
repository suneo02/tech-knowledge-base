import { AddIndicatorDataToSheetRequest, IndicatorTreeClassification } from 'gel-api'

/**
 * 将指标树和选中的指标转换为分类列表数据
 *
 * @param indicatorTree 指标树
 * @param checkedIndicators 选中的指标集合
 * @param tableId 表格ID
 * @returns 分类列表数据
 */
export const convertIndicatorKeysToClassificationList = (
  indicatorTree: IndicatorTreeClassification[],
  checkedIndicators: Set<number>
): AddIndicatorDataToSheetRequest['classificationList'] => {
  const classificationList: AddIndicatorDataToSheetRequest['classificationList'] = []

  // 递归遍历指标树
  const traverseTree = (classifications: IndicatorTreeClassification[]) => {
    classifications.forEach((classification) => {
      // 检查当前分类是否有选中的指标
      const checkedIndicatorsInCurrent = classification.indicators?.filter((indicator) =>
        checkedIndicators.has(indicator.spId)
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
