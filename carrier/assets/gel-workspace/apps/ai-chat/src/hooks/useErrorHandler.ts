import { ErrorAction, ErrorActionType, getErrorConfig } from 'gel-util/config'
import { useCallback } from 'react'
import { useNavigateWithLangSource } from '@/hooks/useLangSource'
import { closeAllErrors, showError } from '../api/error/errorService'

export const useErrorHandler = () => {
  const navigate = useNavigateWithLangSource()

  // 显示错误
  const displayError = useCallback((errorCode: string | number, customMessage?: string) => {
    showError(errorCode, customMessage)
  }, [])

  // 关闭所有错误
  const closeErrors = useCallback(() => {
    closeAllErrors()
  }, [])

  // 创建自定义错误操作
  const createErrorAction = useCallback(
    (type: ErrorActionType, text: string, onClick?: () => void): ErrorAction => {
      const defaultAction: Record<ErrorActionType, () => void> = {
        [ErrorActionType.RECHARGE]: () => navigate('/recharge'),
        [ErrorActionType.RETRY]: () => window.location.reload(),
        [ErrorActionType.CONFIRM]: closeErrors,
        [ErrorActionType.CANCEL]: closeErrors,
        [ErrorActionType.CLOSE]: closeErrors,
        [ErrorActionType.NONE]: () => {},
      }

      return {
        type,
        text,
        onClick: onClick || defaultAction[type],
      }
    },
    [navigate, closeErrors]
  )

  // 显示自定义错误
  const displayCustomError = useCallback(
    (
      errorCode: string | number,
      customConfig: {
        title?: string
        message?: string
        actions?: ErrorAction[]
      }
    ) => {
      const config = getErrorConfig(errorCode)

      if (customConfig.title) {
        config.title = customConfig.title
      }

      if (customConfig.message) {
        config.message = customConfig.message
      }

      if (customConfig.actions) {
        config.actions = customConfig.actions
      }

      showError(errorCode)
    },
    []
  )

  return {
    displayError,
    closeErrors,
    createErrorAction,
    displayCustomError,
  }
}
