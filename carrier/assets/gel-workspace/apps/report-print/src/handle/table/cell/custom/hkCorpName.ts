import { CorpBasicInfo } from 'gel-types'

export const renderHKCorpName = (txt: any, record: CorpBasicInfo) => {
  return txt + ' ' + (record.eng_name || '')
}
