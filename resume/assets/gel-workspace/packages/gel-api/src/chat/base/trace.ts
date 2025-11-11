
export interface ChatTraceItem {
  traced: {
    start: number
    end: number
    index: number
  }[]
  value: string
}
