import { RefTableHeader } from 'gel-api' // 假设 RefTableHeader 在 gel-api 中定义

export interface PointsState {
  count: number
  loading: boolean
  error: string | null
}

// 根据 AI.tsx 中的 addDataToSheet 调用定义 payload 类型
export interface ConsumePointsPayload {
  tableId: string
  dataType: string // e.g., 'AI_CHAT_DPU'
  rawSentenceID: string
  rawSentence: string
  answers: string
  sheetId: string
  sheetName: string
  chatId: string
  dpuHeaders: RefTableHeader[] // 使用 gel-api 中的类型
  dpuContent: (string | number | null)[][] // 内容是二维数组
  // enablePointConsumption: 1 固定在 thunk 内部添加
}
