import { setErrorLogger } from './error-handling'
import { showError, showErrorPopup } from './errorService'
import { getErrorConfig } from 'gel-util/config'
// import { requestToEntWeb } from '../entWeb'
import { isDev } from '@/utils/env'
// import type { EaglesName } from 'gel-api'

const reportEagleS = (_payload: unknown) => {
  // try {
  //   requestToEntWeb('openapi/eaglesLog', {
  //     reason: JSON.stringify(payload),
  //     name: 'super-agent' as EaglesName,
  //   })
  // } catch (error) {
  //   console.error(error)
  // }
}

const buildPayload = (error: unknown) => {
  const time = new Date().toISOString()
  const url = typeof window !== 'undefined' ? window.location.href : ''
  if (error instanceof Error) {
    return {
      app: 'super-agent',
      type: 'js_error',
      message: error.message,
      name: error.name,
      stack: error.stack,
      url,
      time,
    }
  }
  return {
    app: 'super-agent',
    type: 'unknown_error',
    message: String(error),
    url,
    time,
  }
}

export const initGlobalErrorHandlers = () => {
  setErrorLogger((err) => {
    reportEagleS(buildPayload(err))
  })

  if (typeof window === 'undefined') {
    return
  }

  window.onerror = (_message, _source, _lineno, _colno, error) => {
    const payload = buildPayload(error ?? String(_message))
    reportEagleS(payload)
    const config = getErrorConfig('DEFAULT')
    config.message = error instanceof Error ? error.message : String(_message)
    showErrorPopup(config)
    return !isDev
  }

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason ?? 'Unhandled Promise Rejection'
    const payload = buildPayload(reason)
    reportEagleS(payload)
    const message = reason instanceof Error ? reason.message : String(reason)
    showError('DEFAULT', message)
  })
}
