import { TrademarkBasicNumData } from 'gel-types'
import { WindSecureApiResponse } from '../unionTypes'

// 类型守卫
export function isTrademarkBasicNumData(
  response: WindSecureApiResponse | undefined
): response is TrademarkBasicNumData {
  if (!response) return false
  if (!('aggregations' in response)) return false
  return true
}
