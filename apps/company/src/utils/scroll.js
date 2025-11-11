/**
 * 滚动的通用方法
 * Created by Calvin
 *
 * @format
 */

export const useScrollUtils = () => {
  /**
   * 检查滚动是否已结束
   * @param {dom} element
   * @returns
   */
  const waitForScrollEnd = (element) => {
    return new Promise((resolve) => {
      let previousScrollTop = element.scrollTop
      let timeout = null
      const checkScrollEnd = () => {
        if (element.scrollTop === previousScrollTop) {
          element.removeEventListener('scroll', checkScrollEnd)
          clearTimeout(timeout)
          resolve()
        } else {
          previousScrollTop = element.scrollTop
          timeout = setTimeout(checkScrollEnd, 100)
        }
      }
      element.addEventListener('scroll', checkScrollEnd)
      timeout = setTimeout(checkScrollEnd, 500)
    })
  }

  /**
   * 滚动到对应的界面
   * @param {string | number} id
   * @param {ScrollIntoViewOptions} options
   * @returns
   */
  const scrollToView = async (id, options) => {
    const nodeElement = document.getElementById(id)
    const defaultOptions = {
      // behavior: "smooth",
      block: 'start',
      // inline: "end",
    }
    if (nodeElement) {
      nodeElement.scrollIntoView(Object.assign(defaultOptions, options))
      return waitForScrollEnd(nodeElement)
    }
    return null
  }

  return {
    scrollToView,
    waitForScrollEnd,
  }
}
