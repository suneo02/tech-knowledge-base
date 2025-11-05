import { AgentIdentifiers } from '../types'

// 流式响应的选项类型
export interface StreamChoice {
  index: number
  delta: {
    content: string // 回答内容
    reasoning_content: string // 深度思考内容
  }
  finish_reason?: 'stop' | null
}

// 流式响应的数据类型
export interface StreamResponse {
  id: string
  object: string
  created: number
  model: string
  choices: StreamChoice[]
}

// 流式响应的完成标记
export type StreamDone = '[DONE]'

// 统一的流式响应类型
export type StreamChunkData = StreamResponse | StreamDone // 查询答案请求参数

export type StreamChunk = {
  data: string // json for   StreamChunkData
}

export type GetResultRequest = {
  rawSentenceID: string
  rawSentence: string
  version: number
  think?: 1
  clientType?: 'superlist'
} & AgentIdentifiers
