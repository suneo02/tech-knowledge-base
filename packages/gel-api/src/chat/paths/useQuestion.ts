// 问句拆解请求参数
export interface GetUserQuestionRequest {
  rawSentence: string
  rawSentenceID: string
  version?: number
}

// 问句拆解响应
export type GetUserQuestionResponse = string
