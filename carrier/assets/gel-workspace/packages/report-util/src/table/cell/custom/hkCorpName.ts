import { ReportSimpleTableCellRenderFunc } from '../type'

export const renderHKCorpName: ReportSimpleTableCellRenderFunc = (txt, record) => {
  return txt + ' ' + (record.eng_name || '')
}
