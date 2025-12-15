import { getNewsInternal } from '@/api/corp/event'
import { wftCommon } from '@/utils/utils'
import { useRequest } from 'ahooks'
import { isEn } from 'gel-util/intl'
import { useCallback, useRef } from 'react'

/**
 * 舆情数据获取 Hook
 * @author 张文浩<suneo@wind.com.cn>
 * @param companycode 公司代码
 * @returns 法律风险事件列表和获取函数
 */
export const usePublicOpinion = (companycode: string) => {
  const hasLoadedRef = useRef(false)

  // 使用 useRequest 管理异步请求
  const { data, loading, error, runAsync } = useRequest(
    async () => {
      if (!companycode) {
        throw new Error('Company code is required')
      }

      const newCode = companycode?.length > 10 ? companycode.slice(2, 12) : companycode
      const res = await getNewsInternal(newCode, {
        __primaryKey: companycode,
        pageNo: 0,
        pageSize: 3,
      })

      if (res && res.data) {
        if (res.data.legalRiskEvents && res.data.legalRiskEvents.length) {
          let resultData = res.data.legalRiskEvents

          // 处理多语言翻译
          if (isEn()) {
            // 返回 Promise 以处理异步翻译
            return new Promise((resolve) => {
              wftCommon.zh2en(res.data.legalRiskEvents, function (endata: any) {
                resolve(endata)
              })
            })
          } else {
            return resultData
          }
        } else {
          return []
        }
      } else {
        return []
      }
    },
    {
      manual: true,
      onError: (err) => {
        console.error('Failed to fetch legal risk events:', err)
      },
    }
  )

  const legalRiskEvents = data || null
  const hasLoaded = hasLoadedRef.current
  const hasData = legalRiskEvents && Array.isArray(legalRiskEvents) && legalRiskEvents.length > 0

  const fetchLegalRiskEvents = useCallback(async () => {
    if (!companycode || hasLoadedRef.current) {
      return []
    }
    hasLoadedRef.current = true // 在请求开始时就标记为已加载

    try {
      const result = await runAsync()
      return result || []
    } catch (error) {
      console.error('Failed to fetch legal risk events:', error)
      return []
    }
  }, [companycode, runAsync])

  return {
    legalRiskEvents,
    loading,
    hasLoaded,
    hasData,
    fetchLegalRiskEvents,
    error,
  }
}
