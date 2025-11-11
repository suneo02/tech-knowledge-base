import { isEn } from 'gel-util/intl'
import { translateDivHtml } from './translateDivHtml'
import { translateTabHtml } from './translateTabHtml'

export function translateTable($sel, force) {
  if (!isEn()) return // 中文模式不翻译，直接返回
  try {
    let id = window.$($sel).attr('href') ? window.$($sel).attr('href') : '' // 来源左侧目录树
    if (!id) {
      // 单独的模块
      id = window.$($sel).attr('id') || ''
      id = id ? '#' + id : ''
    }
    if (id) {
      if (id == '#showCompanyInfo') {
        window.$($sel).attr('wi-lang-use', 'en')
      }
      if (!force) {
        // 强制翻译
        if (window.$($sel).attr('wi-lang-use')) return
      }
      if (['#showFinalBeneficiary', '#showShareSearch'].indexOf(id) > -1) {
        translateDivHtml(id, window.$(id).find('tbody').find('td'), function () {
          window.$($sel).attr('wi-lang-use', 'en')
        })
      } else {
        translateTabHtml(id, function () {
          window.$($sel).attr('wi-lang-use', 'en')
        })
      }
    }
  } catch (e) {}
}
