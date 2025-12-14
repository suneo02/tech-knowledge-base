import React, { useState, useCallback } from 'react'
import { Button } from '@wind/wind-ui'
import copy from 'copy-to-clipboard'
import intl from '@/utils/intl'
import { ButtonProps } from '@wind/wind-ui/lib/button/button'
import styles from './index.module.less'

// 从 @wind/wind-ui Button 组件通常会导出的类型，如果不存在，可以简化为 string
// 假设 WindButtonType 与 antd 的 ButtonProps['type'] 兼容
// 如果 @wind/wind-ui 有特定的 ButtonType 定义，应从那里导入
type WindButtonType = ButtonProps['type']

interface CopyContainerProps {
  /**
   * 需要复制到剪贴板的文本内容
   */
  copyText: string
  /**
   * 在复制按钮之前显示的内容
   */
  children: React.ReactNode
  /**
   * 按钮的类型 (例如, 'link', 'primary')。默认为 'link'。
   */
  buttonType?: WindButtonType
  /**
   * 成功复制后的回调函数
   */
  onCopySuccess?: () => void
  /**
   * 复制失败后的回调函数
   */
  onCopyError?: (error: any) => void
}

const PREFIX = 'copy-container'

/**
 * @description 一个组件，它渲染子内容并在其后附加一个复制按钮。
 * 点击按钮会将提供的文本复制到剪贴板，并根据复制状态显示不同内容。
 */
export const CopyContainer: React.FC<CopyContainerProps> = ({
  copyText,
  children,
  buttonType = 'link',
  onCopySuccess,
  onCopyError,
}) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')

  const handleCopy = useCallback(async () => {
    if (!copyText) return
    try {
      copy(copyText)
      setCopyStatus('copied')
      if (onCopySuccess) {
        onCopySuccess()
      }
      setTimeout(() => setCopyStatus('idle'), 2000) // 2秒后重置状态
    } catch (err) {
      console.error('Failed to copy text: ', err)
      if (onCopyError) {
        onCopyError(err)
      }
    }
  }, [copyText, onCopySuccess, onCopyError])

  const defaultRenderButtonText = (status: 'idle' | 'copied') =>
    status === 'copied' ? intl('421466', '已复制') : intl('421482', '复制')

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {children}
      <Button
        type={buttonType}
        className={styles[`${PREFIX}-button`]}
        onClick={handleCopy}
        data-uc-id="G5epp-z73j"
        data-uc-ct="button"
      >
        {defaultRenderButtonText(copyStatus)}
      </Button>
    </div>
  )
}
