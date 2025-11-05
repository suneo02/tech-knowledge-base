import { ChatRestoreResponse } from 'gel-api/*'
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
    params: undefined
    response: ApiResponse<GetQuestionResponse>
  }
  'chat/analysisEngine': {
    params: {
      lang: string
      body: {
        chatId: string
        searchword: string
        agentId: string
        think: number
        entityType?: string
        entityName?: string
        version: string
      }
    }
    response: ApiResponse<any>
  }
  'chat/queryReference': {
    params: {
      body: {
        searchword: string // 用analysisEngine的rewrite_sentence
        rawSentenceID: string
        chatId: string
        it: string
        callGLMType: string
        aigcStreamFlag: string
        agentId: string
        reAgentId: string
        agentParam: string
        think: 0 | 1
        version: 3
      }
    }
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
    response: ApiResponse<ChatRestoreResponse>
  }
}
