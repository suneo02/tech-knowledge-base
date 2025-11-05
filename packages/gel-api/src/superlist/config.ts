import { WIND_ENT_CHAT_PATH } from '@/chat'
import { ApiResponseForWFC } from '@/wfc'
import { AxiosRequestConfig } from 'axios'
import { superListCdeApiPathMap } from './cde'
import { superlistChatApiPathMap } from './chat'
import { superlistExcelApiPathMap } from './excel'
import { superlistIndicatorApiPathMap } from './indicator'
import { SuperlistPresetQuestionApiPathMap } from './presetQuestion'
import { superlistCreditsApiPathMap } from './credits'

export const SUPERLIST_API_PATH = `${WIND_ENT_CHAT_PATH}superlist` as const

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

export interface superlistApiPathMap
  extends superlistChatApiPathMap,
    superListCdeApiPathMap,
    superlistExcelApiPathMap,
    superlistIndicatorApiPathMap,
    SuperlistPresetQuestionApiPathMap,
    superlistCreditsApiPathMap {}

export const superlistApiCfg: Partial<Record<keyof superlistApiPathMap, AxiosRequestConfig>> = {}
