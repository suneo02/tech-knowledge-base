import { CDEFilterCategory, CDEFilterItem } from 'gel-api'

/**
 * 递归遍历过滤器配置树，对每个 CDEFilterItem 执行回调函数
 * @param list 过滤器配置列表
 * @param callback 处理每个过滤项的回调函数
 */
export const traverseCDEFilterCfgItems = (
  list: (CDEFilterCategory | CDEFilterItem)[] = [],
  callback: (item: CDEFilterItem) => void
) => {
  list.forEach((item) => {
    // 处理嵌套项
    if ('newFilterItemList' in item) {
      // 处理 CDEFilterCategory 的子项
      traverseCDEFilterCfgItems(item.newFilterItemList || [], callback)
    } else if ('extraConfig' in item) {
      // 处理 CDEFilterItem 的额外配置
      traverseCDEFilterCfgItems(item.extraConfig || [], callback)
    }

    // 只对 CDEFilterItem 类型的项调用回调
    if ('itemType' in item && 'itemId' in item && 'itemField' in item) {
      callback(item)
    }
  })
}
/**
 * 根据 itemId 在过滤器配置中查找对应的过滤项
 * @param filterCfg 过滤器配置列表
 * @param itemId 要查找的过滤项 ID
 * @returns 找到的过滤项，如果未找到则返回 undefined
 */
export const findFilterItemById = (
  filterCfg: (CDEFilterCategory | CDEFilterItem)[],
  itemId: CDEFilterItem['itemId']
): CDEFilterItem | undefined => {
  let foundItem: CDEFilterItem | undefined

  traverseCDEFilterCfgItems(filterCfg, (item) => {
    if (item.itemId === itemId) {
      foundItem = item
    }
  })

  return foundItem
}
