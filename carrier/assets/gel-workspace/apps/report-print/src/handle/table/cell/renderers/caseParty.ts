import { createCaseParty } from '@/comp/corp/CaseParty'
import { ConfigTableCellRenderConfig } from 'gel-types'
import { handleConfigTableArray, handleConfigTableObjectKey } from './shared'

export function renderCaseParty(txt: any, _record, config: ConfigTableCellRenderConfig) {
  const renderNotArray = (txt: any) => {
    return createCaseParty(txt, config.renderConfig?.caseParty?.nameKey, config.renderConfig?.caseParty?.idKey)
  }
  const valueHandled = handleConfigTableObjectKey(txt, config.objectKey)
  return handleConfigTableArray(valueHandled, config, renderNotArray)
}
