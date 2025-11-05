import { CorpGlobalPreSearchResultV1Parsed } from 'gel-api/*'

export type SearchItem =
  | {
      name: string
      value: string
      searchFlag?: 'btn' | 'history'
      aiTransFlag?: boolean
      corpNameEng?: string
      corp_name?: string
      corpName?: string
      groupsystem_name?: string
      highlight?: Record<string, any>
      id?: string
    }
  | CorpGlobalPreSearchResultV1Parsed
  | {
      info: {
        clickActiveInfo: CorpGlobalPreSearchResultV1Parsed
        clickActiveRelationInfo: CorpGlobalPreSearchResultV1Parsed
      }
    }

export type SearchListProps = {
  list: SearchItem[]
  onItemClick: (item: SearchItem) => void
  listFlag: boolean
  showSearchHistoryFlag: boolean
  showTag?: boolean
  onClearHistory?: () => void
}
