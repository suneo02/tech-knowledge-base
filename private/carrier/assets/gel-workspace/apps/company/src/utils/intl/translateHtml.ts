import { isEn } from 'gel-util/intl'
import axiosRequest from './../../api/index'
import { translateLoadManager } from './translateLoadManager'

export async function translateHtml(htmlStr) {
  if (!htmlStr || !isEn()) return htmlStr || ''
  let matchedlist = htmlStr.match(/[\u4e00-\u9fff]+/g)
  if (matchedlist && matchedlist.length) {
    matchedlist = matchedlist.sort((a, b) => b.length - a.length)
  }
  translateLoadManager.addLoadTask(htmlStr)

  const result = await axiosRequest
    .request({
      method: 'post',
      cmd: 'apitranslates',
      data: {
        transText: `{x:'${matchedlist.join('|')}'}`,
        sourceLang: 1,
        targetLang: 2,
        source: 'gel',
      },
    })
    .finally(() => {
      translateLoadManager.removeLoadTask(htmlStr)
    })
  let transText = htmlStr
  if (result?.Data?.translateResult?.x) {
    const translatedList = result.Data.translateResult.x.split('|')
    translatedList.map((res, index) => (transText = transText.replace(matchedlist[index], res)))
  }
  return transText
}
