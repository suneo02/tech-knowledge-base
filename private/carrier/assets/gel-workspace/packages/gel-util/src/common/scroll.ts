/**
 * 滚动工具函数
 *
 * @author 刘兴华<xhliu.liuxh@wind.com.cn>
 */

/**
 * 确保指定元素在容器中可见, 如果元素在可视区域外，滚动到可见位置, 如果元素在可视区域，则不滚动
 *
 * @param element 需要确保可见的元素
 * @param container 滚动容器
 * @param margin 边距，默认 0px
 */
export const ensureElementVisible = (element: HTMLElement, container: HTMLElement, margin: number = 0): void => {
  if (!container || !element) return

  const containerRect = container.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()

  // 计算元素相对于容器的位置
  const elementTop = elementRect.top - containerRect.top
  const elementBottom = elementRect.bottom - containerRect.top

  // 如果元素在可视区域外，滚动到可见位置
  if (elementTop < 0) {
    // 元素在可视区域上方，滚动到元素顶部
    container.scrollTop += elementTop - margin
  } else if (elementBottom > containerRect.height) {
    // 元素在可视区域下方，滚动到元素底部可见
    const scrollDistance = elementBottom - containerRect.height + margin
    container.scrollTop += scrollDistance
  }
}
