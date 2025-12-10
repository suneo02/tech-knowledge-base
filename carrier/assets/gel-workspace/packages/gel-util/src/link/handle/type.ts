import { TGelEnv } from '@/env'
import type { ReactNode } from 'react'

export type TLinkOptionsCommon = {
  params?: Record<string, string | number | undefined>
  env?: TGelEnv // 用于区分环境
}
/**
 * 链接参数类型
 */
export type TLinkOptions = {
  subModule?: string
  id?: string
  target?: string
  type?: string
  value?: string
  title?: ReactNode
  extraId?: string
  url?: string
} & TLinkOptionsCommon
