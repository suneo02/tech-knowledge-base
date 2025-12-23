export interface LLMServiceMessage {
  role: string
  content: string
  list?: LLMServiceMessage[]
}

// 对话会话类型
export interface ChatSession {
  id: string
  title: string
  createdAt: number
  updatedAt: number
}
