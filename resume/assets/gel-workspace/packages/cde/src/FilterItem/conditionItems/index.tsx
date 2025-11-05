import { CDEFilterItemType } from 'gel-api'
import { BooleanFilter } from './BooleanFilter.tsx'
import { KeywordFilter } from './KeywordFilter.tsx'
import { LogicalKeywordFilter } from './LogicalKeywordFilter.tsx'
import { MultiSelectFilter } from './MultiSelectFilter.tsx'
import { NumericRangeFilter } from './NumericRangeFilter.tsx'
import { RegionIndustryFilter } from './RegionIndustryFilter.tsx'
import { SearchableSelectFilter } from './SearchableSelectFilter/index.tsx'
import { SingleSelectFilter } from './SingleSelectFilter.tsx'
import { CDEFilterCompType } from './type.ts'

// 不同itemType的配置项
export const CDEFilterItemMap: Partial<Record<CDEFilterItemType, CDEFilterCompType>> = {
  '0': RegionIndustryFilter, // 类型0位地区或城市
  '1': LogicalKeywordFilter, // 类型1为输入关键词包括了三个逻辑
  '2': KeywordFilter, // 类型2为输入关键词
  '3': MultiSelectFilter, // 类型3为复选框,可以自定义
  '4': SingleSelectFilter, // 类型4为单选框,可以自定义
  '5': BooleanFilter, // 类型5为有无
  '6': NumericRangeFilter, // 类型6为数量范围
  '9': SearchableSelectFilter, // 榜单名录搜索框
  '91': SearchableSelectFilter, // 名录控件
}

export const getCDEFilterComp = (itemType: CDEFilterItemType) => {
  return CDEFilterItemMap[itemType]
}
