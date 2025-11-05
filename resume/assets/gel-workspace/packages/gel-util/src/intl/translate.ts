import { cloneDeep } from 'lodash'
import { extractTranslatableStrings, replaceStringsInText } from './stringUtils'

/**
 * 递归遍历对象或数组，提取其中所有包含中文字符的文本片段。
 * 此函数会智能处理包含 HTML 标签的字符串，只提取标签外的文本内容。
 * @param value - 要遍历的数据，可以是任何类型。
 * @param matchedCNList - 用于收集提取到的字符串的数组。
 */
const extractCNStrings = (value: any, matchedCNList: string[]) => {
  try {
    if (typeof value === 'string') {
      const translatableParts = extractTranslatableStrings(value)
      if (translatableParts.length > 0) {
        matchedCNList.push(...translatableParts)
      }
    } else if (Array.isArray(value)) {
      // 如果是数组，则递归遍历每个元素
      value.forEach((item) => extractCNStrings(item, matchedCNList))
    } else if (typeof value === 'object' && value !== null) {
      // 如果是对象，则递归遍历每个值
      Object.values(value).forEach((item) => extractCNStrings(item, matchedCNList))
    }
  } catch (e) {
    console.error('提取中文字符串时出错:', e)
  }
}

/**
 * 递归替换数据结构中的中文字符串为对应的翻译文本。
 * @param value - 要处理的数据。
 * @param matchedCNList - 原始的中文列表，按长度降序排列。
 * @param translatedList - 与中文列表顺序一致的翻译结果列表。
 * @returns - 返回替换后的数据。
 */
function replaceChineseStrings(value: any, matchedCNList: string[], translatedList: string[]): any {
  try {
    if (typeof value === 'string') {
      return replaceStringsInText(value, matchedCNList, translatedList)
    } else if (Array.isArray(value)) {
      // 如果是数组，递归替换每个元素
      return value.map((item) => replaceChineseStrings(item, matchedCNList, translatedList))
    } else if (typeof value === 'object' && value !== null) {
      // 创建一个新的对象副本进行修改，避免直接修改原对象
      const newValue = { ...value }
      Object.keys(newValue).forEach((key) => {
        newValue[key] = replaceChineseStrings(newValue[key], matchedCNList, translatedList)
      })
      return newValue
    }
    return value
  } catch (e) {
    console.error('替换中文字符串时出错:', e, value)
    return value
  }
}

/**
 * 对包含复杂数据结构（如 HTML 字符串、对象、数组）的数据进行智能翻译。
 * 该函数会抽离出所有中文字符，调用外部翻译 API，然后将翻译结果替换回原数据结构。
 * @param data - 需要翻译的原始数据。
 * @param apiTranslate - 一个外部翻译函数，接收一个 Record<string, string> 对象，并返回一个 Promise<Record<string, string>>。
 * @returns {Promise<any>} - 返回翻译后的数据或在无需翻译或出错时返回原数据。
 */
export const translateComplexHtmlData = async (
  data: any,
  apiTranslate: (params: Record<string, string>) => Promise<Record<string, string>>,
  chunkSize = 20
) => {
  try {
    // 如果没有数据，或者当前语言不是英语环境，则直接返回原数据
    if (!data) return data

    // 创建一个数组来存储找到的所有中文字符串
    let matchedCNList: string[] = []
    // 步骤1: 遍历数据结构，提取所有中文字符串
    extractCNStrings(data, matchedCNList)

    // 步骤2: 对提取的中文列表去重，并按字符串长度降序排序
    // 降序排序是为了优先替换较长的字符串，避免因替换子字符串而导致长字符串匹配失效
    // 例如，优先替换 "中国人"，再替换 "中国"，而不是反过来。
    matchedCNList = Array.from(new Set(matchedCNList)).sort((a, b) => b.length - a.length)

    // 如果没有需要翻译的中文内容，则直接返回原数据
    if (!matchedCNList.length) return data

    // 步骤3: 分块处理需要翻译的列表
    const chunks: string[][] = []
    for (let i = 0; i < matchedCNList.length; i += chunkSize) {
      chunks.push(matchedCNList.slice(i, i + chunkSize))
    }

    let resultData: Record<string, string> | null = {}
    try {
      // 步骤4: 并行发起翻译请求
      const chunkRequests = chunks.map((chunk, chunkIndex) => {
        const matchedCNObj: Record<string, string> = {}
        chunk.forEach((item, itemIndex) => {
          const originalIndex = chunkIndex * chunkSize + itemIndex
          matchedCNObj[`${originalIndex}$$word`] = item
        })
        return apiTranslate(matchedCNObj)
      })
      const chunkResults = await Promise.all(chunkRequests)
      resultData = chunkResults.reduce((acc, current) => ({ ...acc, ...current }), {})
    } catch (e) {
      console.error('翻译API调用失败:', e)
      resultData = null
    }

    // 步骤5: 处理翻译结果
    if (resultData) {
      let translatedList: string[]
      try {
        // 将返回的结果对象，根据key（'0$$word'）中的数字排序，生成一个有序的翻译结果数组
        translatedList = Object.keys(resultData)
          .sort((a, b) => parseInt(a.split('$$')[0]) - parseInt(b.split('$$')[0]))
          .map((key) => resultData[key])
      } catch (e) {
        console.error('处理翻译结果排序时出错:', e)
        translatedList = []
      }
      // 步骤6: 将翻译结果替换回原数据结构的深拷贝副本中
      return replaceChineseStrings(cloneDeep(data), matchedCNList, translatedList)
    }

    // 如果翻译失败，返回原始数据
    return data
  } catch (e) {
    console.error('翻译流程执行时出错:', e)
    return data
  }
}
