import { IAggregationData, IAggregationDataOption, IAggregationList } from '@/handle/table/aggregation/type'
import { cloneDeep, isNil } from 'lodash'
import { ISearchOptionCfg } from '../../../types/configDetail/search.ts'

/**
 * 判断两个 search option item 是否相同
 */
export const checkSearchOptionEqual = (
  optionFirst: IAggregationDataOption,
  optionSecond: IAggregationDataOption,
  aggParams: ISearchOptionCfg['aggsParams']
) => {
  try {
    const valFirst = optionFirst[aggParams.value]
    const valSecond = optionSecond[aggParams.value]
    return !isNil(valFirst) && !isNil(valSecond) && valFirst === valSecond
  } catch (e) {
    console.error(e, optionFirst, optionSecond, aggParams)
    return false
  }
}

/**
 *
 * @param aggFull  第一次的全量聚合
 * @param aggOld
 * @param aggNew
 * @param lastAggChanged 用户当前点击的聚合
 * @param aggKey 该聚合的 key
 *
 * @return {IAggregationDataOption}
 */
export const mergeNewAgg = (
  aggFull: IAggregationDataOption,
  aggOld: IAggregationDataOption,
  aggNew: IAggregationDataOption,
  lastAggChanged: string,
  aggKey: string
): IAggregationDataOption => {
  if (lastAggChanged === aggKey) {
    // 用户上次点击的聚合是当前聚合 即用户第一次点击，那么用之前缓存的 count 或者新的 count
    // 如果找到相同的 value，则更新 doc_count 为新的值
    return cloneDeep({
      ...aggFull,
      doc_count: aggNew ? aggNew.doc_count : aggOld ? aggOld.doc_count : 0,
    })
  } else {
    // 用户上次点击的聚合不是当前聚合，那么用新的 count 作为全量 count
    return cloneDeep({
      ...aggFull,
      doc_count: aggNew ? aggNew.doc_count : 0,
    })
  }
}

export const mergeNewAggList = (
  fullAggList: IAggregationDataOption[],
  newAggList: IAggregationDataOption[],
  prevAggList: IAggregationDataOption[],
  searchOption: ISearchOptionCfg,
  lastAggChanged: string,
  aggKey: string
) => {
  try {
    if (!searchOption) {
      console.error(`can't find search option in config ${aggKey}`)
      return prevAggList
    }
    return fullAggList.map((aggFull) => {
      const matchingNewAgg = newAggList.find((agg) => checkSearchOptionEqual(agg, aggFull, searchOption.aggsParams))
      const matchingOldAgg = prevAggList.find((agg) => checkSearchOptionEqual(agg, aggFull, searchOption.aggsParams))
      return mergeNewAgg(aggFull, matchingOldAgg, matchingNewAgg, lastAggChanged, aggKey)
    })
  } catch (e) {
    console.error(e)
    return prevAggList
  }
}

/**
 * 将聚合数据从List格式转换为Map格式
 * @param aggregationList 聚合数据列表格式
 * @returns 转换后的聚合数据Map格式
 */
export function convertAggregationListToMap(aggregationList: IAggregationList): IAggregationData {
  if (!Array.isArray(aggregationList)) {
    return {}
  }

  const aggregationsData: IAggregationData = {}

  aggregationList.forEach((item) => {
    if (item && item.key && Array.isArray(item.options)) {
      aggregationsData[item.key] = item.options.map((option) => ({
        key: option.label || '',
        value: option.value || '',
        count: option.count || 0,
        doc_count: option.count || 0,
      }))
    }
  })

  return aggregationsData
}
