import { CDELogicDefault } from '@/FilterItem'
import { CDEFilterItemUser } from '@/types'
import { CDEFilterItem, CDEFilterOption, CDERankQueryFilterValue, CDESubscribeItem, CDESuperQueryLogic } from 'gel-api'
import { isNil } from 'lodash'
import { isValidUserFilterItem } from '.'

const isString = (value: unknown): value is string => typeof value === 'string'

const isRankQueryFilterValue = (value: string | CDERankQueryFilterValue): value is CDERankQueryFilterValue =>
  typeof value === 'object' && 'objectName' in value

const formatRangeText = (range: string[], unit: string) => {
  const [start, end] = range
  if (!start) {
    return `0至${end}${unit}`
  }
  if (!end) {
    return `${start}${unit}以上`
  }
  return `${start}至${end}${unit}`
}

const handlePrefixLogic = (
  title: string,
  values: (string | CDERankQueryFilterValue)[],
  codeMap: Record<string, string>
) => {
  return `${title} - ${values
    .filter(isString)
    .map((a) => codeMap[a])
    .join('/')}`
}

const handleBoolLogic = (title: string, value: unknown[], itemOption?: CDEFilterOption[]) => {
  if (itemOption?.length) {
    const matchedOption = itemOption.find((item) => item.value === value[0])
    if (!matchedOption) {
      console.error('Boolean filter value not found in options:', { title, value: value[0], itemOption })
      return undefined
    }
    return `${title} - ${matchedOption.name}`
  }
  return `${title} - ${value[0] ? '有' : '无'}`
}

const handleRegisterCapital = (title: string, values: (string | CDERankQueryFilterValue)[]) => {
  const formattedValues = values.filter(isString).map((value) => formatRangeText(value.split('-'), '万'))
  return `${title} - ${formattedValues.join('/')}`
}

const handleEndowmentNum = (title: string, value: string) => {
  return `${title} - ${formatRangeText(value.split('-'), '人')}`
}

const handleEstablishedTime = (title: string, value: string) => {
  const timeMap: Record<string, string> = {
    '30': '一个月内',
    '180': '六个月内',
  }
  return `${title} - ${timeMap[value] || value}`
}

const handleRankQuery = (title: string, search: unknown[]) => {
  const searchValues = (search as (string | CDERankQueryFilterValue)[]).filter(isRankQueryFilterValue)
  if (searchValues.length === 0) {
    console.error('No valid rank query values found:', { title, search })
    return undefined
  }
  const names = searchValues.map((t) => t.objectName)
  return `${title} - ${names.join('、')}`
}

const handleDefaultLogic = (
  title: string,
  value: (string | CDERankQueryFilterValue)[],
  logic: string,
  itemOption?: CDEFilterOption[]
) => {
  if (logic === 'range' && isString(value[0]) && value[0].includes('-')) {
    const values = value.filter(isString).map((val) => formatRangeText(val.split('-'), '个'))
    return `${title} - ${values.join('/')}`
  }

  if (itemOption?.length) {
    const values = value.map((val) => {
      const matchedOption = itemOption.find((item) => item.value === val)
      if (!matchedOption) {
        console.error('Filter value not found in options:', { title, value: val, itemOption })
      }
      return matchedOption?.name || ''
    })
    if (values.every((v) => !v)) {
      console.error('No valid option names found for any values:', { title, value, itemOption })
      return undefined
    }
    return `${title} - ${values.join('/')}`
  }

  return `${title} - ${value.join('/')}`
}

const getCDEFilterItemText = (
  filter: CDESuperQueryLogic['filters'][number],
  filterItemCfg: CDEFilterItem,
  codeMap: Record<string, string>
): string | undefined => {
  try {
    const { logic = 'any', value, field, title, search } = filter
    const { itemOption } = filterItemCfg

    if (!value) {
      console.error('Filter value is empty:', { filter, filterItemCfg })
      return undefined
    }

    const valueArray = Array.isArray(value) ? value : [value]

    switch (logic) {
      case 'prefix':
        return handlePrefixLogic(title, valueArray, codeMap)
      case 'bool':
        return handleBoolLogic(title, valueArray, itemOption)
      default:
        if (filterItemCfg.itemType === '9' && search) {
          return handleRankQuery(title, search)
        }

        switch (field) {
          case 'register_capital':
            return handleRegisterCapital(title, valueArray)
          case 'endowment_num':
            if (!isString(valueArray[0])) {
              console.error('Invalid endowment number value:', { title, value: valueArray[0] })
              return undefined
            }
            return handleEndowmentNum(title, valueArray[0])
          case 'established_time':
            if (!isString(valueArray[0])) {
              console.error('Invalid established time value:', { title, value: valueArray[0] })
              return undefined
            }
            return handleEstablishedTime(title, valueArray[0])
          default:
            return handleDefaultLogic(title, valueArray, logic, itemOption)
        }
    }
  } catch (error) {
    console.error('Error in getCDEFilterItemText:', error, { filter, filterItemCfg })
    return undefined
  }
}

export const getCDEFiltersTextUtil = (
  filters: CDESuperQueryLogic['filters'] | CDEFilterItemUser[],
  getFilterItemById: (itemId: CDEFilterItem['itemId']) => CDEFilterItem | undefined,
  codeMap: Record<string, string>
) => {
  try {
    const strArr = filters.map((filter) => {
      const filterItemCfg = getFilterItemById(filter.itemId)

      // 包含已删除的筛选项
      if (!filterItemCfg) {
        console.warn(`包含已删除的筛选项, 模板名称：`, filter)
        return
      }
      // 用户没有输入值，那么不进行查询
      // 如果用户进行了逻辑选择但是没有输入值，那么也不进行查询
      if (!isValidUserFilterItem(filter)) {
        if (filter.logic === CDELogicDefault || isNil(filter.logic)) {
          console.error('filter value and logic is empty or default', filter)
        }
        console.warn('filter is not valid', filter)
        return
      }

      return getCDEFilterItemText(filter as CDESuperQueryLogic['filters'][number], filterItemCfg, codeMap)
    })

    return strArr.filter((str): str is string => str !== undefined).join(' · ')
  } catch (e) {
    console.error(e)
    return ''
  }
}

export const getCDESubscribeTextUtil = (
  item: CDESubscribeItem,
  getFilterItemById: (itemId: CDEFilterItem['itemId']) => CDEFilterItem | undefined,
  codeMap: Record<string, string>
) => {
  try {
    const superQueryLogic = item.superQueryLogic ? (JSON.parse(item.superQueryLogic) as CDESuperQueryLogic) : null
    const filters = superQueryLogic?.filters || []
    return getCDEFiltersTextUtil(filters, getFilterItemById, codeMap)
  } catch (e) {
    console.error(e)
    return ''
  }
}
