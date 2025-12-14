import { message } from '@wind/wind-ui'
import { copyText } from 'gel-util/misc'
import { t } from 'gel-util/intl'

interface CopyOptions {
  onSuccess?: () => void
  onError?: () => void
  successTip?: string
  errorTip?: string
}

/**
 * 通用的复制文本方法
 * @param text 要复制的文本
 * @param options 配置项
 */
export const copyTextAndMessage = (text: string, options: CopyOptions = {}) => {
  const { onSuccess, onError, successTip = t('144378', '复制成功'), errorTip = t('421484', '455058') } = options
  copyText(text)
    .then(() => {
      message.success(successTip, 2)
      onSuccess?.()
    })
    .catch(() => {
      message.error(errorTip)
      onError?.()
    })
}
