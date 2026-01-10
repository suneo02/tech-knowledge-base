import { CorpPreSearchResult } from 'gel-types'

export const wfcCorpGlobalPreSearchPath = 'search/company/getGlobalCompanyPreSearch'

export interface wfcCorpGlobalPreSearchPayload {
  queryText: string
  version?: 1 | 2
}

export interface wfcCorpGlobalPreSearchResponse {
  search: CorpPreSearchResult[]
  searchkey: string
}

export interface CorpGlobalPreSearchResultV1 {
  highlight: {
    isDisplayedInList: number
    label: string
    value: string
  }[]
  areaCode: string
  isListed: boolean
  corpId: string
  logo: string
  corpName: string
  location: string
  isFullMatch: boolean
  province?: string // v2才存在的参数
  regStatus?: string // 存续、吊销、注销
}

export interface CorpGlobalPreSearchResultV1Parsed extends CorpGlobalPreSearchResultV1 {
  corpNameTxt: string
  corpNameTxtCn: string
}

export const wfcCorpPreSearchPath = 'search/company/presearch'

export interface wfcCorpPreSearchPayload {
  queryText: string
}

export interface wfcCorpPreSearchResponse {
  corplist: {
    AI_trans_flag: boolean
    area_code: string
    corp_id: string
    corp_name: string
    english_name: string
    english_name_standard: string
    highlight: {
      corp_name: string
    }
    isFullMatch: boolean
    is_listed: boolean
    location: string
    logo: string
  }[]
  fullmatch: null
  searchkey: string
}
