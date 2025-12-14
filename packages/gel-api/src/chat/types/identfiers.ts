// 模型类型 枚举
export enum EModelType {
  ALICE = 'alice',
  ALICE_Q_PRO = 'aliceQPro',
  GPT_4O = 'gpt4o',
  CLAUDE_4 = 'claude4',
}

export type LanBackend = 'CHS' | 'ENS'

export type ChatThinkSignal = {
  think?: 1
}

export type DeepSearchSignal = {
  think?: 1 // 坤元所暂时用这个参数
  deepSearch?: 1 // 后续他会改成这个
}

export type ChatReviewSignal = {
  review?: 1
}

export enum ChatQuestionType {
  Chat = 0, //对话页
  Detail = 1, // 详情页
}

export interface ChatRawSentenceIdentifier {
  rawSentence: string
}

export interface ChatRawSentenceIdIdentifier {
  rawSentenceID: string
}

export interface ChatGroupIdIdentifier {
  groupId: string
}

export interface ChatChatIdIdentifier {
  chatId: string
}

export interface ChatModelTypeIdentifier {
  modelType?: EModelType
}

export type ChatClientType = 'superlist' | 'aireport'

export interface ChatClientTypeIdentifier {
  clientType?: ChatClientType
}

export interface ChatQuestionIdentifier {
  searchword: string
}
