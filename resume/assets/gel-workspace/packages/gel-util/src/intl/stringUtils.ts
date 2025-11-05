const HTML_TAG_REGEX = /<\/?[a-z][\s\S]*>/i
export const CHINESE_CHAR_REGEX = /[\u4e00-\u9fff]/
const HTML_TAG_OR_CONTENT_REGEX = /<[^>]+>|[^<]+/g

/**
 * 核心函数：解析一个可能包含HTML的字符串，并遍历其文本节点应用处理器。
 * @param htmlStr - 输入的字符串，可能包含 HTML。
 * @param textNodeProcessor - 一个函数，用于处理每个文本节点。
 * @returns - 如果字符串被作为HTML处理，则返回处理后的innerHTML；否则返回undefined。
 */
export const walkAndProcessTextNodes = (
  htmlStr: string,
  textNodeProcessor: (node: Node) => void
): string | undefined => {
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
 * @returns - 包含提取出的可翻译文本部分的数组。
 */
const extractTranslatableStringsWithRegex = (str: string): string[] => {
  const translatableParts: string[] = []
  // 正则表达式匹配HTML标签或非标签内容
  const parts = str.match(HTML_TAG_OR_CONTENT_REGEX) || []
  parts.forEach((part) => {
    // 检查是否为非标签内容且包含中文字符
    if (!part.startsWith('<') && CHINESE_CHAR_REGEX.test(part)) {
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
 * @returns - 一个包含所有需要翻译的文本片段的数组。
 */
export const extractTranslatableStrings = (str: string): string[] => {
  // 1. 如果字符串本身就不包含中文，直接返回空数组，这是最快的性能优化。
  if (!CHINESE_CHAR_REGEX.test(str)) {
    return []
  }

  const translatableParts: string[] = []
  const processedResult = walkAndProcessTextNodes(str, (node) => {
    if (node.textContent && CHINESE_CHAR_REGEX.test(node.textContent)) {
      if (node.textContent.trim()) {
        translatableParts.push(node.textContent)
      }
    }
  })

  // 如果 walkAndProcessTextNodes 返回 undefined，意味着它被当作纯文本或处理失败。
  if (processedResult === undefined) {
    // 纯文本情况或处理失败时的降级处理
    if (!HTML_TAG_REGEX.test(str)) {
      translatableParts.push(str)
    } else {
      // 降级：使用正则表达式匹配
      translatableParts.push(...extractTranslatableStringsWithRegex(str))
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
 *
 * @example
 * const unsafeString = 'example.com';
 * const safeString = escapeRegExp(unsafeString); // 返回 'example\\.com'
 * const regex = new RegExp(safeString); // 创建的正则表达式会精确匹配 "example.com"
 *
 * const unsafeRegex = new RegExp(unsafeString); // 创建的正则表达式会匹配 "example" + 任何字符 + "com"
 */
export function escapeRegExp(str: string) {
  // $& 表示整个被匹配的字符串，所以 `\\$&` 的效果是在每个特殊字符前加上一个反斜杠。
  return str.replace(REGEX_SPECIAL_CHARS, '\\$&')
}

/**
 * 在一个字符串中，用一组翻译后的字符串替换一组原始字符串。
 * 这个函数能智能处理HTML内容，以避免破坏标签结构。
 * @param value - 需要处理的输入字符串，可能包含HTML。
 * @param originalStrings - 需要被替换的原始字符串数组，建议按长度降序排列。
 * @param translatedStrings - 与原始字符串数组对应的翻译结果数组。
 * @returns - 完成替换后的字符串。
 */
export const replaceStringsInText = (value: string, originalStrings: string[], translatedStrings: string[]): string => {
  const translationMap = new Map(originalStrings.map((key, index) => [key, translatedStrings[index]]))

  const processedResult = walkAndProcessTextNodes(value, (node) => {
    if (node.textContent && CHINESE_CHAR_REGEX.test(node.textContent)) {
      let newTextContent = node.textContent
      originalStrings.forEach((chinese) => {
        const translated = translationMap.get(chinese)
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
  originalStrings.forEach((chinese) => {
    const translated = translationMap.get(chinese)
    if (translated) {
      strValue = strValue.replace(new RegExp(escapeRegExp(chinese), 'g'), translated)
    }
  })
  return strValue
}
