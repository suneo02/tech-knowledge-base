export const indicatorCorpMatchPath = 'company/match' as const

export interface IndicatorCorpMatchPayload {
  queryTextList: string[]
}

export interface IndicatorCorpMatchItem {
  queryText: string
  corpId: string | null
  corpName: string | null
  engName: string | null
  creditCode: string | null
  artificialPerson: string | null
  formerName: string | null
  source: number | null
  matched: number
}

export interface IndicatorCorpMatchResponse {
  companyMatchList: IndicatorCorpMatchItem[]
  successNum: number
  errorNum: number
  cnNum: number
  hongkongNum: number
  twNum: number
}
