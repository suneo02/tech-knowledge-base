import { extractTranslatableStrings, replaceStringsInText } from './stringUtils'

export const cloneDeep = (value: any) => {
  try {
    return JSON.parse(JSON.stringify(value))
  } catch (e) {
    console.error('cloneDeep 失败:', e)
    return value
  }
}

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
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          extractCNStrings(value[key], matchedCNList)
        }
      }
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
      for (const key in newValue) {
        if (newValue.hasOwnProperty(key)) {
          newValue[key] = replaceChineseStrings(newValue[key], matchedCNList, translatedList)
        }
      }
      return newValue
    }
    return value
  } catch (e) {
    console.error(['替换中文字符串时出错:', e, value].map((item) => JSON.stringify(item)).join('\t'))
    return value
  }
}

/**
 * 提取并准备待翻译的中文字符串
 * @param data - 需要处理的原始数据
 * @returns 去重并按长度降序排列的中文字符串数组
 */
const extractAndPrepareStrings = (data: any): string[] => {
  const matchedCNList: string[] = []
  extractCNStrings(data, matchedCNList)

  // 去重并按长度降序排序
  // 降序排序是为了优先替换较长的字符串，避免因替换子字符串而导致长字符串匹配失效
  const uniqueList: string[] = []
  for (let i = 0; i < matchedCNList.length; i++) {
    const item = matchedCNList[i]
    if (uniqueList.indexOf(item) === -1) {
      uniqueList.push(item)
    }
  }
  return uniqueList.sort((a, b) => b.length - a.length)
}

/**
 * 将字符串数组分块处理
 * @param strings - 待翻译的字符串数组
 * @param chunkSize - 分块大小
 * @returns 分块后的二维数组
 */
const createTranslationChunks = (strings: string[], chunkSize: number): string[][] => {
  const chunks: string[][] = []
  for (let i = 0; i < strings.length; i += chunkSize) {
    chunks.push(strings.slice(i, i + chunkSize))
  }
  return chunks
}

/**
 * 为单个分块创建翻译参数对象
 * @param chunk - 当前分块的字符串数组
 * @param chunkIndex - 分块索引
 * @param chunkSize - 分块大小
 * @returns 翻译参数对象
 */
const createChunkTranslationParams = (
  chunk: string[],
  chunkIndex: number,
  chunkSize: number
): Record<string, string> => {
  const matchedCNObj: Record<string, string> = {}
  chunk.forEach((item, itemIndex) => {
    const originalIndex = chunkIndex * chunkSize + itemIndex
    matchedCNObj[`${originalIndex}$$word`] = item
  })
  return matchedCNObj
}

/**
 * 处理翻译结果，将结果对象转换为有序的翻译数组
 * @param chunkResults - 所有分块的翻译结果
 * @returns 有序的翻译结果数组
 */
const processTranslationResults = (chunkResults: (Record<string, string> | null)[]): string[] => {
  // 合并所有翻译结果
  const resultData = chunkResults.reduce(
    (acc, current) => {
      if (current === null) {
        throw new Error('翻译API调用失败')
      }
      return { ...acc, ...current }
    },
    {} as Record<string, string>
  )

  // 将返回的结果对象，根据key（'0$$word'）中的数字排序，生成一个有序的翻译结果数组
  const keys: string[] = []
  for (const key in resultData) {
    if (resultData.hasOwnProperty(key)) {
      keys.push(key)
    }
  }

  return keys.sort((a, b) => parseInt(a.split('$$')[0]) - parseInt(b.split('$$')[0])).map((key) => resultData[key])
}

/**
 * 处理单个分块的翻译
 * @param chunk - 当前分块
 * @param chunkIndex - 分块索引
 * @param chunkSize - 分块大小
 * @param apiTranslate - 翻译API函数
 * @param onChunkComplete - 分块完成回调
 */
const handleChunkTranslation = (
  chunk: string[],
  chunkIndex: number,
  chunkSize: number,
  apiTranslate: (params: Record<string, string>, callback: (result: Record<string, string> | null) => void) => void,
  onChunkComplete: (chunkIndex: number, result: Record<string, string> | null) => void
) => {
  const translationParams = createChunkTranslationParams(chunk, chunkIndex, chunkSize)

  apiTranslate(translationParams, (result) => {
    onChunkComplete(chunkIndex, result)
  })
}

/**
 * 对包含复杂数据结构（如 HTML 字符串、对象、数组）的数据进行智能翻译。
 * 该函数会抽离出所有中文字符，调用外部翻译 API，然后将翻译结果替换回原数据结构。
 * @param data - 需要翻译的原始数据。
 * @param apiTranslate - 一个外部翻译函数，接收一个 Record<string, string> 对象和一个回调函数。
 * @param callback - 翻译完成后的回调函数，接收翻译后的数据。
 * @param chunkSize - 分块大小，默认为20。
 */
export const translateComplexHtmlData = (
  data: any,
  apiTranslate: (params: Record<string, string>, callback: (result: Record<string, string> | null) => void) => void,
  callback: (result: any) => void,
  chunkSize = 20
) => {
  try {
    // 如果没有数据，直接返回原数据
    if (!data) {
      callback(data)
      return
    }

    // 步骤1: 提取并准备待翻译的字符串
    const matchedCNList = extractAndPrepareStrings(data)

    // 如果没有需要翻译的中文内容，则直接返回原数据
    if (!matchedCNList.length) {
      callback(data)
      return
    }

    // 步骤2: 创建翻译分块
    const chunks = createTranslationChunks(matchedCNList, chunkSize)

    // 步骤3: 并行处理翻译请求
    let completedChunks = 0
    const chunkResults: (Record<string, string> | null)[] = new Array(chunks.length)
    let hasError = false

    const onChunkComplete = (chunkIndex: number, result: Record<string, string> | null) => {
      if (hasError) return // 如果已经有错误，忽略后续结果

      chunkResults[chunkIndex] = result
      completedChunks++

      // 检查是否所有块都已完成
      if (completedChunks === chunks.length) {
        try {
          // 步骤4: 处理翻译结果
          const translatedList = processTranslationResults(chunkResults)

          // 步骤5: 将翻译结果替换回原数据结构
          const translatedData = replaceChineseStrings(cloneDeep(data), matchedCNList, translatedList)
          callback(translatedData)
        } catch (e) {
          console.error('处理翻译结果时出错:', e)
          hasError = true
          callback(data) // 如果处理失败，返回原始数据
        }
      }
    }

    // 发起所有分块的翻译请求
    chunks.forEach((chunk, chunkIndex) => {
      handleChunkTranslation(chunk, chunkIndex, chunkSize, apiTranslate, onChunkComplete)
    })
  } catch (e) {
    console.error('翻译流程执行时出错:' + JSON.stringify(e))
    callback(data)
  }
}
