import { wftCommon } from '@/utils/utils.tsx'
import { getWsid } from '../env'

export const parseImageBase = (tableId: string, srcId: string) => {
  let url = window.location.protocol + '//news.windin.com/ns/imagebase/' + tableId + '/' + srcId
  if (!tableId) {
    url = srcId
  }
  if (srcId?.indexOf('http') > -1) {
    // 兼容后端给的是完整互联网地址
    url = srcId
    url = url.replace(/https|http/, window.location.protocol.split(':')[0])
  }
  if (!wftCommon.usedInClient()) {
    url = url + '?wind.sessionid=' + getWsid()
  }
  return url
}
