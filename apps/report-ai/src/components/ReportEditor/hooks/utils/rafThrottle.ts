/**
 * RAF 节流工具
 *
 * @description 使用 requestAnimationFrame 实现的节流工具，适用于频繁的 DOM 操作
 */

/**
 * RAF 节流函数类型
 */
export type RafThrottledFunction<T extends (...args: any[]) => void> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

/**
 * 创建 RAF 节流函数
 *
 * @param fn 要节流的函数
 * @param frameWindow 使用的 window 对象（支持 iframe）
 * @returns 节流后的函数
 *
 * @example
 * ```ts
 * const handleMove = createRafThrottle((x: number, y: number) => {
 *   console.log(x, y);
 * }, window);
 *
 * // 使用
 * element.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
 *
 * // 清理
 * handleMove.cancel();
 * ```
 */
export const createRafThrottle = <T extends (...args: any[]) => void>(
  fn: T,
  frameWindow: Window = window
): RafThrottledFunction<T> => {
  let rafId: number | null = null;

  const throttled = (...args: Parameters<T>) => {
    if (rafId !== null) {
      frameWindow.cancelAnimationFrame(rafId);
    }

    rafId = frameWindow.requestAnimationFrame(() => {
      rafId = null;
      fn(...args);
    });
  };

  throttled.cancel = () => {
    if (rafId !== null) {
      frameWindow.cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  return throttled as RafThrottledFunction<T>;
};
