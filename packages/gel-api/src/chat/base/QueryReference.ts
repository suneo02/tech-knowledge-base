import {
  AgentIdentifiers,
  AgentParam,
  ChatChatIdIdentifier,
  ChatClientTypeIdentifier,
  ChatQuestionIdentifier,
  ChatRawSentenceIdentifier,
  ChatRawSentenceIdIdentifier,
  DeepSearchSignal,
  LanBackend,
} from '../types'

// 数据召回请求参数

export interface tableSelectedItem {
  startRow: number
  startCol: number
  endRow: number
  endCol: number
}

export interface QueryReferencePayload {
  source: 3
  body: {
    callGLMType: '3'
    aigcStreamFlag: '1'
    transLang: string
    it: string
    version: number
    think?: 1 | 0 | undefined
    // superlist 专属
    rawSentencePattern?: string
    tableAnalysis?: 1
    tableSelectedRange?: tableSelectedItem[]
    splVersion?: number // 耿坤元要加的
    /**
     * AI 报告会需要这个参数
     */
    agentParam?: AgentParam
    /**
     * 文件ID列表，sender 中有可能上传
     */
    fileIds?: string[]
    /**
     * 引用文件ID列表，sender 中有可能 @ 引用上传
     */
    refFileIds?: string[]
  } & AgentIdentifiers &
    DeepSearchSignal &
    ChatClientTypeIdentifier &
    ChatRawSentenceIdentifier &
    ChatRawSentenceIdIdentifier &
    ChatChatIdIdentifier &
    ChatQuestionIdentifier
  lang: LanBackend
}

// 参考资料类型
// export type RAGType = 'N' | 'RN' | 'A' | 'R' | 'L' | 'YQ' | '3C'

// export type RAGItem = {
//   text?: string
//   content: string
//   docId?: string
//   docType?: string
//   chunk?: {
//     readtimes?: string
//     sitename?: string
//     publishdate?: string
//     'sitename-01'?: string
//     abstract?: string
//     title?: string
//     extrainfo?: string
//     url?: string
//   }
//   windcode?: string
//   source_type?: string
//   'sitename-01'?: string
//   doc_type?: string
//   type: RAGType
//   doc_id?: string
//   score?: string
//   docIdEncry?: string
//   sourceType?: string
//   sitename?: string
//   publishdate?: string
//   publish_date?: string
//   seq?: number
//   searchSum?: number
// }

// Re-export ChatTypeEnum for backward compatibility
export { ChatTypeEnum } from '../types/enums'
