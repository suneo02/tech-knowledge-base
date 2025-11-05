import { TStandardDetailUrlProps } from '@/handle/link/module/miscDetail/standard.ts'
import { ReactNode } from 'react'
import { TGelEnv } from '@/utils/env'

export type TLinkOptionsCommon = {
  params?: Record<string, string | number>
  ifOversea?: boolean
  env?: TGelEnv // 用于区分环境
}
/**
 * 链接参数类型
 */
export type TLinkOptions = Partial<TStandardDetailUrlProps> & {
  subModule?: string
  id?: string
  target?: string
  type?: string
  value?: string
  title?: ReactNode
  extraId?: string
  url?: string
} & TLinkOptionsCommon
