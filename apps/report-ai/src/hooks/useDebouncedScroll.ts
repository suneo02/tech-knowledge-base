import { useDebounceFn, useScroll } from 'ahooks';
import { RefObject, useEffect, useRef } from 'react';

/**
 * 防抖滚动 Hook 属性
 */
interface UseDebouncedScrollOptions {
  /** 滚动事件处理函数 */
  onScroll: () => void;
  /** 防抖等待时间（毫秒），默认 100ms */
  wait?: number;
}

/**
 * 防抖滚动监听 Hook
 * 使用 ahooks 的 useScroll 和 useDebounceFn 实现高性能的滚动监听
 *
 * @param target - 目标元素引用
 * @param options - 配置选项
 * @returns 目标元素引用（用于绑定到 DOM）
 *
 * @example
 * ```tsx
 * const scrollRef = useDebouncedScroll({
 *   onScroll: () => {
 *     console.log('Scrolled!');
 *   },
 *   wait: 100
 * });
 *
 * return <div ref={scrollRef}>...</div>;
 * ```
 */
export const useDebouncedScroll = <T extends HTMLElement = HTMLDivElement>(
  options: UseDebouncedScrollOptions
): RefObject<T> => {
  const { onScroll, wait = 100 } = options;

  const scrollRef = useRef<T>(null);

  // 使用 ahooks 的 useScroll 监听滚动位置
  const scroll = useScroll(scrollRef);

  // 使用 ahooks 的 useDebounceFn 进行防抖处理
  const { run: handleScroll } = useDebounceFn(onScroll, { wait });

  // 监听滚动位置变化
  useEffect(() => {
    if (scroll) {
      handleScroll();
    }
  }, [scroll, handleScroll]);

  return scrollRef;
};
