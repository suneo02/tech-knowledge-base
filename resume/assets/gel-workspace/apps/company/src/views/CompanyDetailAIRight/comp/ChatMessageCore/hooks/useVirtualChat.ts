import { useVirtualizer } from '@tanstack/react-virtual'
import { COLLAPSE_EXPAND_EVENT, ensureElementVisible } from 'gel-util/common'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

/**
 * 展开的 Collapse 元素的 class 名称
 * 用于定位已展开的折叠面板内容区域
 */
const COLLAPSE_CLASS = '.w-collapse-content-active'

/**
 * 默认预估高度（单位：px）
 * 当无法获取实际元素高度时使用此默认值
 */
const ESTIMATE_SIZE_DEFAULT = 100

/**
 * 预渲染的消息数量
 * 在可视区域上下额外渲染的消息条数，提升滚动流畅度
 */
const OVERSCAN_DEFAULT = 5

/**
 * 虚拟聊天滚动 Hook
 *
 * 基于 @tanstack/react-virtual 实现的聊天消息虚拟滚动功能，主要解决以下问题：
 * 1. 大量聊天消息的性能优化 - 只渲染可视区域内的消息
 * 2. 加载历史消息时保持滚动位置 - 避免跳动
 * 3. Collapse 展开时自动滚动到可视区域 - 提升用户体验
 *
 * @author 刘兴华<xhliu.liuxh@wind.com.cn>
 *
 * @param groupedBubbleItemsWithKeys - 带 key 的分组后的气泡项数组
 *        每个元素包含 { key: string, items: any[] }
 *        key 用于 React 列表渲染优化，items 为该组的消息数据
 * @param chatContainerRef - 聊天容器的 React ref 引用
 *        指向包含所有聊天消息的可滚动容器 DOM 元素
 *
 * @returns 返回对象包含：
 *   - rowVirtualizer: 虚拟滚动器实例，提供虚拟滚动相关方法和状态
 *   - getTotalSize: 获取所有消息的总高度（包括虚拟的未渲染部分）
 */
