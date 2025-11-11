import { IApiChangeIndicator } from '@/components/table/type.ts'
import { IAggregationData, IAggregationDataOption, ITableAggregationWithOption } from '@/handle/table/aggregation/type'
import { isArray } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useTranslateService } from '../../../hook'
import { ISearchOptionCfg } from '../../../types/configDetail/search.ts'
import { mergeNewAggList } from './handle.ts'

/**
 * 自定义 hook，用于处理表格中的 aggregations
 * @param aggregationsCfg json 文件中的定义
 */
export const useTableNewAggregations = (aggregationsCfg?: ISearchOptionCfg[]) => {
  const [savedAggMap, setSavedAggMap] = useState<IAggregationData>({})
  const [searchOptions, setSearchOptions] = useState([])
  const [searchOptionsIntl] = useTranslateService(searchOptions, true, true)

  const fullAggregationRef = useRef<IAggregationData>(null)

  /**
   * 处理并缓存每个 aggregation
   * @param  newAggList 旧的 aggregation 列表
   * @param aggKey 当前 aggregation 的 key
   * @param lastAggChanged
   */
  const handleAggregations = (
    newAggList: IAggregationDataOption[],
    aggKey: string,
    lastAggChanged: string,
    changeIndicator?: IApiChangeIndicator
  ) => {
    if (!isArray(aggregationsCfg)) {
      return
    }
    try {
      setSavedAggMap((prevAggMap) => {
        const searchOption = aggregationsCfg.find((item) => item.aggsKey === aggKey)
        if (!searchOption) {
          if (aggKey === 'highlight') {
            // 招投标产品词
            return {
              ...prevAggMap,
              [aggKey]: newAggList, // 更新当前 aggKey 对应的 aggregation 列表
            }
          } else {
            console.error(`can't find search option in config ${aggKey}`, aggregationsCfg)
            return prevAggMap
          }
        }

        const prevAggList = prevAggMap[aggKey] || []
        const fullAggList = fullAggregationRef.current[aggKey] || []
        let mergedAggList: typeof fullAggList

        if (!newAggList) {
          //当前 agg 在新的agg不存在,
          //  如果是切页发送的数据，那么聚合数据应该不变，有些接口会直接不传聚合数据
          if (changeIndicator === 'pagination') {
            mergedAggList = prevAggList
          } else {
            mergedAggList = [...fullAggList.map((agg) => ({ ...agg, doc_count: 0 }))]
          }
        } else {
          // 合并旧的和新的 aggregation 列表
          mergedAggList = mergeNewAggList(fullAggList, newAggList, prevAggList, searchOption, lastAggChanged, aggKey)
        }

        return {
          ...prevAggMap,
          [aggKey]: mergedAggList, // 更新当前 aggKey 对应的 aggregation 列表
        }
      })
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * 当接口中的 aggMap 返回时，更新 aggregations
   * @param  aggMap 新的 aggregations 数据
   * @param  lastAggChanged 用户上次点击的 aggregation
   *
   */
  const onAggMapChange = (aggMap: IAggregationData, lastAggChanged: string, changeIndicator?: IApiChangeIndicator) => {
    try {
      if (fullAggregationRef.current == null) {
        // 第一次的聚合是全量
        fullAggregationRef.current = aggMap
      }

      if (fullAggregationRef.current) {
        Object.keys(fullAggregationRef.current).forEach((aggKey) => {
          // 对每个 aggregation 列表进行缓存处理
          handleAggregations(aggMap[aggKey], aggKey, lastAggChanged, changeIndicator)
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!aggregationsCfg) {
      return
    }
    if (!savedAggMap || !aggregationsCfg || !isArray(aggregationsCfg)) {
      console.error('🚀 ~ setSearchOptionByAggs ~ savedAggMap, aggregationsCfg:', savedAggMap, aggregationsCfg)
    }
    let searchOptions: ITableAggregationWithOption[] = []
    try {
      searchOptions = aggregationsCfg?.map((aggCfg) => {
        let options: ITableAggregationWithOption['options']
        if (savedAggMap?.[aggCfg.aggsKey]) {
          // @ts-expect-error ts type
          options = savedAggMap[aggCfg.aggsKey]
          if (aggCfg.aggsParams) {
            options.forEach((o) => {
              Object.keys(aggCfg.aggsParams).forEach((key) => {
                o[key] = o[aggCfg.aggsParams[key]]
              })
            })
          }
        } else {
          // @ts-expect-error ts type
          options = aggCfg.options
        }
        if (aggCfg.aggsKey === 'aggs_product_name') {
          return {
            ...aggCfg,
            options,
            highlight: savedAggMap.highlight,
          } as unknown as ITableAggregationWithOption
        }
        return {
          ...aggCfg,
          options,
        }
      })
    } catch (e) {
      console.error(e)
    }
    setSearchOptions(searchOptions)
  }, [savedAggMap, aggregationsCfg])

  return {
    onAggMapChange,
    searchOptions: searchOptionsIntl,
  }
}
