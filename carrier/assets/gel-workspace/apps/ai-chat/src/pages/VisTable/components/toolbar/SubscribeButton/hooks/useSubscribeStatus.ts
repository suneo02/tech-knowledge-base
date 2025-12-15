import { createWFCSuperlistRequestFcs } from '@/api'
import { useSetState } from 'ahooks'
import { GetCDENewCompanyResponse } from 'gel-api'
import { useCallback, useEffect, useState } from 'react'

/** 获取订阅状态 */
const getSubscribeInfoApi = createWFCSuperlistRequestFcs('superlist/excel/getCdeNewCompany')

interface UseSubscribeStatusOptions {
  tableId: string
  autoFetch?: boolean
}

/**
 * 订阅状态管理 Hook
 * 专门负责订阅状态的获取和更新
 */
export const useSubscribeStatus = ({ tableId, autoFetch = true }: UseSubscribeStatusOptions) => {
  const [subscribeInfo, setSubscribeInfo] = useSetState<GetCDENewCompanyResponse>({
    subPush: false,
    totalNewCompany: 0,
    disableToast: false,
  })
  const [loading, setLoading] = useState<boolean>(false)

  /** 获取订阅状态 */
  const fetchSubscribeStatus = useCallback(async () => {
    if (!tableId) return

    setLoading(true)
    try {
      const res = await getSubscribeInfoApi({ tableId })
      if (res.Data) {
        setSubscribeInfo({
          ...res.Data,
        })
      }
    } catch (error) {
      console.error('获取订阅状态失败:', error)
    } finally {
      setLoading(false)
    }
  }, [tableId])

  /** 更新订阅状态 */
  const updateSubscribeStatus = useCallback((status: boolean) => {
    setSubscribeInfo({ subPush: status })
  }, [])

  useEffect(() => {
    if (autoFetch && tableId) {
      fetchSubscribeStatus()
    }
  }, [autoFetch, tableId])

  return {
    subscribeInfo,
    loading,
    updateSubscribeStatus,
  }
}
