// 主要的六个参数

import { entWebAxiosInstance } from '@/api/entWeb'
import { functionCodesMap, postPointBuriedWithAxios } from 'gel-api'

export const SUPER_AGENT_BURY_POINTS = {
  IMMEDIATE_SEARCH: '922604570325',
  DRILLING_OPERATION: '922604570326',
  CO_CREATION: '922604570327',
  COMPANY_DETAIL: '922604570328',
} as const

// 功能点埋点，集中发送请求
// 超过20条直接抛弃
export const postPointBuried = (
  code: keyof typeof functionCodesMap | string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any = {}
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return postPointBuriedWithAxios(entWebAxiosInstance, code as any, options)
}
