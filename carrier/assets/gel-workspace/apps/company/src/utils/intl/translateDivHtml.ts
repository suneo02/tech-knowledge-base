import { translateService } from './translateService'

export function translateDivHtml(id, dom, successFun?) {
  const params = {}
  const translated = []
  let flag = true
  for (let i = 0; i < dom.length; i++) {
    if (window.$(dom[i]).children().length) {
      translateDivHtml(id, window.$(dom[i]).children(), successFun)
      flag = false
    } else {
      const txt = window.$(dom[i])[0].innerText
      params[i] = txt
      translated.push(i)
    }
  }
  translateService(params, function (data) {
    for (let i = 0; i < dom.length; i++) {
      if (translated.indexOf(i) > -1 && window.$(dom[i])[0].innerText) {
        window.$(dom[i]).text(data[i])
      }
    }
    if (flag) {
      successFun && successFun()
      const tbody = window.$(id).find('tbody')
      window.$(tbody).closest('table').find('.translate-loading').remove()
      window.$(tbody).show()
    }
  })
}
