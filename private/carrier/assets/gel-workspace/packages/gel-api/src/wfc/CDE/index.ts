import type { AxiosRequestConfig } from 'axios'

import { ApiResponseForWFC } from '@/types'
import {
  addCDESubscribePath,
  CDEAddSubscribePayload,
  CDEDeleteSubscribePayload,
  CDESubscribeListResponse,
  CDEUpdateSubscribePayload,
  deleteCDESubscribePath,
  getCDESubscribeListPath,
  updateCDESubscribePath,
} from './subscribe'

export * from './subscribe'

export interface wfcCDEApiPath {
  [getCDESubscribeListPath]: {
    response: ApiResponseForWFC<CDESubscribeListResponse>
  }
  [addCDESubscribePath]: {
    data: CDEAddSubscribePayload
    response: ApiResponseForWFC
  }
  [updateCDESubscribePath]: {
    data: CDEUpdateSubscribePayload
    response: ApiResponseForWFC
  }
  [deleteCDESubscribePath]: { data: CDEDeleteSubscribePayload; response: ApiResponseForWFC }
}

export const wfcCDEApiCfg: Record<keyof wfcCDEApiPath, AxiosRequestConfig> = {
  [getCDESubscribeListPath]: {
    method: 'POST',
  },
  [addCDESubscribePath]: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
  [updateCDESubscribePath]: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
  [deleteCDESubscribePath]: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
}
