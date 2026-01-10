import { findChapterDOMById } from '@/domain/reportEditor/chapter/query';
import type { EditorFacade } from '@/domain/reportEditor/editor';
import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChapterLoadingOverlayState } from './useChapterLoadingOverlay';

interface Options {
  activeChapters: ChapterLoadingOverlayState[];
  registerRenderer?: (renderer: { id: string; render: () => void }) => () => void;
  requestRender?: () => void;
}

interface AutoScrollControl {
  /**
   * 手动跳转到生成位置
   * @description 滚动到当前正在生成的内容，并恢复自动滚动
   */
  scrollToGenerating: () => void;

  /**
   * 用户是否已手动滚动
   * @description 用于判断是否显示跳转按钮
   */
  userHasScrolled: boolean;
}

/**
 * 自动滚动（流式生成）
 *
 * @description
 * 在 AIGC 流式生成内容时，基于用户滚动意图智能控制自动滚动。
 *
 * ## 核心策略
 *
 * 1. **默认自动跟随**：生成开始时，如果用户未手动滚动过，自动滚动跟随生成内容
 * 2. **尊重用户意图**：一旦用户手动滚动，停止自动滚动，避免打断用户操作
 * 3. **手动恢复**：提供 `scrollToGenerating()` 方法，让用户可以随时回到生成内容处并恢复自动滚动
 * 4. **新轮次重置**：每次新的生成开始时，重置滚动标记，恢复自动滚动
 *
 * ## 工作原理
 *
 * ### 1. 用户滚动意图检测
 * ```
 * 监听 iframe 内部的 scroll 事件
 *   ↓
 * 判断是否有正在生成的章节
 *   ↓
 * 如果有，设置 userHasScrolled = true
 *   ↓
 * 停止自动滚动
 * ```
 *
 * ### 2. 自动滚动执行
 * ```
 * activeChapters 变化
 *   ↓
 * 如果是新一轮生成，重置 userHasScrolled = false
 *   ↓
 * requestRender() 触发 RAF
 *   ↓
 * renderAutoScroll() 执行
 *   ↓
 * 检查 userHasScrolled，如果为 true 则跳过
 *   ↓
 * 找到最底部的生成元素
 *   ↓
 * 滚动到视口下方 3/4 处
 * ```
 *
 * ### 3. 手动跳转
 * ```
 * 用户点击跳转按钮
 *   ↓
 * scrollToGenerating() 被调用
 *   ↓
 * 重置 userHasScrolled = false
 *   ↓
 * 立即触发滚动
 *   ↓
 * 恢复自动滚动
 * ```
 *
 * @example
 * ```tsx
 * // 在 ReportEditor 中使用
 * const { registerRenderer, requestRender } = useExternalComponentRenderer(...);
 *
 * const { scrollToGenerating, userHasScrolled } = useAutoScrollOnStreaming(editorRef, {
 *   activeChapters: aigcLoadingChapters,
 *   registerRenderer,
 *   requestRender,
 * });
 *
 * // 显示跳转按钮
 * {userHasScrolled && hasActiveChapters && (
 *   <Button onClick={scrollToGenerating}>跳转到生成位置</Button>
 * )}
 * ```
 *
 * @see /apps/report-ai/docs/specs/aigc-auto-scroll-optimization/spec-core-v1.md
 */
