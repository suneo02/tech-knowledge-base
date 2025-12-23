import React from 'react'
import { Button, message as WindMessage } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { CloseOutlined } from '@ant-design/icons'

interface CustomMessageOptions {
  content: React.ReactNode
  type?: 'success' | 'info' | 'warning' | 'error'
  duration?: number
  showActionButton?: boolean
  okText?: string
  onOk?: () => void
  showCloseButton?: boolean
  onClose?: () => void
}

const STRINGS = {
  DEFAULT_ACTION: t('12238', '确定')
}

export const showMessage = (options: CustomMessageOptions) => {
  const {
    content,
    type = 'info',
    duration,
    showActionButton = false,
    okText = STRINGS.DEFAULT_ACTION,
    onOk,
    showCloseButton = true,
    onClose,
  } = options

  const key = `message_${Date.now()}`

  const handleActionClick = () => {
    onOk?.()
    WindMessage.destroy(key)
  }

  const handleCloseClick = () => {
    onClose?.()
    WindMessage.destroy(key)
  }

  WindMessage.open({
    content: (
      <span>
        <span>{content}</span>
        {showActionButton && (
          <Button type="link" size="small" onClick={handleActionClick}>
            {okText}
          </Button>
        )}
        {showCloseButton && (
          <Button type="text" icon={<CloseOutlined style={{ fontSize: 12 }} />} onClick={handleCloseClick} />
        )}
      </span>
    ),
    key,
    type,
    duration: duration ?? 3,
  })
}

// 便捷方法
export const showSuccessMessage = (content: React.ReactNode, options?: Partial<CustomMessageOptions>) => {
  showMessage({ ...options, content, type: 'success' })
}

export const showErrorMessage = (content: React.ReactNode, options?: Partial<CustomMessageOptions>) => {
  showMessage({ ...options, content, type: 'error' })
}

export const showWarningMessage = (content: React.ReactNode, options?: Partial<CustomMessageOptions>) => {
  showMessage({ ...options, content, type: 'warning' })
}

export const showInfoMessage = (content: React.ReactNode, options?: Partial<CustomMessageOptions>) => {
  showMessage({ ...options, content, type: 'info' })
}

// 带充值按钮的消息（保持向后兼容）
export const showRechargeMessage = (content: React.ReactNode, onRecharge?: () => void) => {
  showMessage({
    content,
    type: 'warning',
    showActionButton: true,
    okText: t('', '去购买'),
    onOk: onRecharge,
    showCloseButton: true,
  })
}
