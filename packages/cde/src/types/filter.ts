import { CDEFilterItem, CDEFilterOption, CDELogicOptionValue, CDERankQueryFilterValue } from 'gel-api'

export type CDEFilterOptionFront = CDEFilterOption

/**
 * 筛选项配置
 */
export type CDEFilterItemFront = CDEFilterItem & {
  logic?: CDELogicOptionValue
}

/**
 * 筛选项 用户的筛选
 */
export type CDEFilterItemUser = Pick<CDEFilterItemFront, 'itemId' | 'logic'> & {
  title: CDEFilterItemFront['itemName']
  value?: string | string[] | CDERankQueryFilterValue[]
  // TODO item type 为 9 时
  search?: string[] | CDERankQueryFilterValue[]
  field: CDEFilterItemFront['itemField']
}

export type CDEFilterItemUserSingle = CDEFilterItemUser & {
  value: string
}

export const isSingleCDEFilterItemUser = (item: CDEFilterItemUser): item is CDEFilterItemUserSingle => {
  return typeof item.value === 'string' || item.value == null
}

export type CDEFilterItemUserMulti = CDEFilterItemUser & {
  value: string[]
}

export const isMultiCDEFilterItemUser = (item: CDEFilterItemUser): item is CDEFilterItemUserMulti => {
  return Array.isArray(item.value) || item.value == null
}
