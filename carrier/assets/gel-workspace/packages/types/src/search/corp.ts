export interface CorpPreSearchResult {
  highlight: [
    {
      isDisplayedInList: number
      label: string
      value: string
    },
  ]
  areaCode: string
  isListed: boolean
  corpId: string
  aiTransFlag: boolean
  corpNameEng: string
  logo: string
  corpName: string
  location: string
  isFullMatch: boolean
}
