export type PatentBasicNumData = {
  total: number
  corpType: string
}[]

export interface TrademarkBasicNumData {
  aggregations: {
    aggs_company_type: {
      key: string
      value: string
      doc_count: number
    }[]
    aggs_trademark_status: {
      key: string
      value: string
      doc_count: number
    }[]
  }
}
