import { ChatGroupIdIdentifier, ChatRawSentenceIdentifier, ChatRawSentenceIdIdentifier } from '../types'

// 标题摘要请求参数
export interface SummarizeTitleRequest
  extends ChatRawSentenceIdentifier,
    ChatRawSentenceIdIdentifier,
    ChatGroupIdIdentifier {}

// 标题摘要响应
export type SummarizeTitleResponse = string
