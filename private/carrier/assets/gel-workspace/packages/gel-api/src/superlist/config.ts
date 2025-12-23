import { WIND_ENT_CHAT_PATH } from '@/chat'
import { AxiosRequestConfig } from 'axios'
import { superListCdeApiPathMap } from './cde'
import { superlistChatApiPathMap } from './chat'
import { superlistCreditsApiPathMap } from './credits'
import { superlistExcelApiPathMap } from './excel'
import { superlistIndicatorApiPathMap } from './indicator'
import { SuperlistPresetQuestionApiPathMap } from './presetQuestion'

export const SUPERLIST_API_PATH = `${WIND_ENT_CHAT_PATH}superlist` as const

export interface superlistApiPathMap
  extends superlistChatApiPathMap,
    superListCdeApiPathMap,
    superlistExcelApiPathMap,
    superlistIndicatorApiPathMap,
    SuperlistPresetQuestionApiPathMap,
    superlistCreditsApiPathMap {}

export const superlistApiCfg: Partial<Record<keyof superlistApiPathMap, AxiosRequestConfig>> = {}
