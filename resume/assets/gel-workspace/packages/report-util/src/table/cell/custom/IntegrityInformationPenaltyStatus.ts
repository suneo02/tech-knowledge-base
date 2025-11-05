import { ReportSimpleTableCellRenderFunc } from '../type'

export const renderIntegrityInformationPenaltyStatus: ReportSimpleTableCellRenderFunc = (
  txt,
  _record,
  _config,
  { isEn }
) => {
  if (txt && txt == 0) {
    return isEn ? 'Cancelled' : '已撤销'
  } else {
    return isEn ? 'Uncancelled' : '未撤销'
  }
}
