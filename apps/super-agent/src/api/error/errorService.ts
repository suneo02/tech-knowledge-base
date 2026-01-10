import { type ErrorConfig, getErrorConfig } from 'gel-util/config'
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import ErrorPopup from '../../components/ErrorPopup'
import { ApiError } from './error-handling'
import { message } from '@wind/wind-ui'
import { isDev } from '@/utils/env'

// let errorPopupRoot: ReactDOM.Root | null = null
// let errorContainer: HTMLDivElement | null = null

// // 创建错误弹窗容器
// const createErrorContainer = () => {
//   if (!errorContainer) {
//     errorContainer = document.createElement('div')
//     errorContainer.id = 'error-popup-container'
//     document.body.appendChild(errorContainer)
//     errorPopupRoot = ReactDOM.createRoot(errorContainer)
//   }
//   return errorPopupRoot
// }

// // 关闭错误弹窗
// const closeErrorPopup = () => {
//   if (errorPopupRoot && errorContainer) {
//     errorPopupRoot.render(null)
//   }
// }

// 显示错误信息（开发模式下打印详细日志，生产模式仅Toast）
export const showErrorPopup = (config: ErrorConfig, error?: unknown) => {
  // const root = createErrorContainer()
  // if (root) {
  //   root.render(
  //     React.createElement(ErrorPopup, {
  //       config,
  //       onClose: closeErrorPopup,
  //     })
  //   )
  // }
  message.error(config.message)
  if (isDev && error) {
    console.error(error)
  }

  // if (isDev && error) {
  //   if (error instanceof ApiError) {
  //     console.group('🚨 API Error Details')
  //     console.log('Message:', error.message)
  //     console.log('Code:', error.code)
  //     console.log('Path:', error.path)
  //     console.log('Status:', error.status)
  //     if (error.requestConfig) {
  //       console.log('Request Config:', error.requestConfig)
  //     }
  //     console.groupEnd()
  //   } else {
  //     console.error('🚨 Error Details:', error)
  //   }
  // }
}

// 处理 API 错误
export const handleApiError = (error: unknown) => {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    // 根据错误码获取错误配置
    const errorConfig = getErrorConfig(error.code)

    // 使用自定义错误消息（如果有）
    if (error.message && error.message !== 'Server Error') {
      errorConfig.message = error.message
    }

    showErrorPopup(errorConfig, error)
    return error
  } else if (error instanceof Error) {
    // 处理一般 JavaScript 错误
    const errorConfig = getErrorConfig('DEFAULT')
    errorConfig.message = error.message
    showErrorPopup(errorConfig, error)
    return error
  } else {
    // 处理未知错误
    showErrorPopup(getErrorConfig('DEFAULT'), error)
    return new Error('Unknown error')
  }
}

// 手动显示错误
export const showError = (errorCode: string | number, customMessage?: string) => {
  const errorConfig = getErrorConfig(errorCode)
  if (customMessage) {
    errorConfig.message = customMessage
  }
  showErrorPopup(errorConfig)
}

// 关闭所有错误弹窗
export const closeAllErrors = () => {
  // closeErrorPopup()
}
