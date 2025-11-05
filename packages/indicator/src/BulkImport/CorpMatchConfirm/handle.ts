import { useRequest } from 'ahooks'
import { IndicatorCorpMatchItem } from 'gel-api'
import _, { reduce } from 'lodash'
import { useEffect, useState } from 'react'
import { IndicatorBulkImportApi } from '../type'

/**
 * 企业数量统计对象接口
 */
export interface CompanyCountStats {
  cnNum: number // 中国大陆企业数量
  errNum: number // 错误/未匹配企业数量
  hongkongNum: number // 香港企业数量
  twNum: number // 台湾企业数量
}

/**
 * 企业匹配信息钩子
 * 用于获取和管理企业匹配数据及相关计数
 */
export const useCompanyMatch = (matchCompanies: IndicatorBulkImportApi['matchCompanies']) => {
  // 使用单个对象状态管理所有计数器
  // 使用单个对象状态管理所有计数器
  const [countStats, setCountStats] = useState<CompanyCountStats>({
    cnNum: 0,
    errNum: 0,
    hongkongNum: 0,
    twNum: 0,
  })

  const [companyMatchInfo, setCompanyMatchInfo] = useState<IndicatorCorpMatchItem[] | undefined>(undefined)

  const {
    loading,
    run,
    data: res,
  } = useRequest(matchCompanies, {
    onError: console.error,
    manual: true,
  })

  useEffect(() => {
    if (!res) return
    const { companyMatchList, cnNum, errorNum, hongkongNum, twNum } = res.Data

    // 使用对象一次性更新所有计数
    setCountStats({
      cnNum,
      errNum: errorNum,
      hongkongNum,
      twNum: twNum ? twNum : 0,
    })

    setCompanyMatchInfo(
      companyMatchList.map((i) => ({
        ...i,
      }))
    )
  }, [res])

  /**
   * 重置所有计数器
   */
  const resetAllCounts = () => {
    setCountStats({
      cnNum: 0,
      errNum: 0,
      hongkongNum: 0,
      twNum: 0,
    })
  }

  return {
    loading,
    countStats,
    companyMatchInfo,
    fetchCompanyMatchInfo: run,
    setCountStats,
    resetAllCounts,
    setCompanyMatchInfo,
  }
}

/**
 * 过滤两个数组，仅保留相同索引的元素
 */
export function filterBothArrays<T, U>(
  arr1: T[],
  arr2: U[],
  filterFn: (value: T, index: number) => boolean
): [T[], U[]] {
  // 获取被保留的索引
  const keptIndices = reduce<T, number[]>(
    arr1,
    (result, value, index) => {
      if (filterFn(value, index)) {
        result.push(index)
      }
      return result
    },
    []
  )

  // 过滤两个数组，仅保留相同索引的元素
  const filteredArr1 = _.map(keptIndices, (index) => arr1[index])
  const filteredArr2 = _.map(keptIndices, (index) => arr2[index])

  return [filteredArr1, filteredArr2]
}
