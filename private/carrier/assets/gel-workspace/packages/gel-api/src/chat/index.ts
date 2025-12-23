import { AxiosRequestConfig } from 'axios'
import { ReportAIApiPathMap, reportApiConfigMap } from './report'

export * from './base'
export * from './config'
export * from './path'
export * from './report'
export * from './types'

export const chatApiCfg: Partial<Record<keyof ReportAIApiPathMap, AxiosRequestConfig>> = {
  ...reportApiConfigMap,
}
