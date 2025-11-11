import { SupportedLocale } from '@/intl'
import { cloneDeep } from 'lodash-es'
import { generateApiKey, sortApiKeys } from './apiKeyUtils'
import { globalCacheManager, type CacheManager } from './cacheManager'
import { extractTextsFromData, replaceTextsInData, type ReplaceOptions } from './htmlProcessor'
import { getDetectorByLocale, hasTranslatableContent } from './languageDetector'
import type { CacheLookupPhaseResult, TranslateApiPhaseResult, TranslateFlowOptions, TranslateResult } from './types'

/**
 * 翻译流水线阶段 1：缓存查询
 *
 * 查询缓存管理器，将文本分类为：已缓存、进行中、需要新请求三类。
 * 这是翻译流水线的第一阶段，用于最大化利用缓存避免重复请求。
 *
 * @param cacheManager - 缓存管理器实例
 * @param sourceLocale - 源语言
 * @param targetLocale - 目标语言
 * @param textList - 需要翻译的文本列表（已去重）
 * @param enableCache - 是否启用缓存，false 时所有文本都标记为需要新请求
 * @returns 缓存查询结果，包含已缓存翻译、进行中请求和需要新请求的文本
 *
 * @example
 * ```typescript
 * const result = lookupCachePhase(
 *   globalCacheManager,
 *   'zh-CN',
 *   'en-US',
 *   ['文本1', '文本2', '文本3'],
 *   true
 * )
 * // result: {
 * //   cachedTranslations: Map(1) { '文本1' => 'Text1' },
 * //   pendingTranslations: Map(1) { '文本2' => Promise },
 * //   textsNeedNewRequest: ['文本3']
 * // }
 * ```
 */
function lookupCachePhase(
  cacheManager: CacheManager,
  sourceLocale: SupportedLocale,
  targetLocale: SupportedLocale,
  textList: string[],
  enableCache: boolean
): CacheLookupPhaseResult {
  if (!enableCache) {
    return {
      cachedTranslations: new Map(),
      pendingTranslations: new Map(),
      textsNeedNewRequest: textList,
    }
  }

  const lookupResult = cacheManager.lookup(sourceLocale, targetLocale, textList)

  if (lookupResult.cached.size > 0) {
    console.log(`翻译缓存命中 ${lookupResult.cached.size}/${textList.length} 条`)
  }

  if (lookupResult.pending.size > 0) {
    console.log(`发现 ${lookupResult.pending.size} 条正在翻译中，等待结果复用`)
  }

  return {
    cachedTranslations: lookupResult.cached,
    pendingTranslations: lookupResult.pending,
    textsNeedNewRequest: lookupResult.needsRequest,
  }
}

/**
 * 翻译流水线阶段 2：API 翻译
 *
 * 将需要新请求的文本分块后调用翻译 API，并将每个请求注册到 pending 管理器。
 * 支持并发请求去重：如果多个请求同时翻译相同文本，后续请求会等待第一个请求完成。
 *
 * @param apiTranslate - 翻译 API 函数，接收 Record<string,string>，返回对应译文
 * @param cacheManager - 缓存管理器实例，用于注册 pending 请求
 * @param sourceLocale - 源语言
 * @param targetLocale - 目标语言
 * @param textsToTranslate - 需要翻译的文本列表
 * @param chunkSize - 每批翻译的文本数量
 * @returns 翻译结果，包含新翻译的文本和可能的错误
 *
 * @example
 * ```typescript
 * const result = await translateApiPhase(
 *   apiTranslate,
 *   globalCacheManager,
 *   'zh-CN',
 *   'en-US',
 *   ['文本1', '文本2', '文本3'],
 *   50
 * )
 * // result: {
 * //   newTranslations: Map(3) {
 * //     '文本1' => 'Text1',
 * //     '文本2' => 'Text2',
 * //     '文本3' => 'Text3'
 * //   },
 * //   error: undefined
 * // }
 * ```
 */
