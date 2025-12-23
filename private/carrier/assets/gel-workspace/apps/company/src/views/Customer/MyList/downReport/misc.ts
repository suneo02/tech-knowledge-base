import { getWsid } from '@/utils/env'
import { wftCommon } from '@/utils/utils'
import qs from 'qs'

export const getOpenPdfUrl = (id: string, name: string) => {
  try {
    // 查看pdf url
    let openPdf = ''
    openPdf =
      '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?' +
      qs.stringify({ gelmodule: 'gelpc', cmd: 'previewfile', taskId: id, fileName: name })
    const wsd = getWsid()

    if (wftCommon.isDevDebugger()) {
      openPdf = 'http://wx.wind.com.cn' + openPdf + '&' + qs.stringify({ 'wind.sessionid': wsd })
    } else {
      openPdf = openPdf + '&' + qs.stringify({ 'wind.sessionid': wsd })
    }
    return openPdf
  } catch (error) {
    console.error(error)
    return ''
  }
}
