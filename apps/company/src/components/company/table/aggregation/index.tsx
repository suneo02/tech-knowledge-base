import Search from '@/components/common/search/Search.tsx'
import { ICorpTableCfg } from '@/components/company/type'
import { useTableNewAggregations } from '@/handle/table/aggregation'
import { IAggregationData } from '@/handle/table/aggregation/type'
import { useControllableValue } from 'ahooks'
import { isString } from 'lodash'
import React, { FC, useEffect, useMemo, useRef } from 'react'
import { useTableAggregationApi } from '../../../../handle/table/aggregation/api.ts'
import styles from './style/index.module.less'

export const useCorpTableAggApiCmd = (searchOptionApi?: string, companyCode?: string) => {
  return useMemo(() => {
    if (!(searchOptionApi && isString(searchOptionApi) && isString(companyCode))) {
      return null
    } else {
      return `${searchOptionApi}/${companyCode}`
    }
  }, [searchOptionApi, companyCode])
}

export const CorpTableAggregation: FC<{
  tableCfg: ICorpTableCfg
  companyCode: string
  onChange: (searchValues: Record<string, string>) => void
  aggDataProp?: IAggregationData // 有可能 api 在父组件发送
  value?: Record<string, string> // 可受控的筛选值
  defaultValue?: Record<string, string> // 默认筛选值
}> = ({ tableCfg, companyCode, onChange, aggDataProp, value, defaultValue }) => {
  const apiCmd = useCorpTableAggApiCmd(tableCfg.searchOptionApi, companyCode)
  const tableAggsCfg = useMemo(() => tableCfg.searchOptions, [tableCfg])

  /**
   * 使用 ahooks 的 useControllableValue 使组件可受控
   * 记录用户的筛选项
   */
  const [searchFilter, setSearchFilter] = useControllableValue<Record<string, string>>({
    value,
    defaultValue: defaultValue || {},
    onChange,
  })

  const lastAggChangedRef = useRef<string>() // 用户上次点击的聚合，用这个值来判断更新聚合 count 的逻辑
  /**
   * 这个接口可能不发送，如果父组件传递了 data，那么此组件不发生请求
   */
  const { aggData, apiExecute } = useTableAggregationApi(apiCmd, searchFilter)

  const aggregationsData = useMemo(() => {
    if (aggDataProp) {
      return aggDataProp
    }
    return aggData
  }, [aggData, aggDataProp])

  const { onAggMapChange, searchOptions } = useTableNewAggregations(tableAggsCfg)

  useEffect(() => {
    onAggMapChange(aggregationsData, lastAggChangedRef.current)
  }, [aggregationsData])

  const handleChange = (searchValues: Record<string, string>) => {
    if (searchValues) {
      setSearchFilter((prevState) => ({
        ...prevState,
        ...searchValues,
      }))
    }
    const filterKeys = Object.keys(searchValues)
    if (filterKeys.length > 0 && tableAggsCfg && Array.isArray(tableAggsCfg)) {
      // 获取该筛选项的 聚合 key
      lastAggChangedRef.current = tableAggsCfg.find((item) => item.key === filterKeys[0])?.aggsKey
    } else {
      // 正常情况不会走到这
      console.error('🚀 ~ CorpTableAggregation ~ searchValue:', tableAggsCfg)
    }
  }

  // 当 searchFilter 变化时，发送请求获取聚合数据
  useEffect(() => {
    if (isString(apiCmd) && apiCmd !== '') {
      apiExecute()
    }
  }, [searchFilter, apiCmd])

  if (!tableCfg.searchOptions) {
    return null
  }
  return <Search className={styles.corpTableAgg} onSearchChange={handleChange} searchOptions={searchOptions} />
}
