import { API_PREFIX, DEV_WSID, isDev } from '@/utils/env'
import { buildUrl } from '@/utils/url'
import { RequestConfig } from '../types/request'

/**
 * Modern API request utility using callback pattern
 * @param url - API endpoint path
 * @param options - Request configuration options including success/error callbacks
 */
export function request<R>(url: string, options: RequestConfig<Record<string, any>, R> = {}): void {
  if (!url) {
    console.warn('Request error: Missing URL')
    if (options.error) {
      options.error(new Error('Missing URL'))
    }
    return
  }

  try {
    const {
      method = 'POST',
      data: bodyData = {},
      params = {},
      contentType = 'application/json;charset=UTF-8',
      timeout = 30000,
      success,
      error,
      finish,
    } = options

    // Build complete URL with query parameters
    const fullUrl = buildUrl(API_PREFIX, url, params)

    // Set request headers
    const headers: Record<string, string> = {
      'Content-Type': contentType,
    }

    // Add session ID to headers for non-release environments
    if (isDev) {
      headers['wind.sessionid'] = DEV_WSID
    }

    // Prepare request body based on content type
    let processedData: any = bodyData
    if (contentType.indexOf('application/json') !== -1) {
      processedData = JSON.stringify(bodyData)
    }

    // Use jQuery's AJAX with direct callbacks
    $.ajax({
      url: fullUrl,
      type: method,
      data: processedData,
      headers,
      timeout,
      success: (response) => {
        if (success) {
          success(response)
        }
        if (finish) {
          finish(response)
        }
      },
      error: (_jqXHR, textStatus, errorThrown) => {
        if (error) {
          error(errorThrown || new Error(textStatus))
        }
        if (finish) {
          finish(null, errorThrown || new Error(textStatus))
        }
      },
    })
  } catch (err) {
    console.trace(err)
    console.warn(`Request error: ${err}`)
    if (options.error) {
      options.error(err)
    }
  }
}
