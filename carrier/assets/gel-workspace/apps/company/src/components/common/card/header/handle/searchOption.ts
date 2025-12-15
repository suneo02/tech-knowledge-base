import { ITableAggregationWithOption } from '@/handle/table/aggregation/type'
import { isArray, isNil } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

// 定义Hook
export function useSearchOptionSplit<T extends ITableAggregationWithOption>(optionsProp?: T[] | T) {
  // 设置状态来存储定制和非定制选项
  const [customOptions, setCustomOptions] = useState<T[]>([])
  const [nonCustomOptions, setNonCustomOptions] = useState<T[]>([])

  useEffect(() => {
    try {
      if (isNil(optionsProp)) {
        return
      }
      const options = isArray(optionsProp) ? (optionsProp as T[]) : [optionsProp as T]
      // 初始化两个空数组
      const custom: T[] = []
      const nonCustom: T[] = []

      // 遍历options数组
      options.forEach((option) => {
        // 检查是否有customId属性，如果有则认为是定制选项
        if (option.customId) {
          custom.push(option)
        } else {
          nonCustom.push(option)
        }
      })

      // 设置状态
      setCustomOptions(custom)
      setNonCustomOptions(nonCustom)
    } catch (e) {
      console.error(e)
    }
  }, [optionsProp])

  /**
   * 将自定义的 options 区分为渲染在 header 中和 search 中的，主要为了做 样式调整
   */
  const [customOptionsInSearch, customOptionsInHeader] = useMemo(() => {
    const inSearch: T[] = []
    const inHeader: T[] = []
    customOptions.forEach((option) => {
      if (option.customId === 'bidProductWord') {
        inHeader.push(option)
      } else {
        inSearch.push(option)
      }
    })
    return [inSearch, inHeader]
  }, [customOptions])

  // 返回拆分后的选项
  return { customOptions, nonCustomOptions, customOptionsInSearch, customOptionsInHeader }
}
