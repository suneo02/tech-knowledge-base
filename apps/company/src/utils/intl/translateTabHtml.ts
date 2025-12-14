import { translateService } from './translateService'

export function translateTabHtml(id, successFun, noNeedLoading?) {
  const tbody = window.$(id).find('tbody')
  const tds = window.$(tbody).find('td')
  const params = {}
  for (let i = 0; i < tds.length; i++) {
    let txt = window.$(tds[i])[0].innerText
    if (window.$(tds[i]).find('a').length) {
      txt = window.$(tds[i]).find('a')[0].innerText
    }
    params[i] = txt
  }
  if (!noNeedLoading) {
    // 不需要loading样式
    if (!window.$(tbody).closest('table').find('.translate-loading').length) {
      window.$(tbody).closest('table').append('<div class="translate-loading">loading</div>')
      window.$(tbody).hide()
    } else {
      // 如果正在翻译，直接返回
      return
    }
  }

  translateService(params, function (data) {
    for (let i = 0; i < tds.length; i++) {
      if (window.$(tds[i]).find('a').length) {
        window.$(tds[i]).find('a').text(data[i])
      } else {
        if (window.$(tds[i])[0].innerText) {
          window.$(tds[i]).text(data[i])
        }
      }
    }
    successFun && successFun()
    window.$(tbody).closest('table').find('.translate-loading').remove()
    window.$(tbody).show()
  })
}
