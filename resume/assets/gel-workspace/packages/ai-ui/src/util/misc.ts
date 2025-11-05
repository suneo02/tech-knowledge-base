import { message } from '@wind/wind-ui'
import { LanBackend } from 'gel-api'
import { getLocale } from 'gel-util/intl'
import { copyText } from 'gel-util/misc'

export const getLanBackend = (): LanBackend => {
  return getLocale() === 'en-US' ? 'ENS' : 'CHS'
}

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
  const { onSuccess, onError, successTip = '复制成功', errorTip = '复制失败' } = options
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
