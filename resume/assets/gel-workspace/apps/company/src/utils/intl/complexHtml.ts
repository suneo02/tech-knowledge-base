import { wftCommon } from '../utils.tsx'
import { cloneDeep } from 'lodash'
import { apiTranslate } from '@/api/misc.ts'

// 递归遍历对象或数组的所有值，并提取中文字符串
const extractCNStrings = (value, matchedCNList: string[]) => {
  try {
    if (typeof value === 'string') {
      const matched = value.match(/[\u4e00-\u9fff]+/g)
      if (matched) matchedCNList.push(...matched)
    } else if (Array.isArray(value)) {
      value.forEach((item) => extractCNStrings(item, matchedCNList))
    } else if (typeof value === 'object' && value !== null) {
      Object.values(value).forEach((item) => extractCNStrings(item, matchedCNList))
    }
  } catch (e) {
    console.error(e)
  }
}

const replaceChineseStrings = (value, matchedCNList: string[], translatedList: string[]) => {
  try {
    if (typeof value === 'string') {
      matchedCNList.forEach((chinese, index) => {
        value = value.replace(new RegExp(chinese, 'g'), translatedList[index])
      })
      return value
    } else if (Array.isArray(value)) {
      return value.map((item) => replaceChineseStrings(item, matchedCNList, translatedList))
    } else if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach((key) => {
        value[key] = replaceChineseStrings(value[key], matchedCNList, translatedList)
      })
      return value
    }
    return value
  } catch (e) {
    console.error(e)
    return value
  }
}

/**
 *
 * @param data
 * @returns {Promise<string|*>}
 */
export const translateComplexHtmlData = async (data) => {
  try {
    if (!data || !window.en_access_config) return data

    // 创建一个集合来存储找到的所有中文字符串
    let matchedCNList: string[] = []
    // 遍历数据结构，提取中文字符串
    extractCNStrings(data, matchedCNList)
    // 按长度排序，可以做缓存
    matchedCNList = Array.from(new Set(matchedCNList)).sort((a, b) => b.length - a.length)
    if (!matchedCNList.length) return data // 如果没有中文内容，则直接返回原数据

    wftCommon.addLoadTask(data)

    const matchedCNObj = {}
    matchedCNList.forEach((item, i) => {
      matchedCNObj[`${i}$$word`] = item
    })

    let resultData
    try {
      // 发起翻译请求
      const result = await apiTranslate({
        transText: JSON.stringify(matchedCNObj),
        sourceLang: 1,
        targetLang: 2,
        source: 'gel',
      })
      resultData = result.Data.translateResult
    } catch (e) {
      console.error(e)
      resultData = null
    } finally {
      wftCommon.removeLoadTask(data)
    }

    // 将翻译结果插入到原数据结构中
    if (resultData) {
      // 将翻译结果转换为数组, 将 resultData 根据 key 排序, 排序后将对应的 value 赋值给 translatedList
      let translatedList: string[]
      try {
        translatedList = Object.keys(resultData)
          .sort((a, b) => parseInt(a.split('$$')[0]) - parseInt(b.split('$$')[0]))
          .map((key) => resultData[key])
      } catch (e) {
        console.error(e)
        translatedList = []
      }
      // 将数据中的所有中文字符串替换为翻译结果
      return replaceChineseStrings(cloneDeep(data), matchedCNList, translatedList)
    }

    return data
  } catch (e) {
    console.error(e)
    return data
  }
}
