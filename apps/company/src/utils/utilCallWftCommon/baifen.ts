import { wftCommonGetUrlSearch } from '../links/url'
import { wftCommon } from '../utils'

/**
 * 百分企业终端类型
 */
const baifenTerminals = ['S35', 'S67', 'S38']
/**
 *
 * 是否baifen web 端
 */
const isBaiFenWeb = () => {
  const from = wftCommonGetUrlSearch('from')
  if (from && from?.toLocaleLowerCase() === 'baifen') {
    return true
  }
  return false
}

/**
 * 判断是否是百分企业终端
 * @returns {boolean}
 */
export const isBaiFenTerminal = (terminalType: string = wftCommon.terminalType) => {
  return baifenTerminals.indexOf(terminalType) > -1
}

/**
 * 判断是否是百分企业终端 或者是 baifen web, baifen web，即 iframe 内嵌了
 * @returns {boolean}
 */
export const isBaiFenTerminalOrWeb = (terminalType: string = wftCommon.terminalType) => {
  return baifenTerminals.indexOf(terminalType) > -1 || isBaiFenWeb()
}
