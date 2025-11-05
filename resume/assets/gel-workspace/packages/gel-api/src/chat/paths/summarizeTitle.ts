// 标题摘要请求参数
export interface SummarizeTitleRequest {
  groupId: string
  rawSentence: string
  rawSentenceID: string
}

// 标题摘要响应
export type SummarizeTitleResponse = string
