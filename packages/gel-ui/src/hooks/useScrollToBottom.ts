import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useScrollToBottom Hook 参数
 */
interface UseScrollToBottomProps {
  /** 距离底部多少像素内视为"吸附态"，默认 50px */
  anchorThreshold?: number
  /** 是否开启调试模式，会在控制台输出滚动日志 */
  debug?: boolean
}

/**
 * 聊天消息自动滚动控制 Hook (纯净版)
 *
 * 采用"维度驱动 (Dimension-driven)"架构，通过 ResizeObserver 监听内容高度变化，
 * 彻底解决图片懒加载、公式渲染等导致的滚动滞后问题。
 *
 * **核心特性**：
 * - **双层架构**：分离 Viewport (滚动容器) 与 Content (内容容器)
 * - **物理感知**：基于 DOM 几何尺寸变化触发滚动，而非 React State
 * - **零抖动**：流式/加载过程中强制使用 Instant Scroll
 * - **智能吸附**：仅当用户处于底部时自动跟随，手动上滑时保持位置
 *
 * @param props - Hook 配置参数
 * @returns 滚动控制相关的状态和方法
 */
export const useScrollToBottom = ({ anchorThreshold = 50, debug = false }: UseScrollToBottomProps = {}) => {
  /** 控制是否显示"滚动到底部"按钮 */
  const [showScrollBottom, setShowScrollBottom] = useState(false)

  /** 滚动容器 Ref (Viewport) */
  const chatContainerRef = useRef<HTMLDivElement>(null)
  /** 内容容器 Ref (Content) - 用于 ResizeObserver 监听 */
  const contentRef = useRef<HTMLDivElement>(null)

  /**
   * 状态标记：当前是否处于"锁定底部"状态
   * 使用 ref 而非 state，为了在 ResizeObserver 回调中获取最新值且不触发重渲染
   */
  const isStickToBottom = useRef(true)

  /**
   * 处理滚动事件，判断用户意图
   * 更新 isStickToBottom 标记，并控制"回到底部"按钮显隐
   */
  const handleScroll = useCallback(() => {
    const viewport = chatContainerRef.current
    if (!viewport) return

    const { scrollTop, scrollHeight, clientHeight } = viewport
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    // 更新吸附状态标记
    // 容错处理：允许 1px 误差，防止高分屏计算问题
    isStickToBottom.current = distanceFromBottom <= anchorThreshold

    if (debug)
      console.log('[useScrollToBottom] handleScroll', scrollTop, scrollHeight, clientHeight, distanceFromBottom)
    // 控制按钮显隐：距离底部超过阈值时显示
    setShowScrollBottom(distanceFromBottom > anchorThreshold)
  }, [anchorThreshold])

  /**
   * 手动滚动到底部
   * 通常用于点击"回到底部"按钮
   */
  const scrollToBottom = useCallback((behavior?: ScrollBehavior | unknown) => {
    const viewport = chatContainerRef.current
    if (viewport) {
      // 容错处理：防止传入事件对象 (SyntheticEvent) 导致报错
      const scrollBehavior: ScrollBehavior =
        typeof behavior === 'string' && ['auto', 'smooth', 'instant'].includes(behavior)
          ? (behavior as ScrollBehavior)
          : 'smooth'

      viewport.scrollTo({ top: viewport.scrollHeight, behavior: scrollBehavior })
      // 手动触发后，强制重置为吸附状态
      isStickToBottom.current = true
    }
  }, [])

  /**
   * 核心：ResizeObserver 监听内容高度变化
   * 只要内容高度变了（无论是文本增加还是图片加载），且当前处于吸附态，就执行滚动
   */
  useEffect(() => {
    const viewport = chatContainerRef.current
    // 如果没有显式绑定 contentRef，尝试使用 viewport 的第一个子元素作为 content
    const content = contentRef.current || viewport?.firstElementChild

    if (!viewport || !content) return

    // 1. 绑定 Scroll 监听
    viewport.addEventListener('scroll', handleScroll, { passive: true })

    // 2. 创建 ResizeObserver
    const ro = new ResizeObserver(() => {
      // 当尺寸变化发生时：
      // 只有当之前处于"吸附"状态时，才执行自动滚动
      if (isStickToBottom.current) {
        if (debug) {
          console.log('[useScrollToBottom] Auto Scroll Triggered:', {
            scrollHeight: viewport.scrollHeight,
            scrollTop: viewport.scrollTop,
            clientHeight: viewport.clientHeight,
          })
        }
        // 应对流式输出和图片加载，统一使用 'smooth' 提升体验
        // 既然 Scroll Anchoring 问题已解决，且移除了不稳定组件，可以放心使用平滑滚动
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' })
      } else if (debug) {
        console.log('[useScrollToBottom] Auto Scroll Skipped (User detached):', {
          distanceFromBottom: viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight,
        })
      }
    })

    // 3. 开始观察
    if (debug) console.log('[useScrollToBottom] Start observing:', content)
    ro.observe(content)

    return () => {
      viewport.removeEventListener('scroll', handleScroll)
      ro.disconnect()
    }
  }, [handleScroll, debug])

  return {
    chatContainerRef, // 绑定到外层 overflow-y: auto 的容器
    contentRef, // 绑定到内层包裹所有消息的容器
    showScrollBottom,
    scrollToBottom,
  }
}
