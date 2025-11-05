import { SearchHistoryParsed } from 'gel-api/*'

export type SearchJobState = {
  pageno: number
  pagesize: number
  loading: boolean
  applySearchLoading: boolean
  loadingList: boolean
  allFilter: any[]
  queryText: string
  compIndustry: any[]
  areaCodes: any[]
  dateAllow: boolean
  defaultTime: any[]
  defaultRegion: any[]
  defaultIndustry: any[]
  oppTime: string
  expIndeterminate: boolean
  expCheckAll: boolean
  expList: any[]
  eduIndeterminate: boolean
  eduCheckAll: boolean
  eduList: any[]
  releaseState: string
  preKeyword: string
  preList: any[]
  showPre: any[]
  selectValue: string
  customizationTime: string
  pageNo: number
  resultNum: string
  errorCode: string
  resultList: any[]
  historyList: any[]
  visible: boolean
  keywordHis: SearchHistoryParsed
  queryHisShow: string
  recommend: boolean
  companyHis: SearchHistoryParsed
}

export type SearchJobProps = {
  homePackageName: string
  homeEmail: string
}
