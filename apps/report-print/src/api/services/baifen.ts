import { getUrlParamCorpCode, normalizePath } from 'report-util/url'
import { baifenAigcApiPath } from '../config'
import { RequestConfig } from '../types/request'
import { request } from './base'
/**
 * 百分 aigc 内容获取
 *
 */
export const requestBaifenAigc = (path: string, options: RequestConfig<Record<string, any>, string>): void => {
  if (!path) {
    console.warn('WFC GEL Request error: Missing path')
    if (options.error) {
      options.error(new Error('Missing path'))
    }
    return
  }

  try {
    const fullPath = `${normalizePath(baifenAigcApiPath)}${normalizePath(getUrlParamCorpCode())}`

    // Make the request with updated content type
    request(fullPath, {
      ...options,
      method: 'GET',
    })
  } catch (err) {
    console.trace(err)
    console.warn(`WFC GEL Request error: ${err}`)
    if (options.error) {
      options.error(err)
    }
  }
}
