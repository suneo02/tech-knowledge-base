const HTML_TAG_REGEX = /<\/?[a-z][\s\S]*>/i
const HTML_TAG_OR_CONTENT_REGEX = /<[^>]+>|[^<]+/g

import type { TextDetector } from './languageDetector'

/**
 * 解析并处理 HTML 字符串中的文本节点
 *
 * 此函数使用 DOMParser 解析 HTML，遍历所有文本节点并应用处理器函数。
 * 会自动跳过 script 和 style 标签内的内容。如果输入不是有效的 HTML，
 * 则返回 undefined 供调用方降级处理。
 *
 * @param htmlStr - 输入的字符串，可能包含 HTML 标签
 * @param textNodeProcessor - 用于处理每个文本节点的回调函数
 * @returns 如果成功解析为 HTML，返回处理后的 innerHTML；否则返回 undefined
 *
 * @example
 * ```typescript
 * const result = processHtmlTextNodes(
 *   '<div>你好<span>世界</span></div>',
 *   (node) => {
 *     if (node.textContent) {
 *       node.textContent = node.textContent.toUpperCase()
 *     }
 *   }
 * )
 * // result: '<div>你好<span>世界</span></div>' with uppercase text
 * ```
 */
export const processHtmlTextNodes = (htmlStr: string, textNodeProcessor: (node: Node) => void): string | undefined => {
  // 启发式检查：如果字符串看起来不像 HTML，则不进行处理。
  if (!HTML_TAG_REGEX.test(htmlStr)) {
    return undefined
  }

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlStr, 'text/html')

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        textNodeProcessor(node)
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = (node as Element).tagName.toLowerCase()
        if (tagName === 'script' || tagName === 'style') {
          return
        }
        node.childNodes.forEach(walk)
      }
    }

    walk(doc.body)
    return doc.body.innerHTML
  } catch (e) {
    // 在 DOMParser 失败时，返回 undefined 以允许进行降级处理。
    return undefined
  }
}

/**
 * 使用正则表达式从一个可能包含HTML的字符串中提取可翻译的文本部分。
 * 这是一个降级方案，当DOM解析不可用或失败时使用。
 * @param str - 输入字符串。
 * @param detector - 文本检测器，返回 true 表示该文本需要翻译。
 * @returns - 包含提取出的可翻译文本部分的数组。
 */
const extractByRegex = (str: string, detector: TextDetector): string[] => {
  const translatableParts: string[] = []
  // 正则表达式匹配HTML标签或非标签内容
  const parts = str.match(HTML_TAG_OR_CONTENT_REGEX) || []
  parts.forEach((part) => {
    // 检查是否为非标签内容且符合检测条件
    if (!part.startsWith('<') && detector(part)) {
      if (part.trim()) {
        translatableParts.push(part)
      }
    }
  })
  return translatableParts
}

/**
 * 从一个可能包含 HTML 的字符串中提取所有需要翻译的文本片段。
 * 此函数通过将字符串解析为 DOM 树来智能处理 HTML 标签。
 * @param str - 输入字符串。
 * @param detector - 必选，自定义检测器；返回 true 表示该文本需要翻译。
 * @returns - 一个包含所有需要翻译的文本片段的数组。
 */
export const extractTranslatableStrings = (str: string, detector: TextDetector): string[] => {
  // 如果字符串本身不包含可翻译内容，且不是 HTML，则直接返回空数组。
  if (!HTML_TAG_REGEX.test(str) && !detector(str)) {
    return []
  }

  const translatableParts: string[] = []
  const processedResult = processHtmlTextNodes(str, (node) => {
    if (node.textContent && detector(node.textContent)) {
      const trimmedText = node.textContent.trim()
      if (trimmedText) {
        translatableParts.push(trimmedText)
      }
    }
  })

  // 如果 processHtmlTextNodes 返回 undefined，意味着它被当作纯文本或处理失败。
  if (processedResult === undefined) {
    // 纯文本情况或处理失败时的降级处理
    if (!HTML_TAG_REGEX.test(str)) {
      const trimmedText = str.trim()
      if (trimmedText) {
        translatableParts.push(trimmedText)
      }
    } else {
      // 降级：使用正则表达式匹配
      translatableParts.push(...extractByRegex(str, detector))
    }
  }

  return translatableParts
}

const REGEX_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g

/**
 * 转义在正则表达式中具有特殊含义的字符。
 *
 * 当需要将一个普通字符串用作正则表达式的一部分来精确匹配该字符串时，这个函数非常有用。
 * 如果不进行转义，字符串中的特殊字符（如 `.`、`*`、`+`）会被正则表达式引擎解释为特殊指令，
 * 而不是作为普通字符进行匹配，这可能导致非预期的行为。
 *
 * @param str - 需要转义的原始字符串。
 * @returns - 一个新的字符串，其中所有正则表达式的特殊字符都已被转义，可以安全地用于 `new RegExp()`。
 */
export function escapeRegExp(str: string) {
  // $& 表示整个被匹配的字符串，所以 `\\$&` 的效果是在每个特殊字符前加上一个反斜杠。
  return str.replace(REGEX_SPECIAL_CHARS, '\\$&')
}

/**
 * 递归遍历对象或数组，提取其中所有包含需要翻译的文本片段。
 * @param value - 要遍历的数据，可以是任何类型。
 * @param matchedList - 用于收集提取到的字符串的数组。
 * @param detector - 文本检测器：返回 true 表示该文本需要翻译。
 */
