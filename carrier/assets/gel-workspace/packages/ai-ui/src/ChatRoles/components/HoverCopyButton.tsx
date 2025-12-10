import { CopyO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import { copyTextAndMessage } from 'gel-ui'
import { useState } from 'react'

interface HoverCopyButtonProps {
  /** 要复制的内容 */
  content: string
  /** 按钮位置，相对于容器的偏移 */
  position?: {
    left?: number
    right?: number
    top?: number
    bottom?: number
  }
  /** 按钮大小 */
  size?: 'small' | 'default' | 'large'
  /** 自定义按钮文本 */
  buttonText?: string
  /** 是否显示按钮文本 */
  showText?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
  /** 子元素 */
  children: React.ReactNode
}

/**
 * 悬浮复制按钮组件
 * 当鼠标悬浮在容器上时，在指定位置显示复制按钮
 */
export const HoverCopyButton = ({
  content,

  buttonText = '',
  showText = true,
  className,
  style,
  children,
}: HoverCopyButtonProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = () => {
    copyTextAndMessage(content)
  }

  return (
    <div
      className={className}
      style={{ position: 'relative', cursor: 'pointer', ...style }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%) translateX(-100%)',
            zIndex: 10,
          }}
        >
          <Button
            type="text"
            icon={<CopyO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            onClick={handleCopy}
          >
            {showText && buttonText}
          </Button>
        </div>
      )}

      {children}
    </div>
  )
}
