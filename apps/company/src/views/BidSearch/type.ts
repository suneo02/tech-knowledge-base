export type BidSearchListProps = {
  keyword: string
  getPersonList: (data: any) => Promise<any>
  getBidSearchList: (data: any) => Promise<any>
  setGlobalSearch: (data?: any) => void
  getPersonView: (data?: any) => Promise<any>
  setPersonView: (data?: any) => void
  clearPersonView: (data?: any) => Promise<any>
  personList: any[]
  personListErrorCode: string
  personView: any[]
  bidSearchList: any[]
  bidViewList: any[]
  bidErrorCode: string
  globalSearchTimeStamp?: number
}

export type BidSearchListState = {
  filter: any
  pageNo: number
  pageSize: number
  resultNum: string | number
  loading: boolean
  loadingList: boolean
  allFilter: any[]
  region: string
  industry: string
  queryText: string
  industryname: string[][]
  regioninfo: string[][]
  dateAllow: boolean
  defaultTime: string[]
  oppTime: string
}
