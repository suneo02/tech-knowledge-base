import { createHashHistory } from 'history'
import queryString from 'qs'

export function wftCommonGetUrlSearch(parama: string, addr?: string) {
  //获取url某个字段后的字符串
  let loc = addr ? addr : window.location.href
  // 针对 companycode 单独处理 匹配不区分大小写
  if (loc.replace) {
    loc = loc.replace(/companycode/i, 'companycode')
  }
  if (parama.toLowerCase && parama.toLowerCase() === 'companycode') {
    parama = parama.toLowerCase()
  }
  const pattern = new RegExp(parama + '=([^&#|]+)#?')
  const patternArr = pattern.exec(loc)
  if (patternArr) {
    return patternArr[1]
  } else {
    return ''
  }
}

export const wftCommonQueryStringObjs = () => {
  const history = createHashHistory()
  let searchObjs = {}
  if (history.location.search) {
    searchObjs = queryString.parse(history.location.search, {
      ignoreQueryPrefix: true,
    })
    return searchObjs ? searchObjs : {}
  } else {
    var str = str ? str : window.location.search
    str.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), function (_$0, $1, _$2, $3) {
      searchObjs[$1] = $3
    })
    return searchObjs ? searchObjs : {}
  }
}
