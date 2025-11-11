import type { SupportedLocale } from '@/intl'
import type { TextDetector } from './languageDetector'

/**
 * 翻译流程基础配置
 */
export interface TranslateFlowOptions {
  /** 翻译源语言 */
  sourceLocale: SupportedLocale
  /** 翻译目标语言 */
  targetLocale: SupportedLocale
  /** 文本过滤器：判断哪些文本需要翻译。返回 true 表示需要翻译，false 表示跳过 */
  textFilter?: TextDetector
  /** 翻译请求的并发分块大小，默认 50 */
  chunkSize?: number
  /** 是否启用缓存，默认 true */
  enableCache?: boolean
}

/**
 * 翻译结果包装类型
 */
export interface TranslateResult<T> {
  /** 翻译后的数据（失败时为原始数据） */
  data: T
  /** 是否翻译成功 */
  success: boolean
  /** 错误信息（成功时为 undefined） */
  error?: Error
  /** 缓存命中统计 */
  cacheStats?: {
    hits: number
    total: number
  }
}

/**
 * 字段过滤配置（支持 skipFields 和 allowFields）
 */
export interface TranslateFlowWithFilterOptions extends TranslateFlowOptions {
  /**
   * 跳过这些一级字段（denylist）。
   * - 当数组输入时，作用于"每个元素对象"的一级键；
   * - 当对象输入时，作用于该对象的一级键；
   * - 未配置或空数组时，等同于不做字段过滤。
   */
  skipFields?: string[]
  /**
   * 优先级高于 skipFields，当 allowFields 和 skipFields 同时存在时，以 allowFields 为准。
   * 允许翻译的键集合。
   * - 当数组输入时，作用于"数组每个元素"的一级字段键；数组元素为原始类型时不生效。
   * - 当对象输入时，作用于该对象的一级字段键。
   * - 未配置或空数组时，等同于不做字段过滤。
   */
  allowFields?: string[]
}

/**
 * 翻译缓存键，由源语言、目标语言和原文组成
 */
export interface TranslateCacheKey {
  sourceLocale: SupportedLocale
  targetLocale: SupportedLocale
  originalText: string
}

/**
 * 缓存查询结果
 */
export interface CacheLookupResult {
  /** 缓存命中的翻译结果 */
  cached: Map<string, string>
  /** 正在进行中的翻译请求 */
  pending: Map<string, Promise<string>>
  /** 需要新请求的文本 */
  needsRequest: string[]
}

/**
 * 缓存查询阶段的结果
 */
export interface CacheLookupPhaseResult {
  /** 缓存命中的翻译 */
  cachedTranslations: Map<string, string>
  /** 正在进行中的翻译 */
  pendingTranslations: Map<string, Promise<string>>
  /** 需要新请求的文本 */
  textsNeedNewRequest: string[]
}

/**
 * API 翻译阶段的结果
 */
export interface TranslateApiPhaseResult {
  /** 新请求得到的翻译 */
  newTranslations: Map<string, string>
  /** API 错误（如果有） */
  error?: Error
}

