import {
  AgentIdentifiers,
  AgentParam,
  ChatChatIdIdentifier,
  ChatClientTypeIdentifier,
  ChatRawSentenceIdIdentifier,
  EModelType,
  LanBackend,
} from '../types'
import { ChatQuestionIdentifier } from '../types/identfiers'

export type ChatEntityType = 'company' | 'chapter' | 'report'
/**
 * @deprecated 后续无需 search word
 */
export enum ChatPresetQuestion {
  GENERATE_FULL_TEXT = '生成全文',
  TRANSLATE_TEXT = '翻译文字',
  CONTINUE_CONTENT = '续写内容',
  SUMMARIZE_TITLE = '总结标题',
  LIST_KEY_POINTS = '列举关键点',
  CONTRACT_CONTENT = '缩写内容',
  IMPROVE_EXPRESSION = '完善表达',
  EXPAND_CONTENT = '扩写内容',
  CHAPTER_GEN_THOUGHT = '检查或生成编写思路',
}

// 意图分析请求参数
export interface AnalysisEnginePayload extends ChatClientTypeIdentifier {
  lang: LanBackend
  body: {
    transLang: string
    aigcStreamFlag?: string
    think?: 1
    entityType?: ChatEntityType
    entityName?: string

    // 模型切换
    modelType?: EModelType

    // superlist 专属
    tableAnalysis?: 1
    agentParam?: AgentParam
  } & Pick<AgentIdentifiers, 'agentId'> &
    ChatChatIdIdentifier &
    ChatQuestionIdentifier
}

// 意图分析响应
export type AnalysisEngineResponse = {
  itResult: {
    it: string // 意图 id
    rewrite_sentence?: string // 重写句子
  }
} & Pick<AgentIdentifiers, 'reAgentId'> &
  ChatRawSentenceIdIdentifier &
  ChatChatIdIdentifier
