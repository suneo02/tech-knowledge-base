import { AxiosRequestConfig } from 'axios'
import { getRiskNewsUrlPath, getRiskNewsUrlPayload, getRiskNewsUrlResponse } from './risk'

export * from './risk'

export interface outGelApiPath {
  [getRiskNewsUrlPath]: {
    data: getRiskNewsUrlPayload
    response: getRiskNewsUrlResponse
  }
}
export const outGelApiCfg: Record<keyof outGelApiPath, AxiosRequestConfig> = {
  [getRiskNewsUrlPath]: {
    method: 'GET',
  },
}