export const useVirtualChat = (
  groupedBubbleItemsWithKeys: Array<{ key: string; items: any[] }>,
  chatContainerRef: React.RefObject<HTMLDivElement>
) => {
  /**
   * 记录上一次的滚动位置（scrollTop 值）
   * 用于在加载历史消息时计算需要补偿的滚动距离
   */
  const prevScrollTopRef = useRef<number>(0)

  /**
   * 记录上一次的消息总数
   * 用于判断是否加载了新的历史消息（数据长度增加）
   */
  const prevFirstVisibleIndexRef = useRef<number>(0)

  /**
   * 初始化虚拟滚动器
   * 使用 @tanstack/react-virtual 提供的 useVirtualizer hook
   */
  const rowVirtualizer = useVirtualizer({
    // 虚拟列表的总项数
    count: groupedBubbleItemsWithKeys.length,

    // 获取滚动容器元素
    getScrollElement: () => chatContainerRef.current,

    /**
     * 预估每个消息项的高度
     * 虚拟滚动需要知道每项的高度来计算滚动位置和可视区域
     *
     * @param index - 消息项的索引
     * @returns 该消息项的预估高度（px）
     */
    estimateSize: useCallback(
      (index) => {
        // 尝试获取已渲染的消息元素
        const element = chatContainerRef.current?.querySelector(`[data-index="${index}"]`)
        if (element) {
          // 如果元素已渲染，返回其实际高度
          const height = element.getBoundingClientRect().height
          return height
        }
        // 如果元素未渲染，返回默认预估高度
        return ESTIMATE_SIZE_DEFAULT
      },
      [groupedBubbleItemsWithKeys, chatContainerRef]
    ),

    // 预渲染数量：在可视区域上下各额外渲染 5 条消息，提升滚动流畅度
    overscan: OVERSCAN_DEFAULT,
  })

  /**
   * 处理消息列表变化时的滚动位置保持
   * 使用 useLayoutEffect 在 DOM 更新后、浏览器绘制前同步执行
   *
   * 主要场景：加载历史消息时，新消息会插入到列表顶部
   * 如果不处理，用户会看到页面跳动到顶部，体验很差
   *
   * 解决方案：
   * 1. 计算新增消息的总高度
   * 2. 将滚动位置向下偏移相应的高度
   * 3. 这样用户看到的内容位置保持不变
   */
  useLayoutEffect(() => {
    const prevLength = prevFirstVisibleIndexRef.current
    const currentLength = groupedBubbleItemsWithKeys.length

    // 强制虚拟滚动器重新测量所有项的高度
    rowVirtualizer?.measure?.()

    // 判断是否加载了新的历史消息（数据长度增加且在顶部）
    if (currentLength > prevLength && prevScrollTopRef.current === 0) {
      const addedCount = currentLength - prevLength

      if (chatContainerRef.current) {
        // 计算新增消息的总高度
        let addedHeight = 0
        for (let i = 0; i < addedCount; i++) {
          const element = chatContainerRef.current.querySelector(`[data-index="${i}"]`)
          if (element) {
            addedHeight += element.getBoundingClientRect().height
          }
        }

        // 调整滚动位置：原位置 + 新增内容高度
        // 这样用户看到的内容位置保持不变，不会跳动
        chatContainerRef.current.scrollTop = prevScrollTopRef.current + addedHeight
      }
    }

    // 更新记录的消息总数，用于下次比较
    prevFirstVisibleIndexRef.current = currentLength
  }, [groupedBubbleItemsWithKeys.length, rowVirtualizer, chatContainerRef])

  /**
   * 监听滚动事件，实时记录滚动位置
   * 这个位置会在加载历史消息时用于计算滚动补偿
   */
  useEffect(() => {
    /**
     * 滚动事件处理函数
     * 每次滚动时更新 prevScrollTopRef 的值
     */
    const handleScroll = () => {
      if (chatContainerRef.current) {
        prevScrollTopRef.current = chatContainerRef.current.scrollTop
      }
    }

    const container = chatContainerRef.current
    if (container) {
      // 添加滚动事件监听
      container.addEventListener('scroll', handleScroll)

      // 清理函数：组件卸载时移除监听
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [chatContainerRef])

  /**
   * 监听全局 Collapse 折叠面板展开/收起事件
   *
   * 场景：聊天消息中可能包含折叠面板（如详细信息、附件列表等）
   * 问题：当用户点击展开折叠面板时，展开的内容可能在可视区域外
   * 解决：自动滚动使展开的内容进入可视区域
   */
  useEffect(() => {
    /**
     * Collapse 展开事件处理函数
     *
     * @param e - 自定义事件对象，包含 collapseClass 信息
     */
    const handleCollapseChange = (e: CustomEvent) => {
      const { collapseClass } = e.detail || {}

      /**
       * 延迟 500ms 后处理
       * 原因：Collapse 展开动画需要时间，等动画完成后再滚动
       */
      setTimeout(() => {
        if (collapseClass && chatContainerRef.current) {
          // 根据 class 名称找到触发展开的 Collapse 容器元素
          const collapseElement = document.querySelector(`.${collapseClass}`)

          if (collapseElement) {
            // 在 Collapse 容器内查找已展开的内容区域
            const expandedCollapse = collapseElement.querySelector(COLLAPSE_CLASS)

            if (expandedCollapse) {
              // 确保展开的内容在可视区域内
              // ensureElementVisible 会计算并执行必要的滚动
              ensureElementVisible(expandedCollapse as HTMLElement, chatContainerRef.current)
            }
          }
        }
      }, 500)
    }

    // 监听全局自定义事件 COLLAPSE_EXPAND_EVENT
    window.addEventListener(COLLAPSE_EXPAND_EVENT, handleCollapseChange as EventListener)

    // 清理函数：组件卸载时移除事件监听
    return () => {
      window.removeEventListener(COLLAPSE_EXPAND_EVENT, handleCollapseChange as EventListener)
    }
  }, [rowVirtualizer])

  return {
    rowVirtualizer,
    getTotalSize: rowVirtualizer.getTotalSize,
  }
}
