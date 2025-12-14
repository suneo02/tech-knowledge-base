import { isMultiCDEFilterItemUser } from '@/types/filter.ts'
import {
  flattenWindCascadeValue,
  parseFlattenedWindCascadeValue,
  TCascadeOptionNode,
  WindCascade,
  WindCascadeFieldNamesCommon,
  WIndCascadeOptionCommon,
} from 'gel-ui'
import { globalAreaTreeCn, industryOfNationalEconomyCfgFour } from 'gel-util/config'
import { useMemo } from 'react'
import { CDEFilterCompType } from './type'

export const RegionIndustryFilter: CDEFilterCompType = ({ item, parent, updateFilter, filter }) => {
  const { itemId, logicOption } = item //itemId:89地区，90行业
  if (filter && !isMultiCDEFilterItemUser(filter)) {
    console.error('filter is not multi value', filter)
    return null
  }

  const changeOptionCallback = (value: TCascadeOptionNode['code'][][]) => {
    updateFilter({
      filter: item,
      value: flattenWindCascadeValue(value),
      logic: logicOption,
    })
  }

  const options = useMemo<WIndCascadeOptionCommon[]>(() => {
    if (itemId === 89) {
      return globalAreaTreeCn
    }
    // 战兴行业用 接口中的数据
    if (item?.itemField === 'industry_xx_code' && 'categoryOption' in parent) {
      return (parent.categoryOption || []).map((option) => ({
        ...option,
        node: option.node || undefined,
      }))
    }
    return industryOfNationalEconomyCfgFour
  }, [item?.itemField, parent])

  const value = parseFlattenedWindCascadeValue(
    // @ts-expect-error 类型错误
    filter ? filter.value : [],
    options,
    WindCascadeFieldNamesCommon.value,
    WindCascadeFieldNamesCommon.children
  ) as string[][]

  return (
    <WindCascade
      open={true}
      dropdownMatchSelectWidth
      fieldNames={WindCascadeFieldNamesCommon}
      value={value}
      onChange={changeOptionCallback}
      options={options}
    />
  )
}
