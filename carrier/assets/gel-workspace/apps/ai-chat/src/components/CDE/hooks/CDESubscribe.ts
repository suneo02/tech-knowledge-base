import { createWFCRequest } from '@/api'
import { useRequest } from 'ahooks'
import { CDESubscribeItem } from 'gel-api'

const fetchSub = createWFCRequest('operation/query/getsubcorpcriterion')

export type useCDESubscribeApiReturn = {
  fetchCDESubscriptions: () => void
  fetchSubscriptionLoading: boolean
  subscriptions: CDESubscribeItem[]
  subEmail: string
}
export const useCDESubscribeApi = (): useCDESubscribeApiReturn => {
  const {
    data: subscriptionsData,
    run: fetchCDESubscriptions,
    loading: fetchSubscriptionLoading,
  } = useRequest<Awaited<ReturnType<typeof fetchSub>>, Parameters<typeof fetchSub>>(fetchSub, {
    manual: true,
  })

  const subscriptions = useMemo(() => {
    return subscriptionsData?.Data?.records || []
  }, [subscriptionsData])

  const subEmail = useMemo(() => {
    return subscriptionsData?.Data?.mail || ''
  }, [subscriptionsData])

  return {
    fetchCDESubscriptions,
    fetchSubscriptionLoading,

    subscriptions,
    subEmail,
  }
}