export const useAutoScrollOnStreaming = (
  editorRef: RefObject<EditorFacade | null>,
  options: Options
): AutoScrollControl => {
  const { activeChapters = [], registerRenderer, requestRender } = options;

  // 使用 ref 存储最新的 activeChapters，避免 renderAutoScroll 频繁重建
  const activeChaptersRef = useRef<ChapterLoadingOverlayState[]>([]);

  // 用户是否已手动滚动（用于停止自动滚动）
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const userHasScrolledRef = useRef(false);

  // 是否正在执行自动滚动（用于区分自动滚动和手动滚动）
  const isAutoScrollingRef = useRef(false);

  // 上一次是否有活跃章节（用于检测新一轮生成开始）
  const prevHasActiveChaptersRef = useRef(false);

  /**
   * 计算流式生成的目标元素
   *
   * @description
   * 找到所有正在生成的章节（status 为 'pending' 或 'receiving'），
   * 返回其中位置最靠下的元素。
   *
   * @returns
   * - element: 最底部的生成元素（用于后续滚动）
   * - bottomInIframe: 该元素底部相对于 iframe 内部视口的坐标
   */
  const computeStreamingTargetElement = useCallback((): {
    element: HTMLElement | null;
    bottomInIframe: number;
  } => {
    const editor = editorRef.current;
    if (!editor) return { element: null, bottomInIframe: 0 };

    // 筛选出正在生成的章节
    const generating = activeChaptersRef.current.filter((c) => c.status === 'pending' || c.status === 'receiving');
    if (generating.length === 0) return { element: null, bottomInIframe: 0 };

    let targetBottom = 0;
    let targetElement: HTMLElement | null = null;

    // 遍历所有正在生成的章节，找到最底部的元素
    generating.forEach(({ chapterId }) => {
      const dom = findChapterDOMById(editor, chapterId);
      if (!dom.found) return;

      // 默认使用章节标题元素
      let el = dom.headingElement as HTMLElement;

      // 尝试找到章节内容的最后一个元素节点（更准确的底部位置）
      const nodes = dom.contentNodes;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (n.nodeType === Node.ELEMENT_NODE) {
          el = n as HTMLElement;
          break;
        }
      }

      // 计算元素在 iframe 内部的位置（相对于 iframe 的 document）
      const rect = el.getBoundingClientRect();

      // 记录最底部的元素
      if (rect.bottom > targetBottom) {
        targetBottom = rect.bottom;
        targetElement = el;
      }
    });

    return { element: targetElement, bottomInIframe: targetBottom };
  }, [editorRef]);

  /**
   * 执行滚动到生成位置
   *
   * @description
   * 将生成内容的底部滚动到视口下方 3/4 处（距离顶部 75%）
   */
  const performScroll = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // 获取 iframe 内部的 window 对象
    const doc = editor.getDocument();
    const editorWindow = doc?.defaultView;
    if (!editorWindow) return;

    // 找到正在生成的最底部元素
    const { element, bottomInIframe } = computeStreamingTargetElement();
    if (!element) return; // 没有正在生成的章节

    try {
      // 标记正在执行自动滚动
      isAutoScrollingRef.current = true;

      // 计算需要滚动到的位置
      // 让生成内容的底部位于视口的下方 3/4 处（即距离顶部 75% 的位置）
      const targetScrollY = bottomInIframe - editorWindow.innerHeight * 0.75;

      // 只有当需要向下滚动时才执行（避免向上滚动）
      if (targetScrollY > editorWindow.scrollY) {
        editorWindow.scrollTo({
          top: targetScrollY,
          behavior: 'smooth', // 平滑滚动
        });
      }

      // 延迟重置标记，等待滚动动画完成
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 500);
    } catch (error) {
      console.warn('[AutoScroll] Failed to scroll:', error);
      isAutoScrollingRef.current = false;
    }
  }, [editorRef, computeStreamingTargetElement]);

  /**
   * 执行自动滚动的渲染函数
   *
   * @description
   * 这个函数会被注册到 `useExternalComponentRenderer` 的调度系统中，
   * 在每次 RAF 中与其他外部组件一起执行。
   *
   * 执行流程：
   * 1. 检查用户是否已手动滚动，如果是则跳过
   * 2. 执行滚动到生成位置
   */
  const renderAutoScroll = useCallback(() => {
    // 如果用户已手动滚动，停止自动滚动
    if (userHasScrolledRef.current) return;

    // 执行滚动
    performScroll();
  }, [performScroll]);

  /**
   * 手动跳转到生成位置
   *
   * @description
   * 用户点击跳转按钮时调用，重置滚动标记并立即滚动到生成位置
   */
  const scrollToGenerating = useCallback(() => {
    // 重置用户滚动标记，恢复自动滚动
    setUserHasScrolled(false);
    userHasScrolledRef.current = false;

    // 立即执行滚动
    performScroll();
  }, [performScroll]);

  /**
   * 监听用户手动滚动
   *
   * @description
   * 在 iframe 内部监听 scroll 事件，检测用户的手动滚动行为
   */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const doc = editor.getDocument();
    const editorWindow = doc?.defaultView;
    if (!editorWindow) return;

    const handleScroll = () => {
      // 如果正在执行自动滚动，忽略此次 scroll 事件
      if (isAutoScrollingRef.current) return;

      // 只有在有活跃章节时，才标记用户手动滚动
      const hasActiveChapters = activeChaptersRef.current.some(
        (c) => c.status === 'pending' || c.status === 'receiving'
      );

      if (hasActiveChapters) {
        setUserHasScrolled(true);
        userHasScrolledRef.current = true;
      }
    };

    // 监听滚动事件（passive 优化性能）
    editorWindow.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      editorWindow.removeEventListener('scroll', handleScroll);
    };
  }, [editorRef]);

  /**
   * 监听 activeChapters 变化
   *
   * @description
   * 1. 检测新一轮生成开始，重置滚动标记
   * 2. 更新 ref 中的最新状态
   * 3. 触发渲染
   */
  useEffect(() => {
    const hasActiveChapters = activeChapters.length > 0;
    const prevHasActiveChapters = prevHasActiveChaptersRef.current;

    // 检测新一轮生成开始：从无活跃章节变为有活跃章节
    if (hasActiveChapters && !prevHasActiveChapters) {
      // 重置用户滚动标记，恢复自动滚动
      setUserHasScrolled(false);
      userHasScrolledRef.current = false;
    }

    // 更新状态
    activeChaptersRef.current = activeChapters;
    prevHasActiveChaptersRef.current = hasActiveChapters;

    // 触发渲染
    requestRender?.();
  }, [activeChapters, requestRender]);

  /**
   * 注册到统一渲染器
   *
   * @description
   * 将 renderAutoScroll 函数注册到 `useExternalComponentRenderer` 的调度系统中。
   * 之后每次 RAF 执行时，都会调用 renderAutoScroll 检查是否需要滚动。
   */
  useEffect(() => {
    if (!registerRenderer) return;

    // 注册渲染器，id 用于调试和日志
    const unregister = registerRenderer({
      id: 'auto-scroll-on-streaming',
      render: renderAutoScroll,
    });

    // 组件卸载时注销
    return () => unregister();
  }, [registerRenderer, renderAutoScroll]);

  return {
    scrollToGenerating,
    userHasScrolled,
  };
};
