/**
 * 字段级过滤包装器（skip-only）
 *
 * 设计目的：
 * - 在不修改通用翻译流程 translateComplexHtmlData 的前提下，为数组/对象数据提供"按字段跳过翻译"的能力。
 * - 适用于接口返回的数据结构中，大部分字段需要翻译，但少数字段（如 ID、代码、名称等）需要保留原值。
 *
 * 行为说明：
 * - 对数组：skipFields 作用于"数组每个元素"的一级字段键；数组元素为原始类型时不生效。
 *          allowFields 作用于"数组每个元素"的一级字段键；数组元素为原始类型时不生效。
 *          当 allowFields 和 skipFields 同时存在时，以 allowFields 为准。
 * - 对对象：skipFields 作用于该对象的一级字段键。
 * - 深层字段：当前不处理深层路径（如 a.b.c），如有需要可在后续版本扩展。
 * - 合并策略：只将"被允许翻译"的字段位点替换为译文，其余字段保持原样，确保业务逻辑不受影响。
 */
import { translateDataRecursively } from './core'
import type { TranslateFlowWithFilterOptions, TranslateResult } from './types'

/**
 * 翻译接口类型：输入 { 原文键: 原文字符串 }，返回 { 原文键: 译文字符串 }。
 */
type TranslateApi = (params: Record<string, string>) => Promise<Record<string, string>>

/**
 * 判断是否为普通对象（非 null、非数组）。
 */
const isPlainObject = (val: unknown): val is Record<string, unknown> =>
  typeof val === 'object' && val !== null && !Array.isArray(val)

/**
 * 根据过滤条件计算允许翻译的键集合。
 * @param keys - 当前对象的所有一级键
 * @param skipFields - 跳过翻译的键集合
 * @param allowFields - 允许翻译的键集合（优先级高于 skipFields）
 * @returns 允许翻译的键集合
 */
const getTranslatableKeys = (keys: string[], skipFields?: string[], allowFields?: string[]): string[] => {
  if (allowFields && allowFields.length) return keys.filter((k) => allowFields.includes(k))
  if (skipFields && skipFields.length) return keys.filter((k) => !skipFields.includes(k))
  return keys
}

/**
 * 基于过滤条件提取需要翻译的字段数据。
 * - 这样可以避免通用翻译流程误处理不应翻译的键。
 * - 对原始类型（字符串/数字/布尔等）直接返回，不做处理。
 *
 * @param value - 原始输入数据（数组/对象/原始类型）
 * @param skipFields - 跳过翻译的一级字段
 * @param allowFields - 允许翻译的一级字段（优先级高于 skipFields）
 * @returns 只保留允许翻译字段的数据
 */
function filterFieldsForTranslation<T>(value: T, skipFields?: string[], allowFields?: string[]): T {
  if (Array.isArray(value)) {
    // 对数组逐项提取字段
    return value.map((item) => filterFieldsForTranslation(item, skipFields, allowFields)) as T
  }
  if (isPlainObject(value)) {
    // 对对象仅保留允许翻译的一层键
    const keys = Object.keys(value as object)
    const allowed = getTranslatableKeys(keys, skipFields, allowFields)

    // 若无字段被允许，返回空对象以避免误翻译
    const projected = {} as Record<string, unknown>
    allowed.forEach((k) => {
      projected[k] = (value as Record<string, unknown>)[k]
    })

    // 这里的类型转换是必要的，因为 projected 的结构可能与 T 不完全匹配
    return projected as T
  }
  // 原始类型：无法按字段控制，直接返回原值（后续流程会基于字符检测决定是否翻译）
  return value
}

/**
 * 将翻译后的字段数据合并回原数据，仅替换允许字段位点。
 * - 对象：只覆盖出现在翻译数据中的键；
 * - 数组：对齐索引逐项合并；
 * - 嵌套对象/数组：递归合并，其他位点保持原值。
 *
 * @param original - 原始输入数据
 * @param translatedData - 对应的已翻译字段数据
 * @param allowFields - 允许翻译的一级字段（用于递归传递）
 * @returns 合并后的最终数据
 */
function mergeTranslatedFields<T>(original: T, translatedData: T, allowFields?: string[]): T {
  if (Array.isArray(original) && Array.isArray(translatedData)) {
    const length = Math.min(original.length, translatedData.length)
    const result = [...original]
    for (let i = 0; i < length; i++) {
      // 这里的类型转换是必要的，因为 TypeScript 无法推断数组元素类型
      result[i] = mergeTranslatedFields(original[i], translatedData[i], allowFields)
    }
    return result as T
  }

  if (isPlainObject(original) && isPlainObject(translatedData)) {
    // 创建原始对象的浅拷贝
    const base = { ...original } as Record<string, unknown>
    const transObj = translatedData as Record<string, unknown>

    Object.keys(transObj).forEach((k) => {
      const ori = base[k]
      const trans = transObj[k]

      if (isPlainObject(ori) && isPlainObject(trans)) {
        base[k] = mergeTranslatedFields(ori, trans, allowFields)
      } else if (Array.isArray(ori) && Array.isArray(trans)) {
        base[k] = mergeTranslatedFields(ori, trans, allowFields)
      } else {
        base[k] = trans
      }
    })

    return base as T
  }

  return translatedData
}

/**
 * 按字段过滤条件翻译数据（支持 skipFields 和 allowFields）。
 * - 数组：作用于每个元素的一级字段键；原始类型元素不生效。
 * - 对象：作用于一级字段键。
 * - 未配置过滤条件时，直接走通用翻译。
 * - allowFields 优先级高于 skipFields，当两者同时存在时，以 allowFields 为准。
 *
 * 使用建议（企业详情场景）：
 * - 建议将 `ICorpTableCfg.skipTransFields` 映射到这里的 `skipFields`，以屏蔽名称/ID/代码等关键字段的通用翻译。
 * - 对于明确知道需要翻译哪些字段的场景，可使用 `allowFields` 精确控制。
 */
export async function translateDataByFields<T>(
  data: T,
  apiTranslate: TranslateApi,
  options: TranslateFlowWithFilterOptions
): Promise<TranslateResult<T>> {
  try {
    // 处理空数据情况
    if (data === null || data === undefined) {
      return {
        data,
        success: true,
        cacheStats: { hits: 0, total: 0 },
      }
    }

    const skipFields = options.skipFields
    const allowFields = options.allowFields

    // 若未配置任何过滤（skipFields 和 allowFields 都未设置），直接走通用流程
    if ((!skipFields || skipFields.length === 0) && (!allowFields || allowFields.length === 0)) {
      return translateDataRecursively(data, apiTranslate, options)
    }

    // 应用字段过滤提取需要翻译的字段
    const filteredData = filterFieldsForTranslation(data, skipFields, allowFields)

    // 翻译过滤后的数据
    const result = await translateDataRecursively(filteredData, apiTranslate, options)

    // 如果翻译失败，直接返回
    if (!result.success) {
      return {
        ...result,
        data, // 返回原始数据而不是过滤后的数据
      }
    }

    // 合并翻译结果回原始数据
    const mergedData = mergeTranslatedFields(data, result.data, allowFields)

    return {
      ...result,
      data: mergedData,
    }
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e))
    console.error('translateDataByFields error:', error)

    return {
      data,
      success: false,
      error,
      cacheStats: { hits: 0, total: 0 },
    }
  }
}
