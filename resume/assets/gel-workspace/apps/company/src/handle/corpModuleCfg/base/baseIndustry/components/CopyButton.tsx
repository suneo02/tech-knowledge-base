import React, { useState, useCallback } from 'react'
import { Button } from '@wind/wind-ui'
import copy from 'copy-to-clipboard'
import intl from '@/utils/intl'
import { ButtonProps } from '@wind/wind-ui/lib/button/button'

// 从 @wind/wind-ui Button 组件通常会导出的类型，如果不存在，可以简化为 string
// 假设 WindButtonType 与 antd 的 ButtonProps['type'] 兼容
// 如果 @wind/wind-ui 有特定的 ButtonType 定义，应从那里导入
type WindButtonType = ButtonProps['type']

interface CopyButtonProps {
  /**
   * 需要复制到剪贴板的文本内容
   */
  copyText: string
  /**
   * 在复制按钮之前显示的内容
   */
  children: React.ReactNode
  /**
   * 附加到最外层包裹 div 的 CSS 类名
   */
  wrapperClassName?: string
  /**
   * 附加到实际复制按钮的 CSS 类名
   */
  buttonClassName?: string
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

/**
 * @description 一个组件，它渲染子内容并在其后附加一个复制按钮。
 * 点击按钮会将提供的文本复制到剪贴板，并根据复制状态显示不同内容。
 * @param {string} copyText - 点击按钮时要复制的文本。
 * @param {React.ReactNode} children - 显示在复制按钮之前的内容。
 * @param {string} [wrapperClassName] - 应用于包裹子内容和按钮的 div 的 CSS 类名。
 * @param {string} [buttonClassName] - 应用于复制按钮本身的 CSS 类名。
 * @param {WindButtonType} [buttonType='link'] - 按钮的类型。默认为 'link'。
 * @param {() => void} [onCopySuccess] - 复制成功时触发的回调。
 * @param {(error: any) => void} [onCopyError] - 复制失败时触发的回调。
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  copyText,
  children,
  wrapperClassName,
  buttonClassName,
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
    <div className={wrapperClassName}>
      {children}
      <Button type={buttonType} className={buttonClassName} onClick={handleCopy}>
        {defaultRenderButtonText(copyStatus)}
      </Button>
    </div>
  )
}
