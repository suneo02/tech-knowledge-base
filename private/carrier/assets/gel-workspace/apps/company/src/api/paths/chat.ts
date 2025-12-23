import {
  AnalysisEnginePayload,
  ChatDetailTurn,
  ChatQuestionPlatform,
  ChatQuestionType,
  QueryReferencePayload,
} from 'gel-api'
import type { GetQuestionResponse } from '../chat/types'
import type { ApiResponse } from '../types'

export type SelectChatAIRecordParams = {
  entityCode?: string // 详情页加载历史问句时需要传company，否则不要传
  groupId?: string
}

// wind ent chat 服务
export type ChatApiPaths = {
  // Get question endpoint
  getQuestion: {
    params: {
      questionsType?: ChatQuestionType
      questionsPlatform?: ChatQuestionPlatform
      pageSize?: number
    }
    response: ApiResponse<GetQuestionResponse>
  }
  'chat/analysisEngine': {
    params: AnalysisEnginePayload
    response: ApiResponse<any>
  }
  'chat/queryReference': {
    params: QueryReferencePayload
    response: ApiResponse<any>
  }
  'chat/getResult': {
    params: {
      body: {
        version: 3
        rawSentence: string //
        rawSentenceID: string
        agentId: string
        reAgentId: string
        think: 0 | 1
      }
    }
    response: ApiResponse<any>
  }
  selectChatAIRecord: {
    params: SelectChatAIRecordParams
    response: ApiResponse<ChatDetailTurn[]>
  }
}
