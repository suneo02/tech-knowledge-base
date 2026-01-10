import { CDEFilterItem } from 'gel-api'

/**
 * 是否展示 单选
 */
export const isShowOptionViewportRadio = (info: CDEFilterItem) => {
  try {
    return (
      // @ts-expect-error
      info.itemType > 3 && info.itemType !== '6' && info.itemType !== '9' && info.itemType !== '91'
    )
  } catch (error) {
    return false
  }
}

/**
 * 是否展示 级联选择
 */
export const isShowOptionViewportCascade = (info: CDEFilterItem, logic: string) => {
  try {
    return (
      logic === 'prefix' ||
      logic === 'keyword' ||
      // @ts-expect-error
      info.itemType <= 2 ||
      info.itemType === '6' ||
      info.itemType === '10' ||
      info.categoryType === '2'
    )
  } catch (error) {
    return false
  }
}
