import { useAsync } from '@/utils/api'
import { getOrderPayStatus } from '@/api/pay.ts'
import { usePolling } from '@/utils/misc/polling.ts'
import { useEffect } from 'react'

/**
 * 自定义 Hook: 用于轮询支付状态
 */
export const usePollingPaymentStatus = (
  orderId: string,
  onSuccess?: () => void,
  onError?: () => void,
  onComplete?: () => void
) => {
  const [executeGetOrderStatus, orderStatusData] = useAsync(getOrderPayStatus)

  const callback = async () => {
    await executeGetOrderStatus(orderId)
  }
  useEffect(() => {
    try {
      if (
        orderStatusData &&
        orderStatusData.Data &&
        orderStatusData.Data.paid === true &&
        orderStatusData.Data.finish === true
      ) {
        onSuccess?.() // 如果有 onSuccess 回调则触发
        stopPolling() // 停止轮询
      } else {
        onError?.()
      }
    } catch (e) {
      onError?.()
      console.error(e)
    }
  }, [orderStatusData])

  const { startPolling, stopPolling, isPolling } = usePolling(callback, 3000, onComplete)

  return {
    startPolling,
    stopPolling,
    isPolling,
  }
}