async function translateApiPhase(
  apiTranslate: (params: Record<string, string>) => Promise<Record<string, string>>,
  cacheManager: CacheManager,
  sourceLocale: SupportedLocale,
  targetLocale: SupportedLocale,
  textsToTranslate: string[],
  chunkSize: number
): Promise<TranslateApiPhaseResult> {
  if (textsToTranslate.length === 0) {
    return { newTranslations: new Map() }
  }

  try {
    // 分块准备
    const chunks: string[][] = []
    for (let i = 0; i < textsToTranslate.length; i += chunkSize) {
      chunks.push(textsToTranslate.slice(i, i + chunkSize))
    }

    // 为每个分块创建翻译 Promise，并注册到 pending manager
    const chunkPromises = chunks.map(async (chunk, chunkIndex) => {
      const payload: Record<string, string> = {}
      chunk.forEach((item, itemIndex) => {
        const originalIndex = chunkIndex * chunkSize + itemIndex
        payload[generateApiKey(originalIndex)] = item
      })

      const resultPromise = apiTranslate(payload)

      // 将这个分块中的每个文本的 Promise 注册到 pending manager
      const textPromises = new Map<string, Promise<string>>()
      chunk.forEach((text, itemIndex) => {
        const textPromise = resultPromise.then((result) => {
          const key = generateApiKey(chunkIndex * chunkSize + itemIndex)
          return result[key] || text
        })
        textPromises.set(text, textPromise)
      })
      cacheManager.registerPending(sourceLocale, targetLocale, textPromises)

      return resultPromise
    })

    const chunkResults = await Promise.all(chunkPromises)
    const resultData = chunkResults.reduce((acc, current) => ({ ...acc, ...current }), {})

    // 解析 API 返回的翻译结果
    const newTranslations = new Map<string, string>()
    const sortedKeys = sortApiKeys(Object.keys(resultData))
    sortedKeys.forEach((key, index) => {
      const originalText = textsToTranslate[index]
      const translatedText = resultData[key]
      if (originalText && translatedText) {
        newTranslations.set(originalText, translatedText)
      }
    })

    return { newTranslations }
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e))
    console.error('翻译API调用失败:', error)
    return { newTranslations: new Map(), error }
  }
}

/**
 * 翻译流水线阶段 3：等待进行中的请求
 *
 * 等待所有进行中的翻译请求完成。这些请求是由其他并发调用发起的，
 * 当前调用复用这些请求的结果以避免重复翻译。
 *
 * @param pendingTranslations - 进行中的翻译请求 Map，键为原文，值为 Promise
 * @returns 包含完成的翻译结果和可能的错误
 *
 * @example
 * ```typescript
 * const pending = new Map([
 *   ['文本1', Promise.resolve('Text1')],
 *   ['文本2', Promise.resolve('Text2')]
 * ])
 *
 * const result = await waitPendingPhase(pending)
 * // result: {
 * //   translations: Map(2) {
 * //     '文本1' => 'Text1',
 * //     '文本2' => 'Text2'
 * //   },
 * //   error: undefined
 * // }
 * ```
 */
async function waitPendingPhase(
  pendingTranslations: Map<string, Promise<string>>
): Promise<{ translations: Map<string, string>; error?: Error }> {
  if (pendingTranslations.size === 0) {
    return { translations: new Map() }
  }

  const translations = new Map<string, string>()
  let error: Error | undefined

  const pendingResults = await Promise.allSettled(
    Array.from(pendingTranslations.entries()).map(async ([text, promise]) => ({
      text,
      result: await promise,
    }))
  )

  pendingResults.forEach((result) => {
    if (result.status === 'fulfilled') {
      translations.set(result.value.text, result.value.result)
    } else {
      console.error('等待进行中的翻译请求失败:', result.reason)
      // 记录错误，如果之前没有错误，则设置此错误
      if (!error) {
        error = result.reason instanceof Error ? result.reason : new Error(String(result.reason))
      }
    }
  })

  return { translations, error }
}

/**
 * 翻译流水线阶段 4：合并翻译结果
 *
 * 将缓存命中的翻译和新请求得到的翻译合并，生成与原始文本列表顺序一致的翻译结果。
 * 如果某个文本没有翻译结果，则保留原文。
 *
 * @param matchedList - 原始文本列表（已去重并按长度降序排列）
 * @param cachedTranslations - 从缓存获取的翻译
 * @param newTranslations - 从 API 和 pending 请求获取的新翻译
 * @returns 合并后的翻译列表，与 matchedList 顺序和长度一致
 *
 * @example
 * ```typescript
 * const merged = mergeResultsPhase(
 *   ['文本1', '文本2', '文本3'],
 *   new Map([['文本1', 'Text1']]),
 *   new Map([['文本2', 'Text2']])
 * )
 * // merged: ['Text1', 'Text2', '文本3'] // 文本3 未翻译，保留原文
 * ```
 */
function mergeResultsPhase(
  matchedList: string[],
  cachedTranslations: Map<string, string>,
  newTranslations: Map<string, string>
): string[] {
  const allTranslations = new Map([...cachedTranslations, ...newTranslations])
  return matchedList.map((text) => allTranslations.get(text) || text)
}

