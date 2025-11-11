import { myWfcAjax } from '@/api/common.ts'
import { TranslatePayload, TranslateResponse } from 'gel-api/*'
import { isEn } from 'gel-util/intl'
import { translateDataWithApi, TranslateServiceOptions, type TranslateResult } from 'gel-util/misc'
import { wftCommon } from '../utils.tsx'

/**
 * 翻译包含复杂 HTML 结构的数据，返回完整的翻译结果。
 *
 * @param data - 需要翻译的数据，支持嵌套对象、数组、HTML 字符串等
 * @param options - 翻译配置选项，必须指定 sourceLocale 和 targetLocale
 * @returns 完整的翻译结果，包含数据、成功状态、错误信息和缓存统计
 *
 * @example
 * ```typescript
 * // 中文到英文
 * const result = await translateData(tableData, {
 *   sourceLocale: 'zh-CN',
 *   targetLocale: 'en-US',
 *   skipFields: ['id', 'code'],
 *   chunkSize: 50,
 * })
 *
 * if (result.success) {
 *   console.log('翻译成功，缓存命中率:', result.cacheStats)
 *   return result.data
 * } else {
 *   console.error('翻译失败:', result.error)
 *   return result.data // 失败时返回原始数据
 * }
 * ```
 */
export async function translateData<T>(data: T, options: TranslateServiceOptions): Promise<TranslateResult<T>> {
  try {
    // 空数据直接返回
    if (!data) {
      return {
        data,
        success: true,
        cacheStats: { hits: 0, total: 0 },
      }
    }

    wftCommon.addLoadTask(data)

    const result = await translateDataWithApi(
      data,
      (payload, params) => myWfcAjax<TranslateResponse, TranslatePayload>(params.cmd, payload),
      options
    )

    return result
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e))
    console.error('翻译数据时出错:', error)

    return {
      data,
      success: false,
      error,
      cacheStats: { hits: 0, total: 0 },
    }
  } finally {
    wftCommon.removeLoadTask(data)
  }
}

/**
 * 将中文数据翻译为英文（仅在英文环境下执行），返回完整的翻译结果。
 * 这是 translateData 的便捷封装，适用于大多数业务场景。
 *
 * @param data - 需要翻译的数据，支持嵌套对象、数组、HTML 字符串等
 * @param options - 翻译配置选项（不需要指定 sourceLocale 和 targetLocale）
 * @returns 完整的翻译结果，包含数据、成功状态、错误信息和缓存统计
 *
 * @example
 * ```typescript
 * const result = await translateToEnglish(tableData, {
 *   skipFields: ['id', 'code'],
 *   chunkSize: 50,
 * })
 *
 * if (result.success) {
 *   console.log(`翻译成功，缓存命中: ${result.cacheStats.hits}/${result.cacheStats.total}`)
 *   setTableData(result.data)
 * } else {
 *   console.error('翻译失败:', result.error)
 *   setTableData(result.data) // 使用原始数据
 * }
 * ```
 */
export async function translateToEnglish<T>(
  data: T,
  options?: Omit<TranslateServiceOptions, 'sourceLocale' | 'targetLocale'>
): Promise<TranslateResult<T>> {
  // 非英文环境或空数据，直接返回
  if (!data || !isEn()) {
    return {
      data,
      success: true,
      cacheStats: { hits: 0, total: 0 },
    }
  }

  return translateData(data, {
    sourceLocale: 'zh-CN',
    targetLocale: 'en-US',
    chunkSize: 100,
    ...(options || {}),
  })
}

/**
 * @deprecated 请使用 translateToEnglish 或 translateData 替代，该函数会吞掉翻译结果信息
 * @param data - 需要翻译的数据
 * @param options - 翻译配置选项
 * @returns 翻译后的数据（失败时返回原始数据）
 */
export async function translateComplexHtmlData<T>(data: T, options?: TranslateServiceOptions): Promise<T> {
  try {
    if (!data || !isEn()) return data
    wftCommon.addLoadTask(data)
    const result = await translateDataWithApi(
      data,
      (payload, params) => myWfcAjax<TranslateResponse, TranslatePayload>(params.cmd, payload),
      {
        targetLocale: 'en-US',
        sourceLocale: 'zh-CN',
        chunkSize: 100,
        ...(options || {}),
      }
    )
    return result.data
  } catch (e) {
    console.error(e)
    return data
  } finally {
    wftCommon.removeLoadTask(data)
  }
}
