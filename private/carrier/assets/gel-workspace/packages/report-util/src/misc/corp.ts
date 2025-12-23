import { DEFAULT_EMPTY_TEXT } from '@/table'
import { CorpBasicInfo } from 'gel-types'

export const getCorpName = (corpBasicInfo: CorpBasicInfo | undefined, isEn: boolean) => {
  if (!corpBasicInfo) return DEFAULT_EMPTY_TEXT
  if (isEn && corpBasicInfo.eng_name) return corpBasicInfo.eng_name
  return corpBasicInfo.corp_name || DEFAULT_EMPTY_TEXT
}
