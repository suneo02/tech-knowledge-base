import { isChineseName } from '../utils'
import { translateService } from './translateService'

export function zh2enFlattened(vrParam, obj, parentKey) {
  for (const k in obj) {
    if (obj[k] && typeof obj[k] === 'object') {
      zh2enFlattened(vrParam, obj[k], parentKey + '$$' + k + '$$')
    } else {
      if (isChineseName(obj[k])) {
        vrParam[parentKey + '$$' + k] = obj[k]
      }
    }
  }
  return vrParam
}

export function zh2enResult(vrParam, obj, parentKey) {
  for (const k in obj) {
    if (obj[k] && typeof obj[k] === 'object') {
      zh2enResult(vrParam, obj[k], parentKey + '$$' + k + '$$')
    } else {
      if (vrParam[parentKey + '$$' + k]) {
        obj[k] = vrParam[parentKey + '$$' + k]
      }
    }
  }
  return obj
}
export function zh2enNestedPart(zhWords, successCallback, extraFun) {
  if (!zhWords || !zhWords.length) return []
  let vrData = []
  let vrParam = {}
  if (extraFun) {
    vrData = extraFun(zhWords)
  } else {
    vrData = zhWords
  }
  vrParam = zh2enFlattened(vrParam, vrData, '')
  translateService(vrParam, function (newData) {
    let newRes = []
    newRes = zh2enResult(newData, vrData, '')
    successCallback(newRes)
  })
}

export function zh2enAlwaysCallback(zhWords, successCallback, extraFun, _errorCallback, unfoldField) {
  if (!zhWords || !zhWords.length || !window.en_access_config) {
    if (successCallback) successCallback(zhWords)
    return []
  }
  let vrData = []
  const vrParam = {}
  if (extraFun) {
    vrData = extraFun(zhWords)
  } else {
    vrData = zhWords
  }
  if (unfoldField) {
    vrData.forEach(function (t, idx) {
      unfoldField.forEach(function (k) {
        vrParam[idx + '$$' + k] = t[k]
        if (t[k] === 0) {
          vrParam[idx + '$$' + k] = 0
        } else if (t[k] === '0') {
          vrParam[idx + '$$' + k] = '0'
        } else if (!t[k]) {
          vrParam[idx + '$$' + k] = ''
        } else if (t[k] === true) {
          vrParam[idx + '$$' + k] = 1
        }
      })
    })
  } else {
    vrData.forEach(function (t, idx) {
      for (const k in t) {
        vrParam[idx + '$$' + k] = t[k]
        if (t[k] === 0) {
          vrParam[idx + '$$' + k] = 0
        } else if (t[k] === '0') {
          vrParam[idx + '$$' + k] = '0'
        } else if (!t[k]) {
          vrParam[idx + '$$' + k] = ''
        } else if (t[k] === true) {
          vrParam[idx + '$$' + k] = 1
        }
      }
    })
  }
  translateService(vrParam, function (newData) {
    let newRes = []
    const resObj = {}
    if (unfoldField) {
      newRes = zhWords
      for (var k in newData) {
        var t = k.split('$$')[0]
        resObj[t] = resObj[t] || {}
        var key = k.split('$$')[1]
        newRes[t][key] = newData[k]
      }
    } else {
      for (var k in newData) {
        var t = k.split('$$')[0]
        resObj[t] = resObj[t] || {}
        var key = k.split('$$')[1]
        resObj[t][key] = newData[k]
      }
      for (var k in resObj) {
        newRes.push(resObj[k])
      }
    }
    successCallback(newRes)
  })
}

/**
 * 处理 zh2en 翻译后的数组对象格式转换
 * @author Calvin<yxlu.calvin@wind.com.cn>
 * @description
 * 1. 针对 zh2en 翻译后，数组对象的 key 变成了 key##arrobj##index##field 格式的问题
 * 2. 例如：原数据格式为 { highlight: [{ label: '值', value: '值' }] }
 * 3. 翻译后变成了 { 'highlight##arrobj##0##label': '值', 'highlight##arrobj##0##value': '值' }
 * 4. 此方法将转换回原来的数组对象格式
 *
 * @param {Array} dataArray - 需要转换的数据数组
 * @example
 * // 输入数据
 * [{
 *   'highlight##arrobj##0##label': '企业名称',
 *   'highlight##arrobj##0##value': '测试公司',
 *   otherField: 'value'
 * }]
 *
 * // 输出数据
 * [{
 *   highlight: [{
 *     label: '企业名称',
 *     value: '测试公司'
 *   }],
 *   otherField: 'value'
 * }]
 *
 * @returns {Array} 转换后的数据数组，保持原有的数组结构，同时将特殊格式的 key 转换回数组对象格式
 */
