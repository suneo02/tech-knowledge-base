import { AxiosRequestConfig } from 'axios'
import { indicatorCorpMatchPath, IndicatorCorpMatchPayload, IndicatorCorpMatchResponse } from './paths'
import { IndicatorCorpSearchParams, indicatorCorpSearchPath, IndicatorCorpSearchRes } from './paths/corpSearch'
import { indicatorProductDetailPath, IndicatorProductDetailRes } from './paths/productDetail'
export * from './paths'
export enum ApiCodeForIndicator {
  Success = 0,
}

export const INDICATOR_API_PATH = '/indicator' as const

export interface ApiResponseForIndicator<T = never> {
  code: number
  msg: string
  data: T
  errorPaths?: string | null
  systemTime?: number
  traceId?: string
  cost?: number
}

export interface indicatorApiPathMap {
  [indicatorCorpMatchPath]: {
    data: IndicatorCorpMatchPayload
    response: ApiResponseForIndicator<IndicatorCorpMatchResponse>
  }
  [indicatorCorpSearchPath]: {
    params: IndicatorCorpSearchParams
    response: ApiResponseForIndicator<IndicatorCorpSearchRes[]>
  }
  [indicatorProductDetailPath]: {
    respones: ApiResponseForIndicator<IndicatorProductDetailRes>
  }
}

export const indicatorApiCfg: Partial<Record<keyof indicatorApiPathMap, AxiosRequestConfig>> = {
  [indicatorCorpSearchPath]: {
    method: 'GET',
  },
  [indicatorProductDetailPath]: {
    method: 'GET',
  },
}
