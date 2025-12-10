/**
 * Language control module for initializing and managing language settings
 */

import { COMMON_CONSTANTS } from 'report-util/constants'

interface LanguageControlOptions {
  /** Path to locale files directory */
  localePath?: string
  /** Success callback function */
  onSuccess?: () => void
  /** Error callback function */
  onError?: () => void
  /** Whether to register language change handler */
  registerChangeHandler?: boolean
}

/**
 * Initialize the language control system
 */
export function initLanguageControl(options: LanguageControlOptions): void {
  const {
    localePath = COMMON_CONSTANTS.LOCALE_PATH,
    onSuccess = () => {},
    onError = () => {},
    registerChangeHandler = true,
  } = options

  // Check if wind and langControl are available
  if (!window.wind || !window.wind.langControl) {
    return
  }

  const wind = window.wind

  // Initialize language JSON
  if (wind.langControl.initByJSON) {
    wind.langControl.initByJSON(
      localePath,
      function () {
        // Call the success callback
        onSuccess()
      },
      function () {
        // Call the error callback
        onError()
      }
    )
  }

  // Register language change handler if needed
  if (
    registerChangeHandler &&
    // @ts-expect-error
    window.$.client &&
    // @ts-expect-error
    window.$.client.addServerFunc
  ) {
    // @ts-expect-error
    window.$.client.addServerFunc('NotifyLocaleChanged', function (data: any) {
      // data {func:'NotifyLocaleChanged',locale:'zh-CN' // 'en-US' }
      /**
       * 切换wft系统语言时 重刷页面
       */
      const lang = data.locale === 'en-US' ? 'en' : 'cn'
      const search = String(wind.uri(location.href).query('lang', lang).search)
      location.search = search
    })
  }

  // Set global intl function
  window.intl = wind.langControl.intl
}
