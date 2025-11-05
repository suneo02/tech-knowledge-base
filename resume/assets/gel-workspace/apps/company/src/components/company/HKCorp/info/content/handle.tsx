// src/hooks/useApiData.ts
import { myWfcAjax } from '@/api/common.ts'
import { useHKCorpInfoCtx } from '@/components/company/HKCorp/info/ctx.tsx'
import { useTableNewAggregations } from '@/handle/table/aggregation'
import { constructApiParams, filterAndCombineRequestParams } from '@/components/table/api/handle.ts'
import global from '@/lib/global.ts'
import { wftCommon } from '@/utils/utils.tsx'
import { AxiosRequestConfig } from 'axios'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PaginationState } from './usePagination'

interface UseApiDataProps {
  api: string
  apiExtra?: any[]
  apiParams?: Record<string, any>
  params?: Record<string, any>
  maxTotal?: number
  searchOptionsProp?: any[]
  apiOptions?: AxiosRequestConfig
  pagination: PaginationState
  updateTotal: (total: number) => void
  filter: Record<string, any>
}

export const useHKCorpInfoApiData = ({
  api,
  apiExtra,
  apiParams,
  apiOptions,
  params,
  searchOptionsProp,
  filter,
  pagination,
  updateTotal,
}: UseApiDataProps) => {
  const { state } = useHKCorpInfoCtx()
  const [tableData, setTableData] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [tableLoading, setTableLoading] = useState<boolean>(false)

  const lastAggChangedRef = useRef<any>()
  const { onAggMapChange, searchOptions } = useTableNewAggregations(searchOptionsProp)

  // Memoize API parameters
  const constructedApiParams = useMemo(
    () => constructApiParams(apiExtra, apiParams, state.baseInfo),
    [apiExtra, apiParams, state.baseInfo]
  )

  // Memoize API parameters with pagination
  const memoizedApiParams = useMemo(
    () =>
      filterAndCombineRequestParams(constructedApiParams, params, {
        ...filter,
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
      }),
    [constructedApiParams, params, filter, pagination.pageNo, pagination.pageSize]
  )

  // Track if this is first render
  const isFirstRender = useRef(true)

  // Effect to handle API calls when parameters change
  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Skip if no API endpoint
    if (!api) return

    const fetchData = async () => {
      setTableLoading(true)
      try {
        const response = await myWfcAjax<any, any>(
          api,
          undefined,
          {
            ...memoizedApiParams,
            companyCode: state.corpCode,
          },
          apiOptions
        )

        const { data: Data, Page, ErrorCode } = response

        if (ErrorCode === global.VIP_OUT_LIMIT || Data == null) {
          return
        }

        // Handle pagination
        if (Page) {
          updateTotal(Page.Records)
        }

        // Handle aggregations
        if ('aggregations' in Data) {
          onAggMapChange(Data.aggregations, lastAggChangedRef.current)
        }

        // Process table data
        const tableDataComputed = Array.isArray(Data)
          ? Data.map((res, index) => ({
              ...res,
              index: pagination.pageNo * pagination.pageSize + index + 1,
            }))
          : []

        setTableData(tableDataComputed)

        // Handle translations if needed
        if (window.en_access_config) {
          wftCommon.zh2en(tableDataComputed, (endData) => {
            if (Array.isArray(endData)) {
              setTableData(endData)
            } else {
              console.error(`translated table data is not an array \t ${JSON.stringify(endData)}`)
            }
          })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setTableLoading(false)
      }
    }

    fetchData()
  }, [memoizedApiParams, api, state.corpCode, apiOptions])

  // Effect to handle initial loading state
  useEffect(() => {
    // Set loading to false after component mounts
    setLoading(false)
  }, [])

  // Keep getApiData simpler - only for initial data fetch
  const getApiData = useCallback(
    async (init?: boolean) => {
      try {
        setTableLoading(true)
        const response = await myWfcAjax<any, any>(
          api,
          undefined,
          {
            ...memoizedApiParams,
            companyCode: state.corpCode,
          },
          apiOptions
        )
        const { data: Data, Page, ErrorCode } = response
        if (ErrorCode === global.VIP_OUT_LIMIT) {
          return
        }
        if (Data == null) {
          return
        }

        // 处理分页
        if (Page) {
          updateTotal(Page.Records)
        }

        // 处理聚合数据
        if ('aggregations' in Data) {
          onAggMapChange(Data.aggregations, lastAggChangedRef.current)
        }
        // 预处理数据
        const tableDataComputed = Array.isArray(Data)
          ? Data.map((res, index) => {
              res.index = pagination.pageNo * pagination.pageSize + index + 1
              return res
            })
          : []
        setTableData(tableDataComputed)

        // 可选的翻译处理
        if (window.en_access_config) {
          // 假设 wftCommon.zh2en 是一个异步函数
          wftCommon.zh2en(tableDataComputed, (endData) => {
            if (Array.isArray(endData)) {
              setTableData(endData)
            } else {
              console.error(`translated table data is not an array \t ${JSON.stringify(endData)}`)
            }
          })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setTableLoading(false)
      }
    },
    [api, memoizedApiParams, state.corpCode, apiOptions]
  )

  return {
    tableData,
    loading,
    tableLoading,
    pagination,
    getApiData,
    lastAggChangedRef,
    searchOptions,
    setTableData,
    setLoading,
  }
}
