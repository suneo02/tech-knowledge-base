// 参考资料类型
export type RAGType = 'N' | 'RN' | 'A' | 'R' | 'L' | 'YQ' | '3C'

export type RAGItem = {
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
  type: RAGType
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

/**
 * 包含 RAG 参考建议的接口
 *
 * @description 用于需要包含 ragList 字段的类型组合
 */
export interface WithRAGList {
  ragList: RAGItem[]
}

export interface ChatRAGResponse {
  items: RAGItem[]
}
