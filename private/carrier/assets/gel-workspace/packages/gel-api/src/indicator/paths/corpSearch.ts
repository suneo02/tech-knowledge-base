export const indicatorCorpSearchPath = 'company/search' as const

export interface IndicatorCorpSearchParams {
  queryTextList: string
}

export interface IndicatorCorpSearchRes {
  artificialPerson: string | null
  corpId: string | null
  corpName: string | null
  corpNameMatched?: boolean | null
  creditCode: string | null
  creditCodeMatch?: boolean | null
  dataFrom?: string
  engName?: string | null
  engNameMatched?: boolean | null
  formerName?: string | null
  formerNames?: string[] | null
  formerNamesMatch?: boolean | null
  matched?: number | null
  queryText?: string | null
  region?: string
  source: number | null
}
