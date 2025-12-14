import { debounce } from 'lodash-es'
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * 滚动跟踪Hook的配置选项接口
 */
export interface UseScrollTrackingOptions<T> {
  /**
   * 要跟踪的项目列表
   * 这是一个泛型数组，可以是任何类型的数据集合
   */
  items: T[]

  /**
   * 从项目中提取唯一键的函数
   * 每个项目必须有一个唯一标识符，用于在DOM中跟踪和识别元素
   * @param item 列表中的单个项目
   * @returns 该项目的唯一键（字符串）
   */
  getItemKey: (item: T) => string

  /**
   * IntersectionObserver的根元素边距
   * 定义根元素的扩展或收缩边界，默认为 "0px"
   * 可用于提前或延后检测元素的可见性
   */
  rootMargin?: string

  /**
   * 可见性阈值数组
   * 定义元素被视为"可见"的百分比阈值，默认包含0.1-1.0的阈值
   */
  thresholds?: number[]

  /**
   * 当可见元素变化时的回调函数
   * @param itemKey 当前可见项目的键，如果没有可见项目则为null
   */
  onVisibleItemChange?: (itemKey: string | null) => void

  /**
   * 更新可见项目的延迟时间（毫秒）
   * 默认为 150ms
   */
  debounceDelay?: number
}

/**
 * 滚动跟踪Hook的返回结果接口
 */
export interface UseScrollTrackingResult<T, E extends HTMLElement> {
  /**
   * 容器引用
   * 应用于包含所有项目的外层容器元素
   */
  containerRef: RefObject<E>

  /**
   * 为每个项目创建的引用回调映射
   * 使用项目的唯一键作为Map的键，对应的回调函数用于获取DOM元素
   */
  itemRefCallbacks: Map<string, (element: E | null) => void>

  /**
   * 当前可见的项目键
   * 表示当前在视图中最明显的项目，如果没有可见项目则为null
   */
  currentVisibleItemKey: string | null

  /**
   * 滚动到指定项目的方法
   * @param itemKey 要滚动到的项目的唯一键
   */
  scrollToItem: (itemKey: string) => void

  /**
   * 获取当前可见项目的方法
   * @returns 当前可见的项目对象，如果没有可见项目则为null
   */
  getCurrentVisibleItem: () => T | null
}

