import { MutableRefObject, useEffect, useState } from 'react'

/**
 * 管理级联选择器打开状态的自定义 Hook
 *
 * 这个 Hook 解决了 Cascader 组件的特殊控制需求：
 * 1. 必须在 DOM 元素（ref.current）可用后才能设置 open 状态
 * 2. 同时支持受控和非受控模式
 * 3. 确保外部传入的 open 属性优先级高于内部状态
 * 4. 无论受控还是非受控，都必须等待 ref.current 可用后才能真正打开
 *
 * 该 Hook 比普通的受控状态 Hook 更复杂，因为它需要处理元素挂载时机和状态同步的问题。
 */
export const useCascadeOpenState = (props: {
  /** DOM 元素的引用，必须等待其可用才能设置 open 状态 */
  ref: MutableRefObject<HTMLElement | null>
  /** 默认的打开状态（非受控模式） */
  defaultOpen?: boolean
  /** 外部控制的打开状态（受控模式） */
  open?: boolean
  /** 打开状态变化的回调函数 */
  onOpenChange?: (open: boolean) => void
}) => {
  const { ref, defaultOpen, open: propOpen, onOpenChange } = props
  // 内部状态，仅在非受控模式下使用
  const [internalOpen, setInternalOpen] = useState(false)
  // 标记组件是否已完成初始化
  const [hasInitialized, setHasInitialized] = useState(false)

  /**
   * 确定最终的打开状态
   *
   * 关键点：
   * 1. 无论是受控还是非受控模式，都必须等待 ref.current 存在才能真正打开
   * 2. 如果 ref.current 不存在，始终返回 false（关闭状态）
   * 3. 如果 ref.current 存在，则根据受控/非受控模式决定使用哪个值
   */
  const open = !ref.current
    ? false // ref 不存在，强制关闭状态
    : propOpen !== undefined
      ? propOpen // 受控模式
      : internalOpen // 非受控模式

  /**
   * 设置打开状态的函数
   *
   * 当用户交互触发状态变化时：
   * 1. 在非受控模式下，更新内部状态
   * 2. 在受控模式下，仅触发回调，由外部决定是否更新状态
   * 3. 无论哪种模式，都调用 onOpenChange 回调
   * 4. 只有当 ref.current 存在时，才允许设置为打开状态
   */
  const setOpen = (value: boolean) => {
    // 如果尝试打开，但 ref.current 不存在，则拒绝此操作
    if (value && !ref.current) {
      console.warn('无法打开级联选择器：DOM 元素尚未挂载')
      return
    }

    // 只有在非受控模式下才更新内部状态
    if (propOpen === undefined) {
      setInternalOpen(value)
    }

    // 始终调用回调，让外部可以响应变化
    onOpenChange?.(value)
  }

  /**
   * 初始化打开状态的副作用
   *
   * 关键点：只有当 ref.current 可用时才设置初始状态
   * 这是因为 Cascader 组件要求 DOM 元素必须存在才能正确设置打开状态
   */
  useEffect(() => {
    if (ref.current && !hasInitialized) {
      // 只有在非受控模式下才设置初始状态
      if (propOpen === undefined && defaultOpen) {
        setInternalOpen(true)
      }
      // 标记初始化完成
      setHasInitialized(true)
    }
  }, [ref.current, defaultOpen, hasInitialized, propOpen])

  return {
    open, // 最终的打开状态
    setOpen, // 设置打开状态的函数
  }
}
