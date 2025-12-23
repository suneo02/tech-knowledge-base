import { useCallback, useMemo, useState } from 'react'
import { IConfigDetailApiJSON } from '@/types/configDetail/common.ts'
import { isNil, omitBy } from 'lodash'
import { ICfgDetailTableJson } from '@/types/configDetail/table.ts'

export const useCfgTableApiParams = (
  apiExtra: IConfigDetailApiJSON['apiExtra'],
  apiParams: IConfigDetailApiJSON['apiParams'],
  baseInfo: Record<any, any>,
  params: ICfgDetailTableJson['params'],
  filter: Record<string, any>
) => {
  const constructedApiParams = useMemo(() => {
    const params: Record<string, any> = {}
    if (apiExtra) {
      apiExtra?.forEach((par) => {
        if (par.type === 'dynamic') {
          if (par?.apiKey && par?.key) apiParams[par.apiKey] = params?.[par.key]
        } else {
          if (par?.apiKey && par?.value) apiParams[par.apiKey] = par.value
        }
      })
    }
    if (apiParams) {
      Object.entries(apiParams).map(([key, value]) => {
        if (baseInfo[value]) apiParams[key] = baseInfo[value]
      })
    }

    return params
  }, [apiExtra, apiParams, baseInfo])

  const memoizedRequestParams = useMemo(() => {
    return omitBy(
      {
        ...constructedApiParams,
        ...params,
        ...filter,
      },
      isNil
    )
  }, [constructedApiParams, params, filter])

  return memoizedRequestParams
}

/**
 * Constructs API parameters based on apiExtra and apiParams.
 *
 * @param apiExtra - Additional API parameter configurations.
 * @param apiParams - Base API parameters.
 * @param baseInfo - Base information to map API parameters.
 * @returns Constructed API parameters.
 */
export const constructApiParams = (
  apiExtra: IConfigDetailApiJSON['apiExtra'],
  apiParams: IConfigDetailApiJSON['apiParams'],
  baseInfo: Record<string, any>
): Record<string, any> => {
  const constructedApiParams: Record<string, any> = {}

  // Process apiExtra to populate constructedApiParams
  if (apiExtra) {
    apiExtra.forEach((par) => {
      if (par.type === 'dynamic') {
        if (par?.apiKey && par?.key) {
          // Use params[key] from filter (assuming params is available in the scope)
          // Since 'params' is not available here, we need to pass it as an argument or handle it elsewhere
          // For now, we'll leave it as undefined or handle it in getRequestParams
          constructedApiParams[par.apiKey] = undefined // Placeholder
        }
      } else {
        if (par?.apiKey && par?.value) {
          constructedApiParams[par.apiKey] = par.value
        }
      }
    })
  }

  // Process apiParams to populate constructedApiParams
  if (apiParams) {
    Object.entries(apiParams).forEach(([key, value]) => {
      if (baseInfo[value] !== undefined && baseInfo[value] !== null) {
        constructedApiParams[key] = baseInfo[value]
      }
    })
  }

  return constructedApiParams
}

// src/utils/apiParams.ts

/**
 * Combines constructedApiParams with params and filter, then omits null or undefined values.
 *
 * @param constructedApiParams - The API parameters constructed from apiExtra and apiParams.
 * @param params - Additional parameters from ICfgDetailTableJson.
 * @param filter - Current filter state.
 * @returns Combined and cleaned request parameters.
 */
export const filterAndCombineRequestParams = (
  constructedApiParams: Record<string, any>,
  params: ICfgDetailTableJson['params'],
  filter: Record<string, any>
): Record<string, any> => {
  return omitBy(
    {
      ...constructedApiParams,
      ...params,
      ...filter,
    },
    isNil
  )
}

// src/hooks/useTableFilter.ts

interface FilterParams {
  pageNo: number
  pageSize: number

  [key: string]: any
}

interface UseTableFilterProps {
  initialFilter?: Partial<FilterParams>
  nodesFilter?: Partial<FilterParams>
}

export const useTableFilter = ({ initialFilter = {}, nodesFilter = {} }: UseTableFilterProps) => {
  const [filter, setFilterState] = useState<FilterParams>({
    pageNo: 0,
    pageSize: 10,
    ...initialFilter,
    ...nodesFilter,
  })

  // Function to update the filter
  const updateFilter = useCallback((newFilter: Partial<FilterParams>) => {
    setFilterState((prevFilter) => ({
      ...prevFilter,
      ...newFilter,
    }))
  }, [])

  // Function to reset the filter to initial state
  const resetFilter = useCallback(() => {
    setFilterState({
      pageNo: 0,
      pageSize: 10,
      ...initialFilter,
      ...nodesFilter,
    })
  }, [initialFilter, nodesFilter])

  return {
    filter,
    updateFilter,
    resetFilter,
  }
}
