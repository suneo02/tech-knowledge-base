import { normalizePath } from '@/utils/url'
import { wfcGelPath } from '../config'
import { RequestConfig } from '../types/request'
import { ApiResponseForWFC } from '../types/response'
import { request } from './base'

export const requestWfcGel = <R = ApiResponseForWFC>(
  path: string,
  options: RequestConfig<Record<string, any>, R> = {}
): void => {
  if (!path) {
    console.warn('WFC GEL Request error: Missing path')
    if (options.error) {
      options.error(new Error('Missing path'))
    }
    return
  }

  try {
    // Build WFC GEL URL with company code
    const fullPath = `${normalizePath(wfcGelPath)}${normalizePath(path)}`

    // Set default content type for WFC GEL if not provided
    const contentType = options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8'

    // Make the request with updated content type
    request(fullPath, {
      ...options,
      contentType,
    })
  } catch (err) {
    console.trace(err)
    console.warn(`WFC GEL Request error: ${err}`)
    if (options.error) {
      options.error(err)
    }
  }
}

/**
 * Makes a request to the WFC GEL API
 * @param path - API endpoint path
 * @param companyCode - Company code to include in the URL
 * @param options - Request configuration options
 */

export function requestWfcEntity<R>(
  path: string,
  companyCode: string,
  options: RequestConfig<Record<string, any>, R> = {}
): void {
  // Build WFC GEL URL with company code
  const fullPath = `${normalizePath(path)}${normalizePath(companyCode)}`

  // Make the request with updated content type
  requestWfcGel<R>(fullPath, options)
}
