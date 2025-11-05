import { AxiosRequestConfig } from 'axios'
import { ApiResponseForWFC } from '../type'
import {
  wfcCorpGlobalPreSearchPath,
  wfcCorpGlobalPreSearchPayload,
  wfcCorpGlobalPreSearchResponse,
  wfcCorpPreSearchPath,
  wfcCorpPreSearchPayload,
  wfcCorpPreSearchResponse,
} from './corpPreSearch'
import { BrandSearchResponse, PatentSearchResponse } from './miscSearch'

export * from './corpPreSearch'
export * from './globalSearch'
export * from './miscSearch'
export * from './searchHistory'

export interface wfcSearchApiPath {
  [wfcCorpGlobalPreSearchPath]: {
    data: wfcCorpGlobalPreSearchPayload
    response: ApiResponseForWFC<wfcCorpGlobalPreSearchResponse>
  }
  [wfcCorpPreSearchPath]: {
    data: wfcCorpPreSearchPayload
    response: ApiResponseForWFC<wfcCorpPreSearchResponse>
  }
  'search/company/trademarkSearchLenovo': {
    response: ApiResponseForWFC<BrandSearchResponse>
  }
  'search/company/patentSearchLenovo': {
    response: ApiResponseForWFC<PatentSearchResponse>
  }
}

export const wfcSearchApiCfg: Partial<Record<keyof wfcSearchApiPath, AxiosRequestConfig>> = {
  [wfcCorpGlobalPreSearchPath]: {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
  [wfcCorpPreSearchPath]: {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
}
