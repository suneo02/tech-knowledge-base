import { ApiResponseForWFC } from '@/wfc'
import { getCorpListPresearchResponse, WindSecureApiResponse } from '..'
import { CDEFilterCategory } from './getFilterCfg'
import { CDEFilterResResponse } from './getFilterRes'
import { CDEIndicatorItem } from './getIndicator'

// 类型守卫
export function isCDEFilterCategories(response: WindSecureApiResponse): response is CDEFilterCategory[] {
  if (!Array.isArray(response)) return false
  return response.length > 0 && 'categoryType' in response[0]
}

export function isCDEFilterResResponse(response: WindSecureApiResponse): response is CDEFilterResResponse {
  if (Array.isArray(response)) return false
  return 'data' in response
}

export function isCDEIndicatorItem(response: WindSecureApiResponse): response is CDEIndicatorItem[] {
  if (!Array.isArray(response)) return false
  return response.length > 0 && 'indicator' in response[0]
}

/**
 * 检查 整体的 api response 是否为 corp list presearch
 */
export function isCorpListPresearchResponse(
  response: ApiResponseForWFC<WindSecureApiResponse>
): response is ApiResponseForWFC<getCorpListPresearchResponse[]> {
  if (!response) return false
  if (!response.Data) return false
  if (!Array.isArray(response.Data)) return false
  return true
}
