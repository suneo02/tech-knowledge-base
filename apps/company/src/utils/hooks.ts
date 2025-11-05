import { useEffect } from 'react'

/**
 * modal 关闭时 重置 form
 * @param {*} open
 * @param {import('@wind/wind-ui-form').FormInstance} form
 */
export const useResetFormOnModalClose = (open, form) => {
  useEffect(() => {
    if (!open) {
      form.resetFields()
    }
  }, [open, form])
}

/**
 * 自定义 Hook，用于检测点击目标元素外部的事件
 * @param ref - 目标元素的 React ref 对象
 * @param handler - 点击外部时触发的回调函数
 * @param excludeClassNames - 需要排除的元素类名数组（点击这些类名的元素不会触发关闭）
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const ref = useRef(null);
 *   useClickOutside(ref, () => {
 *     console.log('点击了外部');
 *   }, ['picker', 'datepicker']);
 *   return <div ref={ref}>目标元素</div>;
 * }
 * ```
 */
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent) => void,
  excludeClassNames: string[] = []
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent): void => {
      if (!ref.current) {
        return
      }
      const target = event.target as HTMLElement
      // 检查点击的元素是否包含需要排除的类名
      const isExcluded = excludeClassNames.some((className) => {
        // 检查元素本身及其所有父元素是否包含排除的类名
        return target.closest(`.${className}`) !== null
      })
      // 如果点击的是排除的元素，则不触发关闭
      if (isExcluded) {
        return
      }
      // 检查点击是否在目标元素内部
      if (ref.current.contains(target)) {
        return
      }
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
    }
  }, [ref, handler, excludeClassNames])
}
