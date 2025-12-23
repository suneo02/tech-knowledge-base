import { ConfigTableCellRenderConfig, CorpBasicInfo } from 'gel-types'
import { renderSimpleDate, renderText } from '../../renderers'
import styles from './index.module.less'
/**
 * 工商信息的经营状态
 * @param _txt
 * @param record
 * @param config
 * @returns
 */
export const corpInfoBussStateRender = (txt: any, record: CorpBasicInfo, config: ConfigTableCellRenderConfig) => {
  const pre = renderText(txt, record, config)
  if (record.revokeOrCancelDate) {
    const $element = $('<div>').addClass(styles['buss-state-container'])
    if (typeof pre === 'string') {
      $element.append($('<span>').text(pre))
    } else {
      $element.append(pre)
    }
    $element.append($('<span>').text(renderSimpleDate(record.revokeOrCancelDate, config.renderConfig)))
    return $element
  } else {
    return pre
  }
}
