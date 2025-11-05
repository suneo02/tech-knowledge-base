import { AgentIdentifiers, LanBackend } from '../types'

// 意图分析请求参数
export interface AnalysisEngineRequest {
  lang: LanBackend
  body: {
    chatId: string
    searchword: string
    transLang: string
    aigcStreamFlag?: string
    think?: 1
    entityType?: string
    entityName?: string
    // superlist 专属
    tableAnalysis?: 1
  } & Pick<AgentIdentifiers, 'agentId'>
}

// 意图分析响应
export type AnalysisEngineResponse = {
  rawSentenceID: string // 原始句子ID
  itResult: {
    it: string // 意图 id
    rewrite_sentence?: string // 重写句子
  }
} & Pick<AgentIdentifiers, 'reAgentId'>
