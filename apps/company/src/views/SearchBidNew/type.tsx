import { SearchHistoryParsed } from 'gel-api/*'

export type SearchBidNewState = {
  pagesize: number
  loading: boolean
  loadingList: boolean
  title: string
  productName: string
  compIndustry: any[]
  areaCodes: any[]
  defaultTime: any[]
  moneyList: any[]
  releaseState: string
  selectValue: string
  customizationTime: string
  pageNo: number
  resultNum: string
  errorCode: string
  resultList: any[]
  historyList: any[]
  visible: boolean
  queryHisShow: string
  productHisShow: string
  announcement: any[]
  customValue: string
  customValueBid: string
  bidMoney: any[]
  subscribeList: any[]
  subBotton: boolean
  modalType: string
  edit: boolean
  addNewSubName: string
  emailAlert: boolean
  addSubNameWarning: string
  newEmail: string
  emailError: boolean
  alreadyEmail: string
  recommend: boolean
  userType: string
  buyGive: any[]
  winGive: any[]
  showGive: any[]
  defaultRegion: any[]
  defaultIndustry: any[]
  downloadValue: string
  downloadRangWarning: boolean
  downloadWantMore: boolean
  dowmloadOverRun: boolean
  nowSubId: string
  nowSubName: string
  newPrelist: any[]
  newBiddinglist: any[]
  newDeallist: any[]
  preIndeterminate: boolean
  biddingIndeterminate: boolean
  dealIndeterminate: boolean
  preCheckAll: boolean
  biddingCheckAll: boolean
  visibleSubList: boolean
  hasAttach: boolean
  dealCheckAll: any

  keywordHis: SearchHistoryParsed
  productsHis: SearchHistoryParsed
  partHis: SearchHistoryParsed
  purchaseHis: SearchHistoryParsed
  winHis: SearchHistoryParsed

  participateInputValues: any[]
  purchaserInputValues: any[]
  winnerInputValues: any[]
  // 标签输入（公告标题/招标产品）
  titleTags: string[]
  productTags: string[]

  // 标签输入回显初始值
  participateInputInitialLabels: string[]
  purchaserInputInitialLabels: string[]
  winnerInputInitialLabels: string[]
}
export type SearchBidNewProps = {
  homePackageName: string
  homeEmail: string
}
