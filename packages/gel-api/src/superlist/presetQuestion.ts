import { ChatRawSentenceIdentifier, ChatRawSentenceIdIdentifier } from '@/chat'
import { ApiPageParamForSuperlist, ApiResponseForSuperlist } from './types'

export interface SuperListPresetQuestion extends ChatRawSentenceIdentifier, ChatRawSentenceIdIdentifier {}

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