/**
 * 递归翻译复杂数据结构
 *
 * 这是翻译模块的核心函数，支持翻译包含 HTML 字符串、嵌套对象、数组等复杂结构的数据。
 * 主要特性：
 * - 智能提取和替换：自动识别 HTML 标签，只翻译文本内容
 * - 缓存与去重：避免重复翻译相同文本，支持并发请求去重
 * - 分块处理：大量文本自动分块请求，避免单次请求过大
 * - 错误兜底：翻译失败时返回原始数据，不中断业务流程
 *
 * @param data - 需要翻译的原始数据，支持任意类型
 * @param apiTranslate - 翻译 API 函数，接收 Record<string,string>，返回对应译文
 * @param options - 翻译流程配置
 * @param options.sourceLocale - 源语言
 * @param options.targetLocale - 目标语言
 * @param options.textFilter - 可选的文本过滤器，返回 true 表示需要翻译
 * @param options.chunkSize - 每批翻译的文本数量，默认 50
 * @param options.enableCache - 是否启用缓存，默认 true
 * @returns 翻译结果对象，包含翻译后的数据、成功状态、错误信息和缓存统计
 *
 * @example
 * ```typescript
 * const data = {
 *   name: '测试公司',
 *   description: '<div>公司简介</div>',
 *   tags: ['标签1', '标签2']
 * }
 *
 * const result = await translateDataRecursively(
 *   data,
 *   async (params) => {
 *     // 调用翻译 API
 *     return translateApi(params)
 *   },
 *   {
 *     sourceLocale: 'zh-CN',
 *     targetLocale: 'en-US',
 *     enableCache: true
 *   }
 * )
 *
 * if (result.success) {
 *   console.log(result.data) // 翻译后的数据
 *   console.log(result.cacheStats) // { hits: 2, total: 5 }
 * } else {
 *   console.error(result.error)
 *   console.log(result.data) // 返回原始数据
 * }
 * ```
 */
export async function translateDataRecursively<T>(
  data: T,
  apiTranslate: (params: Record<string, string>) => Promise<Record<string, string>>,
  options: TranslateFlowOptions
): Promise<TranslateResult<T>> {
  try {
    if (!data) {
      return {
        data,
        success: true,
        cacheStats: { hits: 0, total: 0 },
      }
    }

    // 准备参数
    const targetLangDetector = getDetectorByLocale(options.targetLocale)
    const needsTranslation =
      options.textFilter || ((text: string) => hasTranslatableContent(text) && !targetLangDetector(text))
    const replaceOptions: ReplaceOptions = { shouldProcessNodeText: needsTranslation }
    const chunkSize = options.chunkSize ?? 50
    const enableCache = options.enableCache !== false
    const sourceLocale = options.sourceLocale

    // 阶段1: 提取需要翻译的文本
    const matchedList = extractTextsFromData(data, needsTranslation)

    if (matchedList.length === 0) {
      return {
        data,
        success: true,
        cacheStats: { hits: 0, total: 0 },
      }
    }

    // 阶段2: 缓存查询
    const cacheResult = lookupCachePhase(
      globalCacheManager,
      sourceLocale,
      options.targetLocale,
      matchedList,
      enableCache
    )

    // 阶段3: API 翻译（仅对需要新请求的文本）
    const apiResult = await translateApiPhase(
      apiTranslate,
      globalCacheManager,
      sourceLocale,
      options.targetLocale,
      cacheResult.textsNeedNewRequest,
      chunkSize
    )

    // 阶段4: 等待进行中的请求
    const pendingResult = await waitPendingPhase(cacheResult.pendingTranslations)

    // 检查是否有错误
    const error = apiResult.error || pendingResult.error
    if (error) {
      return {
        data,
        success: false,
        error,
        cacheStats: {
          hits: cacheResult.cachedTranslations.size,
          total: matchedList.length,
        },
      }
    }

    // 阶段5: 合并新翻译和 pending 翻译
    const allNewTranslations = new Map([...apiResult.newTranslations, ...pendingResult.translations])

    // 更新缓存
    if (enableCache && allNewTranslations.size > 0) {
      globalCacheManager.store(sourceLocale, options.targetLocale, allNewTranslations)
    }

    // 阶段6: 合并所有翻译结果
    const translatedList = mergeResultsPhase(matchedList, cacheResult.cachedTranslations, allNewTranslations)

    // 阶段7: 替换数据中的文本
    const translatedData = replaceTextsInData(cloneDeep(data), matchedList, translatedList, replaceOptions)

    return {
      data: translatedData,
      success: true,
      cacheStats: {
        hits: cacheResult.cachedTranslations.size,
        total: matchedList.length,
      },
    }
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e))
    console.error('翻译流程执行时出错:', error)

    return {
      data,
      success: false,
      error,
      cacheStats: { hits: 0, total: 0 },
    }
  }
}
