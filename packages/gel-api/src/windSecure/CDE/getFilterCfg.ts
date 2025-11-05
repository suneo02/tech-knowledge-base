export type CDELogicOptionValue = 'notAny' | 'any' | 'all' | 'prefix' | 'range' | 'bool' | 'any,notAny,all'

export type CDEFilterItemType =
  // 地区或者城市
  | '0'
  // 输入关键词包括了三个逻辑
  | '1'
  // 输入关键词
  | '2'
  // 复选框,可以自定义
  | '3'
  // 单选框,可以自定义
  | '4'
  // 有无
  | '5'
  // 数量范围
  | '6'
  // 榜单名录搜索框
  | '9'
  // 名录控件
  | '91'

export type CDEFilterOption = {
  value?: string | string[]
  hoverHint?: string
  name: string
  label?: string
  validDate?: 0 | 1
  certYear?: 0 | 1
  id?: string
  itemOption?: CDEFilterOption[]
}

export type CDEFilterOptionSingle = CDEFilterOption & {
  value: string
}

// 类型守卫，确定 itemOption 的 value 类型
export const isSingleCDEFilterOption = (itemOption: CDEFilterOption[]): itemOption is CDEFilterOptionSingle[] => {
  return itemOption.every((item) => typeof item.value === 'string' || item.value == null)
}

export type CDEFilterOptionMulti = CDEFilterOption & {
  value: string[]
}

export const isMultiCDEFilterOption = (itemOption: CDEFilterOption[]): itemOption is CDEFilterOptionMulti[] => {
  return itemOption.every((item) => Array.isArray(item.value) || item.value == null)
}

export interface CDEFilterItem {
  itemType: CDEFilterItemType
  itemEn?: string
  selfDefine?: 0 | 2 | 4
  itemOption?: CDEFilterOption[]
  hasExtra?: boolean
  key4ajax?: string
  cmd4ajax?: string
  parentId?: number
  isVip?: 0 | 1
  itemId: number
  itemName?: string
  itemField: string
  logicOption?: CDELogicOptionValue

  searchPlaceholder?: string
  itemRemark?: string
  hoverHint?: string

  multiCbx?: 1

  extraConfig?: CDEFilterItem[]
}

export interface CategoryOptionNode {
  code: string
  pCode?: string
  level: number
  name: string
  alias?: string
  nameEn?: string
  node?: CategoryOptionNode[]
}

export interface CDEFilterCategory {
  categoryType: string
  categoryOrder: number
  category: string
  categoryId: string
  categoryEn?: string
  newFilterItemList?: CDEFilterItem[]
  categoryOption?: CategoryOptionNode[]
}

export interface getCDEFilterCfgParams {
  cmd: 'getcrossfilterquery'
}
export interface getCDEFilterCfgPayload {
  cmdType: 'filterItem'
}
