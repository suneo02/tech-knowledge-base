import { ApiPageParamForSuperlist, ApiResponseForSuperlist } from './config'

export interface SuperListPresetQuestion {
  rawSentence: string
  rawSentenceID: string
}
export interface SuperListPresetQuestionResponse {
  list: SuperListPresetQuestion[]
  page: null
}

export interface SuperlistPresetQuestionApiPathMap {
  'chat/presetQuestion': {
    data: {
      rawSentenceType: 'HOME' | 'AI_CHAT'
    } & ApiPageParamForSuperlist
    response: ApiResponseForSuperlist<SuperListPresetQuestionResponse>
  }
}
