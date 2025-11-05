import { CaseParty } from '@/components/RPNodeSpecial/CaseParty'
import { ConfigTableCellRenderConfig } from 'gel-types'
import { handleConfigTableArray, handleConfigTableObjectKey } from './shared'

export function renderCaseParty(txt: any, _record: any, config: ConfigTableCellRenderConfig) {
  const renderNotArray = (txt: any) => {
    const { nameKey, idKey } = config.renderConfig?.caseParty || {}
    return <CaseParty data={txt} nameKey={nameKey} idKey={idKey} />
  }
  const valueHandled = handleConfigTableObjectKey(txt, config.objectKey)
  return handleConfigTableArray(valueHandled, config, renderNotArray)
}