export function convertArrayObjectKeys(dataArray) {
  if (!Array.isArray(dataArray)) return dataArray
  return dataArray.map((data) => {
    const result = { ...data }
    const arrayObjPattern = /^(.+)##arrobj##(\d+)##(.+)$/ // 匹配 key##arrobj##index##field 格式
    const keysToConvert = new Map()

    // 第一步：收集所有需要转换的信息
    Object.keys(data).forEach((key) => {
      const match = key.match(arrayObjPattern)
      if (match) {
        const [, baseKey, index, field] = match
        if (!keysToConvert.has(baseKey)) {
          keysToConvert.set(baseKey, { indexes: new Set(), fields: new Set() })
        }
        const info = keysToConvert.get(baseKey)
        info.indexes.add(Number(index))
        info.fields.add(field)
        // 删除原始的 key
        delete result[key]
      }
    })

    // 第二步：转换为数组对象格式
    keysToConvert.forEach((info, baseKey) => {
      const arrayResult = Array.from(info.indexes)
        // @ts-expect-error ttt
        .sort((a, b) => a - b)
        .map((index) => {
          const obj = {}
          info.fields.forEach((field) => {
            const originalKey = `${baseKey}##arrobj##${index}##${field}`
            obj[field] = data[originalKey]
          })
          return obj
        })
      result[baseKey] = arrayResult
    })

    return result
  })
}
export function zh2en(zhWords, successCallback, extraFun?, errorCallback?, unfoldField?) {
  if (!zhWords || !Array.isArray(zhWords) || !zhWords.length) {
    if (errorCallback) errorCallback('🚀 ~ zh2en zh words is null or not an array')
    return []
  }
  let vrData = []
  const vrParam = {}
  if (extraFun) {
    vrData = extraFun(zhWords)
  } else {
    vrData = zhWords
  }
  if (unfoldField) {
    vrData.forEach(function (t, idx) {
      unfoldField.forEach(function (k) {
        vrParam[idx + '$$' + k] = t[k]
        if (t[k] === 0) {
          vrParam[idx + '$$' + k] = 0
        } else if (t[k] === '0') {
          vrParam[idx + '$$' + k] = '0'
        } else if (!t[k]) {
          vrParam[idx + '$$' + k] = ''
        } else if (t[k] === true) {
          vrParam[idx + '$$' + k] = 1
        }
      })
    })
  } else {
    vrData.forEach(function (t, idx) {
      for (const k in t) {
        vrParam[idx + '$$' + k] = t[k]
        if (t[k] === 0) {
          vrParam[idx + '$$' + k] = 0
        } else if (t[k] === '0') {
          vrParam[idx + '$$' + k] = '0'
        } else if (!t[k]) {
          vrParam[idx + '$$' + k] = ''
        } else if (t[k] === true) {
          vrParam[idx + '$$' + k] = 1
        }
      }
    })
  }
  translateService(vrParam, function (newData) {
    let newRes = []
    const resObj = {}
    if (unfoldField) {
      newRes = zhWords
      for (var k in newData) {
        var t = k.split('$$')[0]
        resObj[t] = resObj[t] || {}
        var key = k.split('$$')[1]
        newRes[t][key] = newData[k]
      }
    } else {
      for (var k in newData) {
        var t = k.split('$$')[0]
        resObj[t] = resObj[t] || {}
        var key = k.split('$$')[1]
        resObj[t][key] = newData[k]
      }
      for (var k in resObj) {
        newRes.push(resObj[k])
      }
    }
    // 这里添加针对数组的优化
    const result = convertArrayObjectKeys(newRes)
    successCallback(result)
  })
}
