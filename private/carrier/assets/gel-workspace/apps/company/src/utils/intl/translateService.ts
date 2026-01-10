import { wftCommon } from '@/utils/utils.tsx'
import { getApiPrefix, getWsid } from '../env'

export const translateService = (param, successFun) => {
  function errCallback(_e?) {
    if (successFun) {
      return successFun(param)
    }
    return param
  }

  if (!param) return
  if (!window.en_access_config || window.$.isEmptyObject(param)) {
    // 中文模式不翻译，直接返回
    errCallback('translateService not en or empty object')
    return
  }
  const chReg = /[\u4e00-\u9fa5]+/ // 中文正则
  const tUrl =
    getApiPrefix() +
    '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=apitranslates&gelmodule=gelpc&s=' +
    Math.random()
  const zhParam = {}
  const objParam = {}
  const arrParam = {}
  window.__GLOBAL__ZHKEYS__ = window.__GLOBAL__ZHKEYS__ || {}

  for (var k in param) {
    const word = param[k]
    if (!word) continue
    // 如果值是数组
    if (word instanceof Array) {
      // arr
      word.map((t, idx) => {
        if (t && t.toString && t.toString() == '[object Object]') {
          // arr 里面 是 obj [ {}, {} ]
          for (const kk in t) {
            param[k + '##arrobj##' + idx + '##' + kk] = t[kk]

            if (chReg.test(t[kk])) {
              if (!window.__GLOBAL__ZHKEYS__[t[kk]]) {
                zhParam[k + '##arrobj##' + idx + '##' + kk] = t[kk].replace ? t[kk].replace(/<em>|<\/em>/g, '') : t[kk]
              } else {
                param[k + '##arrobj##' + idx + '##' + kk] = window.__GLOBAL__ZHKEYS__[t[kk]]
              }
            }
            arrParam[k] = arrParam[k] || []
            arrParam[k].push(k + '##arrobj##' + idx + '##' + kk)
          }
        } else {
          param[k + '##arrstr##' + idx] = t
          // 如果有中文，先取缓存，无缓存去除高亮再翻译
          if (chReg.test(t)) {
            if (!window.__GLOBAL__ZHKEYS__[t]) {
              zhParam[k + '##arrstr##' + idx] = t.replace ? t.replace(/<em>|<\/em>/g, '') : t
            } else {
              param[k + '##arrstr##' + idx] = window.__GLOBAL__ZHKEYS__[t]
            }
            arrParam[k] = arrParam[k] || []
            arrParam[k].push(k + '##arrstr##' + idx)
          }
        }
      })
      // delete param[k]
    } else if (word.toString && word.toString() == '[object Object]') {
      // 如果值是 obj
      for (const kk in word) {
        param[k + '##obj##' + kk] = word[kk]

        if (chReg.test(word[kk])) {
          if (!window.__GLOBAL__ZHKEYS__[word[kk]]) {
            zhParam[k + '##obj##' + kk] = word[kk].replace ? word[kk].replace(/<em>|<\/em>/g, '') : word[kk]
          } else {
            param[k + '##obj##' + kk] = window.__GLOBAL__ZHKEYS__[word[kk]]
          }
          objParam[k] = objParam[k] || []
          objParam[k].push(k + '##obj##' + kk)
        }
      }
      delete param[k]
    } else {
      if (chReg.test(word)) {
        // 匹配到中文
        if (!window.__GLOBAL__ZHKEYS__[word]) {
          zhParam[k] = word.replace ? word.replace(/<em>|<\/em>/g, '') : word
        } else {
          param[k] = window.__GLOBAL__ZHKEYS__[word]
        }
      }
    }
  }

  if (!Object.entries(zhParam).length) {
    successFun && successFun(param)
    return
  }
  const mockStr = JSON.stringify(zhParam)
  if (mockStr.length > 3000) {
    for (var k in zhParam) {
      if (typeof zhParam[k] == 'object') {
        zhParam[k] = ''
      }
      if (zhParam[k] && zhParam[k].length > 50) {
        zhParam[k] = zhParam[k].substr(0, 50)
      }
    }
  }

  wftCommon.addLoadTask(param)
  const ajaxParam = {
    type: 'POST',
    url: tUrl,
    data: {
      transText: JSON.stringify(zhParam),
      sourceLang: '1',
      targetLang: '2',
      source: 'gel',
    },
    dataType: 'json',
    timeout: 60000,
    success: function (res) {
      if (res.ErrorCode == 0) {
        const data = res.Data
        if (data && data.translateResult) {
          Object.assign(param, data.translateResult)
          for (const k in zhParam) {
            const zhKey = zhParam[k]
            if (!window.__GLOBAL__ZHKEYS__[zhKey]) {
              // 将已翻译的中文 保存
              window.__GLOBAL__ZHKEYS__[zhKey] = data.translateResult[k]
            }
          }

          if (Object.entries(objParam).length) {
            for (var objK in objParam) {
              var objV = objParam[objK]
              param[objK] = param[objK] || {}
              objV.map((t) => {
                const rtnKey = t.split('##obj##')[1]
                param[objK][rtnKey] = param[t] // 对应 param 最初的 对象obj中的 某个key，返回翻译后的英文值
              })
            }
          }

          if (Object.entries(arrParam).length) {
            for (var objK in arrParam) {
              var objV = arrParam[objK]
              objV.map((t) => {
                const objZhWord = param[t]
                param[objK] = param[objK] || []
                if (t.indexOf('##arrstr##') > -1) {
                  var idx = t.split('##arrstr##')[1]
                  param[objK][idx] = objZhWord
                } else if (t.indexOf('##arrobj##') > -1) {
                  var idx = t.split('##arrobj##')[1].split('##')[0]
                  const arrKey = t.split('##arrobj##')[1].split('##')[1]
                  param[objK][idx] = param[objK][idx] || {}
                  param[objK][idx][arrKey] = objZhWord
                }
                delete param[t]
              })
            }
          }
          successFun && successFun(param)
        } else {
          errCallback(res)
        }
      } else {
        errCallback(res)
      }
    },
    error: function (e) {
      errCallback && errCallback(e)
    },
    complete: function () {
      wftCommon.removeLoadTask(param)
    },
  }
  // @ts-expect-error ttt
  ajaxParam.headers = {
    'wind.sessionId': getWsid(),
  }
  window.$.ajax(ajaxParam)
}
