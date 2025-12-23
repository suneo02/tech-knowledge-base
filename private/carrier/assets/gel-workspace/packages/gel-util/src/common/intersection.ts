/**
 * 监听视图是否在视口内
 * Created by Calvin
 *
 * @format
 */

/**
 * 创建一个 IntersectionObserver 实例，用于监听元素是否进入视口
 *
 * 该函数封装了 IntersectionObserver API，提供了更简洁的使用方式，
 * 并内置了防抖机制和状态管理，避免频繁触发回调函数。
 *
 * @param inCallback - 元素进入视口时的回调函数
 * @param outCallback - 元素离开视口时的回调函数（可选）
 * @param options - IntersectionObserver 的配置选项
 * @param options.root - 根元素，用作视口的元素。如果为 null，则使用浏览器视口
 * @param options.rootMargin - 根元素的边距，格式类似 CSS margin 属性
 * @param options.threshold - 阈值，决定了目标元素在视口中可见度达到多少比例时触发回调。它可以是一个数字，也可以是数字数组。例如：0.5 表示当目标元素50%可见时触发回调；[0, 0.5, 1] 则表示在目标元素刚进入视口、50%可见以及完全可见时都会触发回调。默认值为 0.5，即元素完全可见时才触发。
 *
 * @returns 返回包含 observable 属性的对象
 * @returns returns.observable - IntersectionObserver 实例，可用于观察和取消观察元素
 *
 * @example
 * ```typescript
 * // 基本使用
 * const { observable } = createIntersectionObserver(
 *   (entry) => {
 *     console.log('元素进入视口:', entry.target)
 *   },
 *   () => {
 *     console.log('元素离开视口')
 *   }
 * )
 *
 * // 观察元素
 * const targetElement = document.getElementById('target')
 * if (targetElement) {
 *   observable.observe(targetElement)
 * }
 *
 * // 取消观察
 * observable.unobserve(targetElement)
 *
 * // 断开观察器
 * observable.disconnect()
 * ```
 *
 * @example
 * ```typescript
 * // 无限滚动场景
 * const { observable } = createIntersectionObserver(
 *   () => {
 *     loadMoreData()
 *   },
 *   undefined,
 *   {
 *     root: null,
 *     rootMargin: '100px', // 提前100px触发
 *     threshold: 0.1
 *   }
 * )
 *
 * // 在 React 组件中使用
 * useEffect(() => {
 *   if (loadMoreRef.current) {
 *     observable.observe(loadMoreRef.current)
 *   }
 *   return () => {
 *     if (loadMoreRef.current) {
 *       observable.unobserve(loadMoreRef.current)
 *     }
 *   }
 * }, [])
 * ```
 *
 * @note 注意事项：
 * - 该函数内置了 200ms 的防抖机制，避免频繁触发回调
 * - 使用内部状态管理，确保进入视口的回调只在元素真正可见时触发
 * - 记得在不需要时调用 `unobserve` 或 `disconnect` 来清理资源
 * - 在 React 组件中使用时，建议在 `useEffect` 的清理函数中取消观察
 *
 * @since 1.0.0
 */
export const createIntersectionObserver = (
  inCallback: (entry: IntersectionObserverEntry) => void,
  outCallback?: () => void,
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  }
) => {
  // 内部状态，用于跟踪元素是否仍在视口内，以实现简易的防抖效果。
  // 目的是为了防止在元素快速进出视口时频繁触发回调。
  let status = false

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      // 当元素进入视口时，将状态标记为 true
      status = true
      // 设置一个短暂的延迟（200毫秒）
      setTimeout(() => {
        // 200毫秒后，如果元素仍然在视口内（status仍为true），则执行进入回调
        if (status) {
          if (inCallback) inCallback(entry)
        }
      }, 200)
    } else {
      // 当元素离开视口时，立即将状态标记为 false
      status = false
      if (outCallback) outCallback()
    }
  }

  const observable = new IntersectionObserver(handleIntersection, options)

  return {
    observable,
  }
}
