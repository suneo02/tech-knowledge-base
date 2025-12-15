import { getBusinessOpportunityTab } from '@/api/corp/event'
import { useRequest } from 'ahooks'
import { useCallback, useRef } from 'react'

/**
 * 商机数据获取 Hook
 * @author 张文浩<suneo@wind.com.cn>
 * @param companycode 公司代码
 * @returns 商机信息和获取函数
 */
export const useBusinessOpportunity = (companycode: string) => {
  const hasLoadedRef = useRef(false)

  // 使用 useRequest 管理异步请求
  const { data, loading, error, runAsync } = useRequest(
    async () => {
      if (!companycode) {
        throw new Error('Company code is required')
      }

      const info = await getBusinessOpportunityTab(companycode)
      return info || null
    },
    {
      manual: true,
      onError: (err) => {
        console.error('Failed to fetch business opportunity:', err)
      },
    }
  )

  const businessOpportunityInfo = data || null
  const hasLoaded = hasLoadedRef.current
  const hasData =
    businessOpportunityInfo &&
    ((businessOpportunityInfo as any).data?.length > 0 ||
      (businessOpportunityInfo as any).list?.length > 0 ||
      (typeof businessOpportunityInfo === 'object' && Object.keys(businessOpportunityInfo).length > 0))

  const fetchBusinessOpportunity = useCallback(async () => {
    if (!companycode || hasLoadedRef.current) {
      return null
    }
    hasLoadedRef.current = true // 在请求开始时就标记为已加载

    try {
      const result = await runAsync()
      return result || null
    } catch (error) {
      console.error('Failed to fetch business opportunity:', error)
      return null
    }
  }, [companycode, runAsync])

  return {
    businessOpportunityInfo,
    loading,
    hasLoaded,
    hasData,
    fetchBusinessOpportunity,
    error,
  }
}
