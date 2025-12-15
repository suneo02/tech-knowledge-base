import { safeToStringRender } from '../shared'
import { ReportSimpleTableCellRenderFunc } from '../type'

export const renderStaticText: ReportSimpleTableCellRenderFunc = (_txt, _record, config, { t }) => {
  const staticText = t(config.renderConfig?.contentIntl, config.renderConfig?.content)
  return safeToStringRender(t, staticText, config.renderConfig)
}
