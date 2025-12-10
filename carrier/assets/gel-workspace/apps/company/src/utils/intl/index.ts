import { wftCommon } from '@/utils/utils'
import intlU from 'react-intl-universal'
export * from './complexHtml'
export * from './translateService'

import { getLocale as getLocaleUtil, imlCn } from 'gel-util/intl'

// Update the options assignment
const defaultOptions = {
  commonLocaleDataUrls: {
    zh: '',
    en: '',
  },
}
// @ts-expect-error ttt
Object.assign(intlU.options, defaultOptions)

/**
 *
 * @deprecated 请用 gel-util 中的 t 代替
 * @param id {string|number}
 * @param params {string|undefined}
 * @returns {string}
 */
function intl(id: string | number, params: string | undefined = ''): string {
  // 收集无词条id的
  const isDev = wftCommon.isDevDebugger()
  if (!id && params && isDev) {
    window.noIntls = window.noIntls || []
    if (!window?.noIntls?.includes(params)) {
      console.log(`词条 intl('${id}', '${params}') 不存在,收集无词条id的词条 window.noIntls;`)
      window.noIntls.push(params)
    }
  }

  if (!id) return params
  id = id + ''
  const str = intlU.get(id, params)

  // 收集空词条
  if (id && !str && isDev) {
    window.emptyIntls = window.emptyIntls || []
    window.emptyIntlsIds = window.emptyIntlsIds || [] // 只存放id
    if (!window?.emptyIntls?.find((i) => Object.keys(i)[0] === id)) {
      console.log(`词条 intl('${id}','${params}') 不在文件中,空词条合集 window.emptyIntls +1; window.emptyIntlsIds +1`)
      window.emptyIntls.push({
        [id]: params,
      })
      window.emptyIntlsIds.push(params)
    }

    window.emptyIntlsObj = window.emptyIntlsObj || {}
    window.emptyIntlsObj[id] = params
    for (const [key, value] of Object.entries(imlCn)) {
      if (value === params) {
        console.log(
          `词条 intl('${id}', '${params}') 不在文件中,但词条中有改中文，实际词条为intl('${key}', '${params}')`
        )
      }
    }
  }
  return str ? str : params
}

/**
 * 请用 gel-util 中的 tNoNO 代替
 * @deprecated
 * @param id
 * @param params
 * @returns
 */
export const intlNoNO = (id, params?) => {
  if (id == '138741' || id == '28846') {
    // 序号不展示
    return ''
  }
  return intl(id, params)
}

/**
 * @deprecated 请用 gel-util 中的 tNoNO 代替
 * extension of function intl
 * for no index and exclude params
 * params 目前是不强制填写
 * 未来需要改成ts，通过类型来定义id，id就不可能不存在！！！
 **/
const intlNoIndex = intlNoNO

// 获取多语言设置
const getLocale = getLocaleUtil

// 获取语言大类
function getLang(locale?: string): string {
  const loc = locale || getLocale()
  if (typeof loc === 'string') {
    return loc.split('-')[0]
  }
  return loc
}

// 中文字符间不需要空，但英文单词间需要空
function getSpace(locale?: string): string {
  if (getLang(locale) === 'en') {
    return ' '
  }
  return ''
}

Object.getOwnPropertyNames(intlU.constructor.prototype)
  .concat(Object.keys(intlU))
  .forEach((key) => {
    if (key !== 'constructor') {
      if (typeof intl[key] === 'function') {
        intl[key] = (...args) => intlU[key](...args)
      } else {
        intl[key] = intlU[key]
      }
    }
  })

intl.space = ''
intl.init = (options) => {
  const ret = intlU.init(options)
  // @ts-expect-error ttt
  intl.space = getSpace(intlU.options.currentLocale)
  return ret
}

export { getLang, getLocale, intlNoIndex }
export default intl
