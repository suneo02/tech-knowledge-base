import { usedInClient } from '@/env'
import { getIfTerminalCmd } from '../terminal/handle'

/**
 * 兼容了 终端中 跳转 f9 !!!
 * @param {*} url
 */
export const handleJumpTerminalCompatible = (url: string, isBaiFenTerminal: boolean) => {
  if (!url) {
    return
  }

  /**
   * @example `!CommandParam[8514,CompanyCode=${id},SubjectID=4778,grid=${target}]`
   */
  if (getIfTerminalCmd(url)) {
    if (usedInClient()) {
      if (isBaiFenTerminal) {
        // 处理百分终端的情况
        const matches = url.match(/!CommandParam\[(.*?)\]/)
        if (matches && matches[1]) {
          const params = matches[1].split(',')
          // 检查是否已经存在 from=baifen
          if (!params.some((param) => param.trim().startsWith('from='))) {
            // 在参数列表中添加 from=baifen
            const newParams = [...params, 'from=baifen']
            url = url.replace(/!CommandParam\[(.*?)\]/, `!CommandParam[${newParams.join(',')}]`)
          }
        }
      }
      // 终端中跳f9
      // @ts-expect-error
      window.location = url
    } else {
      console.error('handleJumpTerminalCompatible: 当前不在客户端中，无法跳转')
    }
  } else {
    /** 是否是百分企业，是的话添加百分专属后缀from=baifen */
    if (isBaiFenTerminal) {
      const _url = new URL(url)
      const _urlSearchParams = new URLSearchParams(_url.search)
      _urlSearchParams.set('from', 'baifen')
      _url.search = _urlSearchParams.toString()
      url = _url.toString()
    }
    window.open(url)
  }
}