function extractTranslatableTextsRecursively<T>(value: T, matchedList: string[], detector: TextDetector): void {
  try {
    if (typeof value === 'string') {
      const parts = extractTranslatableStrings(value, detector)
      if (parts.length > 0) {
        matchedList.push(...parts)
      }
    } else if (Array.isArray(value)) {
      value.forEach((item) => extractTranslatableTextsRecursively(item, matchedList, detector))
    } else if (typeof value === 'object' && value !== null) {
      Object.values(value).forEach((item) => extractTranslatableTextsRecursively(item, matchedList, detector))
    }
  } catch (e) {
    console.error('提取可翻译字符串时出错:', e)
  }
}

/**
 * 从数据结构中提取所有需要翻译的文本
 * @param data - 要处理的数据
 * @param detector - 文本检测器：返回 true 表示该文本需要翻译
 * @returns 去重并按长度降序排列的文本列表
 */
export function extractTextsFromData<T>(data: T, detector: TextDetector): string[] {
  const matchedList: string[] = []
  extractTranslatableTextsRecursively(data, matchedList, detector)

  // 去重 + 按长度降序排序（避免子串替换问题）
  return Array.from(new Set(matchedList)).sort((a, b) => b.length - a.length)
}

/**
 * 递归替换数据结构中的文本为对应的翻译文本。
 * @param value - 要处理的数据。
 * @param originalList - 原始文本列表，按长度降序排列。
 * @param translatedList - 与原始文本列表顺序一致的翻译结果列表。
 * @param replaceOptions - 替换阶段控制哪些文本节点需要处理。
 * @returns - 返回替换后的数据。
 */
function replaceTextsRecursively<T>(
  value: T,
  originalList: string[],
  translatedList: string[],
  replaceOptions: ReplaceOptions
): T {
  try {
    if (typeof value === 'string') {
      return replaceStringsInText(value, originalList, translatedList, replaceOptions) as T
    } else if (Array.isArray(value)) {
      return value.map((item) => replaceTextsRecursively(item, originalList, translatedList, replaceOptions)) as T
    } else if (typeof value === 'object' && value !== null) {
      const newValue = { ...value } as Record<string, unknown>
      Object.keys(newValue).forEach((key) => {
        newValue[key] = replaceTextsRecursively(newValue[key], originalList, translatedList, replaceOptions)
      })
      return newValue as T
    }
    return value
  } catch (e) {
    console.error('替换字符串时出错:', e, value)
    return value
  }
}

/**
 * 在数据结构中替换文本为翻译结果
 * @param data - 要处理的数据
 * @param originalList - 原始文本列表，按长度降序排列
 * @param translatedList - 与原始文本列表顺序一致的翻译结果列表
 * @param replaceOptions - 替换阶段控制哪些文本节点需要处理
 * @returns 替换后的数据
 */
export function replaceTextsInData<T>(
  data: T,
  originalList: string[],
  translatedList: string[],
  replaceOptions: ReplaceOptions
): T {
  return replaceTextsRecursively(data, originalList, translatedList, replaceOptions)
}

export interface ReplaceOptions {
  /** 必选：判断某个文本节点是否需要处理（与提取阶段保持一致） */
  shouldProcessNodeText: TextDetector
}

/**
 * 在字符串中智能替换文本，支持 HTML 内容
 *
 * 此函数可以安全地在 HTML 字符串中替换文本，不会破坏标签结构。
 * 对于纯文本则直接进行替换。建议将 originalStrings 按长度降序排列以避免子串替换问题。
 *
 * @param value - 需要处理的输入字符串，可能包含 HTML
 * @param originalStrings - 需要被替换的原始字符串数组（建议按长度降序排列）
 * @param translatedStrings - 与原始字符串数组对应的翻译结果数组
 * @param options - 控制哪些文本节点需要处理的选项
 * @returns 完成替换后的字符串
 *
 * @example
 * ```typescript
 * // 纯文本替换
 * replaceStringsInText(
 *   '你好世界',
 *   ['你好', '世界'],
 *   ['Hello', 'World'],
 *   { shouldProcessNodeText: () => true }
 * )
 * // 返回: 'HelloWorld'
 *
 * // HTML 内容替换
 * replaceStringsInText(
 *   '<div>你好<span>世界</span></div>',
 *   ['你好', '世界'],
 *   ['Hello', 'World'],
 *   { shouldProcessNodeText: () => true }
 * )
 * // 返回: '<div>Hello<span>World</span></div>'
 * ```
 */
export const replaceStringsInText = (
  value: string,
  originalStrings: string[],
  translatedStrings: string[],
  options: ReplaceOptions
): string => {
  const shouldProcess = options.shouldProcessNodeText

  const processedResult = processHtmlTextNodes(value, (node) => {
    if (node.textContent && shouldProcess(node.textContent)) {
      let newTextContent = node.textContent
      originalStrings.forEach((chinese, idx) => {
        const translated = translatedStrings[idx]
        if (translated) {
          newTextContent = newTextContent.replace(new RegExp(escapeRegExp(chinese), 'g'), translated)
        }
      })
      node.textContent = newTextContent
    }
  })

  if (processedResult !== undefined) {
    return processedResult
  }

  // 对纯文本或DOM解析失败情况的降级处理
  let strValue = value
  originalStrings.forEach((chinese, idx) => {
    const translated = translatedStrings[idx]
    if (translated) {
      strValue = strValue.replace(new RegExp(escapeRegExp(chinese), 'g'), translated)
    }
  })
  return strValue
}
