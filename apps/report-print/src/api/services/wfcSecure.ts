import { wfcSecurePath } from '../config'
import { RequestConfig } from '../types/request'
import { request } from './base'

/**
 * Makes a request to the WFC GEL API
 * @param path - API endpoint path
 * @param companyCode - Company code to include in the URL
 * @param options - Request configuration options
 */

export function requestWfcSecure(cmd: string, options: RequestConfig = {}): void {
  if (!cmd) {
    console.warn('WFC Secure Request error: Missing cmd')
    if (options.error) {
      options.error(new Error('Missing cmd'))
    }
    return
  }

  try {
    // Set default content type for WFC GEL if not provided
    const contentType = options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8'
    const params = {
      ...options.params,
      cmd,
    }

    // Make the request with updated content type
    request(wfcSecurePath, {
      ...options,
      contentType,
      params,
    })
  } catch (err) {
    console.trace(err)
    console.warn(`WFC GEL Request error: ${err}`)
    if (options.error) {
      options.error(err)
    }
  }
}
