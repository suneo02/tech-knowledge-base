import { AgentIdentifiers, LanBackend } from '../types'
import { RefTableData } from './tableData'

// 数据召回请求参数

export interface tableSelectedItem {
  startRow: number
  startCol: number
  endRow: number
  endCol: number
}

export interface QueryReferenceRequest {
  body: {
    searchword: string
    callGLMType: '3'
    aigcStreamFlag: '1'
    chatId: string
    rawSentenceID: string
    rawSentence: string
    transLang: string
    it: string
    version: number
    think?: 1 | 0 | undefined
    clientType?: 'superlist'
    // superlist 专属
    rawSentencePattern?: string
    tableAnalysis?: 1
    tableSelectedRange?: tableSelectedItem[]
  } & AgentIdentifiers
  lang: LanBackend
}

// 参考资料类型
export type QueryReferenceSuggestType = 'N' | 'RN' | 'A' | 'R' | 'L' | 'YQ' | '3C'

export type QueryReferenceSuggest = {
  text?: string
  content: string
  docId?: string
  docType?: string
  chunk?: {
    readtimes?: string
    sitename?: string
    publishdate?: string
    'sitename-01'?: string
    abstract?: string
    title?: string
    extrainfo?: string
    url?: string
  }
  windcode?: string
  source_type?: string
  'sitename-01'?: string
  doc_type?: string
  type: QueryReferenceSuggestType
  doc_id?: string
  score?: string
  docIdEncry?: string
  sourceType?: string
  sitename?: string
  publishdate?: string
  publish_date?: string
  seq?: number
  searchSum?: number
}

// dpu数据显示图表类型
export enum ChatTypeEnum {
  BAR = 1, // 柱状图
  LINE = 2, // 折线图
  PIE = 3, // 饼图
  // SPEED = 4, // 行情图
  DOT = 5, // 散点图
}
export type QueryReferenceResponse = {
  process: Array<{
    server: string
    status: string
  }>
  searchword: string
  function: {
    items: unknown[]
  }
  content: {
    data?: Array<RefTableData>
    datasource: string
    rawSentenceID: string
    model: {
      Expression?: string
      ExpendTime: string
    }
    text: string
    chart: ChatTypeEnum
  }
  status: string
  suggest?: {
    items: QueryReferenceSuggest[]
  }
  rawSentenceID: string
  rawSentence: string
  rawIntention: string
} & AgentIdentifiers
