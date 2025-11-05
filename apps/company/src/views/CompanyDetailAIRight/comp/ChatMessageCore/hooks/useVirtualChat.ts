import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useLayoutEffect } from 'react'

/**
 * 虚拟聊天滚动 hook
 *
 * @author 刘兴华<xhliu.liuxh@wind.com.cn>
 * @param groupedBubbleItems 分组后的气泡项
 * @param chatContainerRef 聊天容器引用
 * @returns 虚拟滚动器实例
 */
export const useVirtualChat = (groupedBubbleItems: any[], chatContainerRef: React.RefObject<HTMLDivElement>) => {
  // 虚拟滚动配置 - 必须在顶层调用
  const rowVirtualizer = useVirtualizer({
    count: groupedBubbleItems.length,
    getScrollElement: () => chatContainerRef.current,
    estimateSize: useCallback(
      (index) => {
        // 获取消息元素的实际高度
        const element = chatContainerRef.current?.querySelector(`[data-index="${index}"]`)
        if (element) {
          const height = element.getBoundingClientRect().height
          return height
        }
        return 100 // 默认高度
      },
      [groupedBubbleItems, chatContainerRef]
    ),
    overscan: 5, // 预渲染的消息数量
  })

  // 使用 useLayoutEffect 强制重新测量高度
  useLayoutEffect(() => {

    rowVirtualizer?.measure?.()

    // 为了等布局渲染完成更准确的重新测量高度
    setTimeout(() => {
      rowVirtualizer?.measure?.()

    }, 1000)
  }, [groupedBubbleItems.length, rowVirtualizer])

  return rowVirtualizer
}
