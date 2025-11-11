import { IndicatorCorpMatchPayload, IndicatorCorpMatchResponse, IndicatorCorpSearchRes } from '@/indicator'
import { IndicatorTreeResponse } from '@/indicator/paths/tree'
import { ApiResponseForSuperlist, ApiResponseForSuperlistWithPage } from './types'

export type SuperListIndicatorCorpMatchPayload = IndicatorCorpMatchPayload

export type SuperListIndicatorCorpMatchResponse = IndicatorCorpMatchResponse

export type SuperListIndicatorTreeResponse = {
  data: IndicatorTreeResponse
}

export interface superlistIndicatorApiPathMap {
  'company/match': {
    data: SuperListIndicatorCorpMatchPayload
    response: ApiResponseForSuperlist<SuperListIndicatorCorpMatchResponse>
  }

  'company/search': {
    data: {
      queryText: string
    }
    response: ApiResponseForSuperlistWithPage<IndicatorCorpSearchRes>
  }
  'indicator/tree': {
    response: ApiResponseForSuperlist<SuperListIndicatorTreeResponse>
  }
  // 超级名单的指标树 坤元要求加的
  'indicator/treeV2': {
    data: {
      version: number
    }
    response: ApiResponseForSuperlist<SuperListIndicatorTreeResponse>
  }
}
