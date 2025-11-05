import { safeToStringRender } from '../shared'
import { ReportSimpleTableCellRenderFunc } from '../type'

export const renderBondIssueRating: ReportSimpleTableCellRenderFunc = (txt, record, config, { t }) => {
  return txt + '/' + safeToStringRender(t, record['issueCredit'], config?.renderConfig)
}
