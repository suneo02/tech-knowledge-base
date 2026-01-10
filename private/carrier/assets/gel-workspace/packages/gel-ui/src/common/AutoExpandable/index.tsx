import cn from 'classnames'
import { t } from 'gel-util/intl'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './index.module.less'

export interface AutoExpandableProps {
  /**
   * 需要展示的内容。
   * 可以是文本或任何 React 节点。
   */
  children: React.ReactNode
  /**
   * 收起状态下的最大展示行数。
   * @default 2
   */
  maxLines?: number
  /**
   * 点击“展开”按钮时触发的回调。
   * 支持异步操作。
   */
  onExpand?: () => void | Promise<void>
  /**
   * 点击“收起”按钮时触发的回调。
   */
  onCollapse?: () => void
  /**
   * 容器的自定义类名。
   */
  className?: string
}

/**
 * 通用自动展开组件。
 * 当内容超过指定的行数（maxLines）时，自动显示“展开”按钮。
 *
 * 实现逻辑：
 * 1. 将内容渲染在具有 `line-clamp` 样式的容器中。
 * 2. 使用 `scrollHeight > clientHeight` 检测内容是否实际溢出。
 *    - `scrollHeight`: 内容的总高度，包括不可见部分。
 *    - `clientHeight`: 容器的可见高度。
 * 3. 如果检测到溢出，则显示“展开”按钮。
 * 4. 监听窗口大小调整事件以重新检查溢出状态。
 *
 * 使用示例：
 * ```tsx
 * <AutoExpandable maxLines={3}>
 *   <LongContent />
 * </AutoExpandable>
 * ```
 */
export const AutoExpandable: React.FC<AutoExpandableProps> = ({
  children,
  maxLines = 2,
  onExpand,
  onCollapse,
  className,
}) => {
  const [expanded, setExpanded] = useState(false)
  const [showExpandBtn, setShowExpandBtn] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  /**
   * 检查内容是否溢出容器。
   * 这是决定是否显示“展开”按钮的核心逻辑。
   */
  const checkOverflow = () => {
    if (containerRef.current && contentRef.current) {
      const container = containerRef.current
      // 使用 1px 的容差以避免浮点数计算误差
      const isOverflowing = container.scrollHeight > container.clientHeight + 1

      // 如果已展开，保持按钮显示（允许收起）。
      // 如果已收起，仅当内容实际溢出时才显示按钮。
      if (!expanded) {
        setShowExpandBtn(isOverflowing)
      }
    }
  }

  // 使用 useLayoutEffect 在 DOM 更新后但绘制前检查溢出，
  // 以避免闪烁。
  useLayoutEffect(() => {
    checkOverflow()
  }, [children, maxLines])

  // 当窗口大小改变时重新检查溢出，因为文本换行可能会改变高度。
  useEffect(() => {
    const handleResize = () => checkOverflow()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [expanded])

  const handleToggle = async () => {
    if (!expanded) {
      // 展开操作
      if (onExpand) {
        await onExpand()
      }
      setExpanded(true)
    } else {
      // 收起操作
      setExpanded(false)
      if (onCollapse) {
        onCollapse()
      }
    }
  }

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className={cn(styles['auto-expandable-container'], {
          [styles['is-collapsed']]: !expanded,
        })}
        style={
          !expanded
            ? ({
                WebkitLineClamp: maxLines,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div ref={contentRef}>{children}</div>
      </div>

      {(showExpandBtn || expanded) && (
        <div
          className="wi-btn-color"
          onClick={handleToggle}
          style={{ cursor: 'pointer', marginTop: 4, display: 'inline-block' }}
        >
          {expanded ? t('119102', '收起') : t('28912', '展开')}
        </div>
      )}
    </div>
  )
}
