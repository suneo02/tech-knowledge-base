import type { ModalProps } from 'antd'
import { Button, message, Modal } from 'antd'
import { ErrorActionType, ErrorConfig } from 'gel-util/config'
import React, { useCallback } from 'react'
import styles from './styles.module.less'

export interface ErrorPopupProps extends ModalProps {
  config: ErrorConfig
  onClose?: () => void
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ config, onClose, ...modalProps }) => {
  // 处理操作按钮点击
  const handleActionClick = useCallback(
    (type: ErrorActionType) => {
      switch (type) {
        case ErrorActionType.RECHARGE:
          console.log('recharge')
          // 跳转到充值页面
          // navigate('/recharge')
          break
        case ErrorActionType.RETRY:
          // 重新加载页面
          window.location.reload()
          break
        case ErrorActionType.CLOSE:
        case ErrorActionType.CANCEL:
        case ErrorActionType.CONFIRM:
        default:
          // 关闭弹窗
          onClose?.()
          break
      }
    },
    [onClose]
  )

  // 自动关闭的消息提示
  if (config.duration) {
    message[config.type]({
      content: config.message,
      duration: config.duration / 1000,
    })
    return null
  }

  return (
    <Modal
      title={config.title}
      open={true}
      closable={config.closable}
      maskClosable={config.closable}
      onCancel={onClose}
      footer={config.actions?.map((action, index) => (
        <Button
          key={index}
          type={action.type === ErrorActionType.CONFIRM ? 'primary' : 'default'}
          danger={config.type === 'error' && action.type === ErrorActionType.CONFIRM}
          onClick={() => {
            action.onClick?.() || handleActionClick(action.type)
          }}
        >
          {action.text}
        </Button>
      ))}
      className={styles.errorPopup}
      {...modalProps}
    >
      <div className={styles.errorContent}>
        {config.showIcon && (
          <div className={styles.errorIcon}>
            {config.type === 'error' && <span className={styles.errorIconError}>×</span>}
            {config.type === 'warning' && <span className={styles.errorIconWarning}>!</span>}
            {config.type === 'info' && <span className={styles.errorIconInfo}>i</span>}
            {config.type === 'success' && <span className={styles.errorIconSuccess}>✓</span>}
          </div>
        )}
        <div className={styles.errorMessage}>{config.message}</div>
      </div>
    </Modal>
  )
}

export default ErrorPopup
