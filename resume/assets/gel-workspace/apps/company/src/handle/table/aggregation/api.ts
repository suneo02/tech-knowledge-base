import { myWfcAjax } from '@/api/common.ts'
import { convertAggregationListToMap } from '@/handle/table/aggregation/handle.ts'
import { AggregationApiResponse, IAggregationData, IAggResFrontType } from '@/handle/table/aggregation/type.ts'
import { useAsync } from '@/utils/api'
import { useCallback, useMemo } from 'react'

/**
 * 聚合数据接口 Hook
 * 无论 searchOptionDataType 是什么类型，都会返回统一的 IAggregationData 格式
 * 并额外提供 aggData 字段直接访问聚合数据
 */
export const useTableAggregationApi = <T = undefined, S extends IAggResFrontType = undefined>(
  cmd: string | null,
  data: T | undefined,
  searchOptionDataType?: S
) => {
  const apiHandle = useCallback(() => {
    if (!cmd) {
      return null
    }
    return myWfcAjax<AggregationApiResponse<S>, T>(cmd, data)
  }, [cmd, data])

  const [apiExecute, rawResponse] = useAsync(apiHandle)

  /**
   * 提取聚合数据
   */
  const extractAggregationData = useMemo(() => {
    if (!rawResponse?.Data) {
      return {} as IAggregationData
    }

    // 如果是 aggList 类型，需要转换为 aggMap 格式
    if (searchOptionDataType === 'aggList' && Array.isArray(rawResponse.Data)) {
      return convertAggregationListToMap(rawResponse.Data)
    }

    // 如果是 aggMap 类型，直接返回
    if (
      rawResponse?.Data &&
      typeof rawResponse.Data === 'object' &&
      !Array.isArray(rawResponse.Data) &&
      'aggregations' in rawResponse.Data
    ) {
      return rawResponse.Data.aggregations
    }

    return {} as IAggregationData
  }, [rawResponse, searchOptionDataType])

  return {
    dataRes: rawResponse,
    apiExecute,
    aggData: extractAggregationData,
  }
}