/**
 * 通用滚动跟踪 Hook，用于跟踪容器内元素的可见性和滚动控制
 *
 * 该Hook利用IntersectionObserver API来监测元素的可见性，
 * 并提供滚动控制、元素可见性跟踪等功能。
 *
 * @param options - 滚动跟踪配置选项
 * @returns 滚动跟踪结果对象，包含引用、回调和控制方法
 *
 * @example
 * ```tsx
 * // 使用示例
 * const { containerRef, itemRefCallbacks, currentVisibleItemKey, scrollToItem } = useScrollTracking({
 *   items: myItems,
 *   getItemKey: item => item.id,
 *   onVisibleItemChange: (itemKey) => console.log(`当前可见项: ${itemKey}`)
 * });
 *
 * return (
 *   <div ref={containerRef} style={{ overflow: 'auto', height: '400px' }}>
 *     {myItems.map(item => (
 *       <div key={item.id} ref={itemRefCallbacks.get(item.id) || null}>
 *         {item.content}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useScrollTracking<T, E extends HTMLElement>({
  items,
  getItemKey,
  rootMargin = '0px',
  thresholds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
  onVisibleItemChange,
  debounceDelay = 150,
}: UseScrollTrackingOptions<T>): UseScrollTrackingResult<T, E> {
  /** 容器引用，用于存储包含所有跟踪项目的外层容器元素 */
  const containerRef = useRef<E>(null)

  /** 保存元素引用的Map，用于存储DOM元素引用，键为项目的唯一标识符 */
  const elementRefs = useRef<Map<string, HTMLElement>>(new Map())

  /** 存储已被IntersectionObserver观察的元素键集合，避免重复观察 */
  const observedElements = useRef<Set<string>>(new Set())

  /** 当前可见项目的唯一键，状态变化会触发组件重新渲染 */
  const [currentVisibleItemKey, setCurrentVisibleItemKey] = useState<string | null>(null)

  /** 标记是否正在进行编程式滚动 */
  const isProgrammaticScrollRef = useRef(false)

  /** 使用 lodash 的 debounce 创建防抖更新函数 */
  const debouncedUpdate = useRef(
    debounce((key: string) => {
      setCurrentVisibleItemKey(key)
      onVisibleItemChange?.(key)
    }, debounceDelay)
  ).current

  /** IntersectionObserver实例，用于观察元素的可见性变化 */
  const observer = useRef<IntersectionObserver | null>(null)

  /** 标记容器是否已挂载 */
  const [isContainerMounted, setIsContainerMounted] = useState(false)

  /**
   * 创建项目键到项目对象的映射，用于快速查找
   * 当items或getItemKey变化时重新计算
   */
  const itemMap = useMemo(() => {
    const map = new Map<string, T>()
    items.forEach((item) => {
      const key = getItemKey(item)
      map.set(key, item)
    })
    return map
  }, [items, getItemKey])

  /**
   * 监听容器挂载状态
   */
  useEffect(() => {
    if (containerRef.current) {
      setIsContainerMounted(true)
    } else {
      setIsContainerMounted(false)
    }

    // 返回清理函数
    return () => {
      setIsContainerMounted(false)
    }
  }, [containerRef.current])

  /**
   * 创建新的IntersectionObserver实例
   * 封装为函数以便重用
   */
  const createObserver = useCallback(() => {
    // 如果容器不存在，则不创建observer
    if (!containerRef.current) return null

    // 断开现有的观察者连接
    if (observer.current) {
      observer.current.disconnect()
      observedElements.current.clear()
    }

    // 创建新的IntersectionObserver实例
    const newObserver = new IntersectionObserver(
      (entries) => {
        // 如果正在进行编程式滚动，不处理交叉观察
        if (isProgrammaticScrollRef.current) {
          return
        }

        console.log('IntersectionObserver callback triggered with entries:', entries)

        // 过滤出可见的元素（isIntersecting为true的元素）
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)

        if (visibleEntries.length > 0) {
          // 获取可见度最高的元素（intersectionRatio值最大的元素）
          const mostVisible = visibleEntries.reduce((prev, current) =>
            current.intersectionRatio > prev.intersectionRatio ? current : prev
          )

          // 从元素的data-key属性中获取项目的唯一键
          const key = mostVisible.target.getAttribute('data-key')
          if (key) {
            console.log('Visible element detected with key:', key)
            debouncedUpdate(key)
          }
        }
      },
      {
        root: containerRef.current,
        rootMargin,
        threshold: thresholds,
      }
    )

    // 重新观察所有已存在的元素
    elementRefs.current.forEach((element, key) => {
      newObserver.observe(element)
      observedElements.current.add(key)
      console.log('Re-observing element with key:', key)
    })

    return newObserver
  }, [rootMargin, thresholds, debouncedUpdate])

  /**
   * 初始化或重新初始化 IntersectionObserver
   * 这个效果在容器挂载状态、rootMargin、thresholds或onVisibleItemChange变化时重新执行
   */
  useEffect(() => {
    // 只有当容器挂载后才创建observer
    if (isContainerMounted) {
      console.log('Creating IntersectionObserver with container:', containerRef.current)
      observer.current = createObserver()
    }

    // 返回清理函数，在组件卸载或依赖项变化时执行
    return () => {
      if (observer.current) {
        console.log('Disconnecting IntersectionObserver')
        // 断开所有观察，释放资源
        observer.current.disconnect()
        observer.current = null
      }
    }
  }, [isContainerMounted, createObserver])

  /**
   * 滚动到指定项目的方法
   * @param itemKey 要滚动到的项目的唯一键
   */
  const scrollToItem = useCallback(
    (itemKey: string) => {
      // 从已保存的元素引用中获取对应的DOM元素
      const element = elementRefs.current.get(itemKey.toString())
      if (element && containerRef.current) {
        console.log('Scrolling to item:', itemKey)

        // 标记开始编程式滚动
        isProgrammaticScrollRef.current = true

        // 使用scrollIntoView方法平滑滚动到目标元素
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })

        // 使用相同的防抖函数处理编程式滚动
        debouncedUpdate(itemKey)

        // 在滚动动画完成后重置编程式滚动标记
        setTimeout(() => {
          isProgrammaticScrollRef.current = false
        }, debounceDelay)
      } else {
        console.warn('Cannot scroll to item, element or container not found:', itemKey)
      }
    },
    [debouncedUpdate, debounceDelay]
  )

  /**
   * 获取当前可见项目的方法
   * @returns 当前可见的项目对象，如果没有可见项目则为null
   */
  const getCurrentVisibleItem = useCallback((): T | null => {
    if (currentVisibleItemKey === null) return null
    // 从项目映射中查找当前可见键对应的项目对象
    return itemMap.get(currentVisibleItemKey) || null
  }, [currentVisibleItemKey, itemMap])

  /** 存储每个项目的引用回调函数的Map */
  const itemRefCallbacks = useRef<Map<string, (element: HTMLElement | null) => void>>(new Map())

  // 为每个项目创建或更新引用回调
  items.forEach((item) => {
    const key = getItemKey(item).toString()

    // 如果该项目尚未有回调函数，则创建一个新的
    if (!itemRefCallbacks.current.has(key)) {
      itemRefCallbacks.current.set(key, (element: HTMLElement | null) => {
        if (element) {
          console.log('Element ref callback called for key:', key)
          // 元素存在：存储元素引用并设置data-key属性
          elementRefs.current.set(key, element)
          // 添加data-key属性，用于在IntersectionObserver回调中识别元素
          element.setAttribute('data-key', key.toString())

          // 如果尚未观察该元素，则开始观察
          if (!observedElements.current.has(key) && observer.current) {
            console.log('Observing element with key:', key)
            observer.current.observe(element)
            observedElements.current.add(key)
          }
        } else {
          // 元素被卸载：停止观察并清理引用
          if (observedElements.current.has(key) && observer.current) {
            console.log('Unobserving element with key:', key)
            // 获取旧元素并停止观察
            const oldElement = elementRefs.current.get(key)
            if (oldElement) {
              observer.current.unobserve(oldElement)
            }
            // 从已观察集合和元素引用Map中移除
            observedElements.current.delete(key)
            elementRefs.current.delete(key)
          }
        }
      })
    }
  })

  // 清理防抖函数
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel()
    }
  }, [debouncedUpdate])

  // 返回Hook的结果对象
  return {
    containerRef, // 容器引用
    itemRefCallbacks: itemRefCallbacks.current, // 项目引用回调映射
    currentVisibleItemKey, // 当前可见项目键
    scrollToItem, // 滚动到指定项目的方法
    getCurrentVisibleItem, // 获取当前可见项目的方法
  }
}
