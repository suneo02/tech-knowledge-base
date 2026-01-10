/**
 * 翻译服务，对接 wind secure 的 apitranslates 接口
 * @param data 需要翻译的数据
 * @param apiTranslateServide 翻译接口
 * @param options 配置对象，包含语言与检测策略
 * @returns 翻译后的数据
 */

import type { SupportedLocale } from '@/intl/type'
import type { ApiResponseForWFC, TranslateParams, TranslatePayload, TranslateResponse } from 'gel-api'
import { translateDataByFields } from './fieldFilter'
import { TranslateFlowWithFilterOptions, TranslateResult } from './types'

export type TranslateServiceOptions = TranslateFlowWithFilterOptions

export const localeToLangCode = (locale: SupportedLocale): 1 | 2 => {
  if (locale === 'zh-CN') return 1
  if (locale === 'en-US') return 2
  return 1
}

export async function translateDataWithApi<T>(
  data: T,
  apiTranslateServide: (
    data: TranslatePayload,
    params: TranslateParams
  ) => Promise<ApiResponseForWFC<TranslateResponse>>,
  options: TranslateServiceOptions
): Promise<TranslateResult<T>> {
  const defaultOptions: Required<Pick<TranslateServiceOptions, 'chunkSize' | 'enableCache'>> = {
    chunkSize: 50,
    enableCache: true, // 默认启用缓存
  }

  const merged = { ...defaultOptions, ...(options || {}) }

  /**
   * 调用原始翻译API，不进行业务数据结构处理
   * @param translateParams 翻译参数
   * @returns 翻译结果
   */
  const callTranslateApi = async (translateParams: Record<string, string>) => {
    try {
      const res = await apiTranslateServide(
        {
          transText: JSON.stringify(translateParams),
          sourceLang: localeToLangCode(merged.sourceLocale),
          targetLang: localeToLangCode(merged.targetLocale),
          source: 'gel',
        },
        {
          cmd: 'apitranslates',
          s: Math.random().toString(),
        }
      )
      if (res.Data && 'translateResult' in res.Data) {
        const translateResult = res.Data.translateResult
        return translateResult
      } else {
        return {}
      }
    } catch (e) {
      console.error(e)
      return {}
    }
  }

  return await translateDataByFields(data, callTranslateApi, {
    sourceLocale: merged.sourceLocale,
    textFilter: merged.textFilter,
    chunkSize: merged.chunkSize,
    skipFields: merged.skipFields,
    allowFields: merged.allowFields,
    targetLocale: merged.targetLocale,
    enableCache: merged.enableCache,
  })
}
