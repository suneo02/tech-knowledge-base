import { useRef, useEffect, useCallback } from 'react'

/**
 * @module useScrollRestoration
 * @author Calvin
 *
 * @description
 * 一个用于在 React 应用中管理和恢复可滚动容器滚动位置的自定义 Hook。
 *
 * @problem
 * 在复杂的单页应用中，尤其是在有标签页(Tabs)或侧边菜单(Menu)切换内容的场景下，一个常见的用户体验痛点是：当用户在一个长列表中向下滚动，然后切换到另一个标签页再切回来时，滚动位置会丢失，被重置到列表顶部。这迫使用户重新滚动到之前的位置，非常影响使用体验。
 *
 * 此 Hook 解决了以下核心问题：
 * 1. **自动保存和恢复滚动位置**：当用户在不同视图（由 `activeKey` 标识）间切换时，能自动记住每个视图的滚动位置，并在用户切回时恢复它。
 * 2. **解决竞态条件 (Race Condition)**：一个更棘手的问题是，当从一个已滚动的视图切换到一个新视图时，新视图可能会错误地"继承"旧视图的滚动位置。这是因为`scroll`事件的触发和 React 的状态更新之间存在延迟。此 Hook 通过一个短暂的计时器守卫，巧妙地忽略了由程序设置滚动条位置时触发的无效`scroll`事件，确保只保存用户的主动滚动行为。
 *
 * @usage
 * ```jsx
 * import { useScrollRestoration } from './useScrollRestoration';
 *
 * const MyComponent = ({ activeTab, tabsData }) => {
 *   const { scrollContainerRef, handleScroll } = useScrollRestoration(activeTab);
 *
 *   return (
 *     <div className="tabs-container">
 *       <div className="tab-content" ref={scrollContainerRef} onScroll={handleScroll}>
 *         {tabsData[activeKey].map(item => <div key={item.id}>{item.content}</div>)}
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 *
 * @param {string} activeKey - 唯一标识当前活动视图的键（例如，菜单项的ID或标签页的key）。
 * @param {boolean} [shouldRestoreOnMount=true] - 是否在组件首次挂载时恢复滚动位置。
 * @returns {{ scrollContainerRef: React.RefObject<HTMLDivElement>, handleScroll: (event: React.UIEvent<HTMLDivElement>) => void, restoreScrollPosition: () => void }}
 */
export const useScrollRestoration = (activeKey: string, shouldRestoreOnMount = true) => {
  // 存储所有视图的滚动位置
  const scrollPositionsCache = useRef<Record<string, number>>({})
  // 用于在编程方式滚动后，临时禁用滚动事件处理的计时器ID
  const scrollTimeoutCache = useRef<number | null>(null)
  // 使用 ref 来区分组件的首次挂载和后续的更新
  const isMounted = useRef(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  /**
   * 处理滚动事件，更新当前视图的滚动位置
   */
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      // 如果计时器正在运行，说明这是一个由程序触发的滚动，应当忽略
      if (scrollTimeoutCache.current) return
      if (activeKey) scrollPositionsCache.current[activeKey] = event.currentTarget.scrollTop
    },
    [activeKey]
  )

  /**
   * 手动恢复滚动位置的函数，可在需要时调用
   */
  const restoreScrollPosition = useCallback(() => {
    if (!scrollContainerRef.current || !activeKey) return

    const savedPosition = scrollPositionsCache.current[activeKey] ?? 0

    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        // 在设置滚动位置之前，清除可能存在的旧计时器
        if (scrollTimeoutCache.current) clearTimeout(scrollTimeoutCache.current)

        // 以编程方式设置滚动位置，这会触发一个我们想要忽略的scroll事件
        scrollContainerRef.current.scrollTop = savedPosition

        // 设置一个短暂的计时器。在此期间，handleScroll将忽略所有事件。
        // 这给了浏览器足够的时间来处理由 scrollTop 赋值触发的滚动事件。
        scrollTimeoutCache.current = window.setTimeout(() => {
          scrollTimeoutCache.current = null
        }, 50) // 50毫秒足以忽略程序滚动，同时不影响用户体验
      }
    })
  }, [activeKey])

  /**
   * 处理首次挂载和后续 activeKey 变更的场景。
   */
  useEffect(() => {
    if (!activeKey) return

    // 根据是首次挂载还是后续更新来决定是否恢复滚动位置
    if (isMounted.current) {
      // 后续更新：总是恢复滚动位置
      restoreScrollPosition()
    } else {
      // 首次挂载：仅在 shouldRestoreOnMount 为 true 时恢复
      isMounted.current = true
      if (shouldRestoreOnMount) {
        restoreScrollPosition()
      }
    }

    return () => {
      if (scrollTimeoutCache.current) {
        clearTimeout(scrollTimeoutCache.current)
      }
    }
  }, [activeKey, shouldRestoreOnMount, restoreScrollPosition])

  return {
    scrollContainerRef,
    handleScroll,
    restoreScrollPosition,
  }
}
