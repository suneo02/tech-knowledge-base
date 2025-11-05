import { ToBottomO } from '@wind/icons'
import { FC } from 'react'
import styles from './ScrollToBottomButton.module.less'
import { Button } from '@wind/wind-ui'
import { ButtonProps } from '@wind/wind-ui/lib/button/button'

interface ScrollToBottomButtonProps extends Omit<ButtonProps, 'icon' | 'shape'> {
  /**
   * 是否显示按钮
   */
  visible: boolean
  /**
   * 点击按钮时的回调函数
   */
  onClick: () => void
  /**
   * 自定义类名
   */
  className?: string
}

/**
 * 滚动到底部按钮组件
 *
 * 在聊天界面中提供一个快速滚动到底部的悬浮按钮
 */
export const ScrollToBottomButton: FC<ScrollToBottomButtonProps> = ({ visible, onClick, className = '', ...rest }) => {
  if (!visible) return null

  return (
    <Button
      className={`${styles.scrollBottomButton} ${className}`}
      shape="circle"
      icon={
        <ToBottomO
          style={{ width: 20, height: 20, fontSize: 20 }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      }
      onClick={onClick}
      {...rest}
    />
  )
}
