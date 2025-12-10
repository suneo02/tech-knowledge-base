import { isBaiFenTerminalOrWeb } from '@/utils/env'
import { wftCommon } from '@/utils/utils'
import { handleJumpTerminalCompatible } from 'gel-util/link'
import { isEmpty } from 'lodash'
import { checkLinkPermission } from './checkLinkPermission'

/**
 * 兼容了 终端中 跳转 f9 !!!
 * @param {*} url
 */
export const handleJumpTerminalCompatibleAndCheckPermission = (url: string) => {
  if (!url || isEmpty(url)) {
    return
  }

  // 检查链接权限
  if (!checkLinkPermission(url)) {
    // TODO 这里的权限不符目前只有 oversea 的，所以这里展示的提示是 oversea，如果之后要做 vip 类型的链接校验，此处还需要更改
    wftCommon.checkIfOverSea()
    return
  }

  handleJumpTerminalCompatible(url, isBaiFenTerminalOrWeb())
}
