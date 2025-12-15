import { SupportedLocale } from '@/intl'

export const CHINESE_CHAR_REGEX = /[\u4e00-\u9fff]/

export type TextDetector = (text: string) => boolean

const ENGLISH_LETTER_REGEX = /[A-Za-z]/

/**
 * 检测文本是否包含可翻译内容（即是否包含实际的语言文字）
 * 
 * 此函数用于过滤不需要翻译的内容，排除纯数字、纯符号、空白等。
 * 只有包含中文字符或英文字母的文本才被认为是可翻译的。
 *
 * @param text - 待检测的文本
 * @returns true 表示包含可翻译内容（中文或英文字母），false 表示不可翻译
 *
 * @example
 * ```typescript
 * hasTranslatableContent("Hello") // true - 包含英文
 * hasTranslatableContent("你好") // true - 包含中文
 * hasTranslatableContent("User123") // true - 包含英文字母
 * hasTranslatableContent("123") // false - 纯数字
 * hasTranslatableContent("$%^&") // false - 纯符号
 * hasTranslatableContent("  ") // false - 空白
 * hasTranslatableContent("$100") // false - 数字加符号但无文字
 * ```
 */
export const hasTranslatableContent: TextDetector = (text: string) => {
  const trimmed = text.trim()
  if (!trimmed) return false

  // 包含中文字符或英文字母即认为有可翻译内容
  return CHINESE_CHAR_REGEX.test(trimmed) || ENGLISH_LETTER_REGEX.test(trimmed)
}

export const detectChinese: TextDetector = (text: string) => CHINESE_CHAR_REGEX.test(text)

/**
 * 检测是否为英文文本
 * 判断条件：
 * 1. 不包含中文字符（必要条件）
 * 2. 包含英文字母（必要条件）
 *
 * 这样可以正确识别包含数字、特殊字符的英文名，如：
 * - "John123" -> true
 * - "Mary-Jane" -> true
 * - "123" -> false (没有英文字母)
 * - "张三" -> false (包含中文字符)
 * - "John张三" -> false (包含中文字符)
 */
export const detectEnglish: TextDetector = (text: string) =>
  !CHINESE_CHAR_REGEX.test(text) && ENGLISH_LETTER_REGEX.test(text)

/**
 * 根据语言环境获取对应的文本检测器
 * 
 * 根据目标语言返回相应的检测函数，用于判断文本是否已经是目标语言。
 * 这在翻译流程中用于跳过已经是目标语言的文本。
 *
 * @param locale - 支持的语言环境代码
 * @returns 对应语言的文本检测器函数
 *
 * @example
 * ```typescript
 * const enDetector = getDetectorByLocale('en-US')
 * enDetector('Hello') // true - 是英文
 * enDetector('你好') // false - 不是英文
 * 
 * const zhDetector = getDetectorByLocale('zh-CN')
 * zhDetector('你好') // true - 是中文
 * zhDetector('Hello') // false - 不是中文
 * ```
 */
export const getDetectorByLocale = (locale: SupportedLocale): TextDetector => {
  if (locale === 'en-US') return detectEnglish
  // 默认中文
  return detectChinese
}
