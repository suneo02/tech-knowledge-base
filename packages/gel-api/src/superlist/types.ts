/**
 * Superlist 模块类型定义
 *
 * @description 将响应类型独立出来，避免与 config.ts 和子模块的循环依赖
 */

import { ApiResponseForWFC } from '@/types'

export type ApiResponseForSuperlist<T = never> = Omit<ApiResponseForWFC<T>, 'Page'>

export type ApiPageForSuperlist = {
  pageNo: number
  pageSize: number
  total: number
}

export type ApiPageParamForSuperlist = Pick<ApiPageForSuperlist, 'pageNo' | 'pageSize'>

export type ApiResponseForSuperlistWithPage<T = never> = ApiResponseForSuperlist<{
  list: T[]
  page: ApiPageForSuperlist
}>

export interface AiRenameConversationRequest {
  conversationId: string
}

export interface AiRenameConversationResponse {
  conversationId: string
  generateIng: string
  generateOver: boolean
  generateResult: string | null
}
