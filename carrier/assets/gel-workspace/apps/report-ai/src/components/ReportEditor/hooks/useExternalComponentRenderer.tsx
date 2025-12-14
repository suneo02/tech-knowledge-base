import type { EditorFacade } from '@/domain/reportEditor/editor';
import { useUpdateEffect } from 'ahooks';
import { RefObject, useCallback, useEffect, useRef } from 'react';
import { useAIGCButton } from './useAIGCButton';
import { useChapterHoverWithInit } from './useChapterHoverWithInit';
import { useChapterLoadingOverlay, type ChapterLoadingOverlayState } from './useChapterLoadingOverlay';

/**
 * requestAnimationFrame 的 polyfill 实现，兼容 SSR 和测试环境
 *
 * @description 在浏览器环境使用原生 RAF，在 Node 环境降级为 setTimeout
 * @param cb - 需要在下一帧执行的回调函数
 * @returns RAF handle，用于取消调度
 */
const scheduleFrame = (cb: () => void): number => {
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame(cb);
  }
  return window.setTimeout(cb, 16) as unknown as number;
};

/**
 * cancelAnimationFrame 的 polyfill 实现
 *
 * @description 取消通过 scheduleFrame 调度的任务
 * @param handle - scheduleFrame 返回的句柄
 */
const cancelFrame = (handle: number | null) => {
  if (handle === null) return;
  if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(handle);
  } else {
    window.clearTimeout(handle as unknown as number);
  }
};

/**
 * 外部组件渲染器的配置选项
 *
 * @description 定义外部组件渲染器的配置参数，用于协调编辑器外部的所有浮层组件
 * @see apps/report-ai/docs/RPDetail/RPEditor/external-component-rendering.md
 * @see apps/report-ai/docs/specs/chapter-title-loading-indicator/spec-core-v1.md
 * @since 1.0.0
 */
export interface UseExternalComponentRendererOptions {
  /**
   * 停止生成的回调函数
   * @description 当用户点击 Loading 指示器的"停止"按钮时触发
   */
  onStop?: (sectionId: string) => void;

  /**
   * Citation 悬停回调
   * @description 当用户 hover/聚焦 Citation 摘要时加载明细内容（返回 HTML 片段或空字符串）
   * @deprecated 当前版本未使用，保留用于未来扩展
   */
  onCitationHover?: (sectionId: string) => Promise<string | void> | string | void;

  /**
   * AIGC 按钮点击回调
   * @description 当用户点击章节标题旁的 AIGC 按钮时触发
   */
  onAIGCButtonClick?: (chapterId: string) => void;

  /**
   * AIGC 按钮是否禁用
   * @description 控制所有章节的 AIGC 按钮是否可点击（例如全局生成中时禁用）
   */
  aigcButtonDisabled?: boolean;

  /**
   * 章节 Loading 状态输入（由外部状态驱动）
   * @description 业务层传入需要显示 Loading 的章节列表，由 Redux 状态计算得出
   * @example
   * ```ts
   * const loadingChapters = useMemo(
   *   () => Object.entries(chapterStatusMap)
   *     .filter(([, status]) => status === 'pending' || status === 'receiving')
   *     .map(([chapterId, status]) => ({ chapterId, status })),
   *   [chapterStatusMap]
   * );
   * ```
   */
  chapterLoadingChapters?: ChapterLoadingOverlayState[];
}

/**
 * 外部组件渲染器 Hook
 *
 * @description
 * 统一调度编辑器外部的所有浮层组件（AIGC 按钮、Loading 指示器等）的渲染。
 *
 * 核心职责：
 * 1. 提供渲染器注册机制，允许各个外部组件 hook 注册自己的渲染函数
 * 2. 通过 microtask + RAF 合并所有渲染请求，避免多次重复渲染
 * 3. 协调 hover 状态、章节状态等共享数据，避免各组件独立订阅
 *
 * 架构优势：
 * - 单一调度器：所有外部组件共享一个 RAF 循环，避免竞争条件
 * - 可扩展性：新增外部组件只需调用 registerRenderer，无需修改此 hook
 * - 性能优化：通过 microtask 延迟确保 TinyMCE DOM 更新完成后再读取位置
 *
 * @param editorRef - 编辑器 facade 引用
 * @param options - 配置选项，包含各种回调和状态
 * @returns 渲染控制接口
 *
 * @see apps/report-ai/docs/specs/chapter-title-loading-indicator/spec-core-v1.md
 * @since 1.0.0
 */
export const useExternalComponentRenderer = (
  editorRef: RefObject<EditorFacade | null>,
  options: UseExternalComponentRendererOptions = {}
) => {
  /**
   * 渲染器注册表
   *
   * @description
   * 存储所有已注册的外部组件渲染函数。
   * Key 为组件唯一标识（如 'aigc-button', 'chapter-loading-overlay'）
   * Value 为该组件的渲染函数
   *
   * 设计理由：
   * - 避免硬编码组件列表，支持动态注册/注销
   * - 通过 Map 保证渲染顺序稳定（插入顺序）
   * - 便于错误隔离：单个渲染器失败不影响其他组件
   */
  const rendererRegistryRef = useRef<Map<string, () => void>>(new Map());

  /**
   * RAF 调度句柄
   *
   * @description
   * 存储当前待执行的 RAF 任务句柄，用于防抖和取消。
   * 如果已有待执行任务，新的 requestRender 调用会被忽略。
   */
  const rafHandleRef = useRef<number | null>(null);

  /**
   * 章节 hover 状态管理
   *
   * @description
   * 监听用户鼠标悬停在章节标题上的状态，用于显示 AIGC 按钮。
   * initializeHoverDetection 需要在编辑器初始化后调用。
   */
  const { hoveredChapter, initializeHoverDetection } = useChapterHoverWithInit(editorRef);

  /**
   * 请求一次批量渲染
   *
   * @description
   * 发起一次外部组件的批量渲染，采用 microtask + RAF 的两阶段调度策略。
   *
   * 调度流程：
   * 1. 调用 requestRender()
   * 2. 进入 microtask 队列（queueMicrotask 或 Promise.resolve）
   * 3. 在 microtask 中调度 RAF
   * 4. 在下一帧执行所有注册的渲染函数
   *
   * 设计理由：
   * - **防抖**：如果已有待执行任务，直接返回，避免重复调度
   * - **延迟执行**：通过 microtask 确保 TinyMCE 的 DOM 更新已完成
   * - **批量渲染**：在一个 RAF 中执行所有渲染器，减少重排/重绘次数
   * - **错误隔离**：单个渲染器失败不影响其他组件
   *
   * 为什么需要 microtask + RAF？
   * - TinyMCE 的流式内容更新是同步的，但可能触发多次 DOM 变更
   * - microtask 确保所有同步 DOM 操作完成后再读取位置
   * - RAF 确保在浏览器重绘前完成所有外部组件的位置计算和渲染
   *
   * @example
   * ```ts
   * // 业务代码多次调用，但只会触发一次渲染
   * requestRender(); // 调度 RAF
   * requestRender(); // 被忽略（已有待执行任务）
   * requestRender(); // 被忽略
   * // ... 在下一帧统一执行所有渲染器
   * ```
   */
  const requestRender = useCallback(() => {
    // 防抖：如果已有待执行的 RAF 任务，直接返回
    if (rafHandleRef.current !== null) {
      return;
    }

    /**
     * RAF 回调：执行所有注册的渲染器
     */
    const run = () => {
      rafHandleRef.current = null;

      // 遍历所有注册的渲染器并执行
      rendererRegistryRef.current.forEach((render, id) => {
        try {
          render();
        } catch (error) {
          // 错误隔离：单个渲染器失败不影响其他组件
          console.error(`[ExternalComponentRenderer] Renderer "${id}" failed:`, error);
        }
      });
    };

    /**
     * 调度函数：在 microtask 中注册 RAF
     */
    const schedule = () => {
      rafHandleRef.current = scheduleFrame(run);
    };

    // 使用 microtask 延迟调度，确保 DOM 更新完成
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(schedule);
    } else {
      // 降级方案：使用 Promise.resolve
      Promise.resolve().then(schedule);
    }
  }, []);

  /**
   * 注册外部组件渲染器
   *
   * @description
   * 提供给各个外部组件 hook（如 useChapterLoadingOverlay、useAIGCButton）调用，
   * 将自己的渲染函数注册到统一的调度器中。
   *
   * 使用方式：
   * ```ts
   * useEffect(() => {
   *   const unregister = registerRenderer({
   *     id: 'my-component',
   *     render: () => { ... }
   *   });
   *   return unregister; // 组件卸载时自动注销
   * }, [registerRenderer]);
   * ```
   *
   * 设计理由：
   * - **统一调度**：所有外部组件共享一个 RAF 循环，避免各自调度导致的性能问题
   * - **自动清理**：返回注销函数，配合 useEffect 实现自动资源回收
   * - **即时生效**：注册后立即触发一次渲染，确保组件及时显示
   *
   * @param renderer - 渲染器配置
   * @param renderer.id - 渲染器唯一标识（如 'aigc-button', 'chapter-loading-overlay'）
   * @param renderer.render - 渲染函数，会在每次 RAF 中被调用
   * @returns 注销函数，调用后从注册表中移除该渲染器
   */
  const registerRenderer = useCallback(
    (renderer: { id: string; render: () => void }) => {
      // 注册渲染器
      rendererRegistryRef.current.set(renderer.id, renderer.render);

      // 立即触发一次渲染，确保新注册的组件能及时显示
      requestRender();

      // 返回注销函数
      return () => {
        rendererRegistryRef.current.delete(renderer.id);
        // 注销后也触发一次渲染，清理可能残留的 DOM
        requestRender();
      };
    },
    [requestRender]
  );

  /**
   * 内部渲染触发器
   *
   * @description
   * 用于在特定时机触发外部组件重新渲染。
   *
   * 触发时机：
   * - 编辑器内容变化（ContentSet 事件）
   * - 章节 hover 状态变化
   * - 章节 Loading 状态变化（通过 props 传入）
   *
   * 注意：此方法仅供内部使用，外部组件完全由 props 和内部状态驱动，无需手动调用。
   */
  const renderComponents = useCallback(() => {
    requestRender();
  }, [requestRender]);

  /**
   * AIGC 按钮渲染 hook
   *
   * @description
   * 负责在章节标题旁渲染 AIGC 操作按钮。
   * 使用注册器模式，与 Loading Overlay 保持一致。
   * 按钮的显示/隐藏由 hoveredChapter 状态控制。
   */
  useAIGCButton(editorRef, {
    hoveredChapter,
    onClick: options.onAIGCButtonClick,
    disabled: options.aigcButtonDisabled,
    registerRenderer,
    requestRender,
  });

  /**
   * 注册章节 Loading 指示器
   *
   * @description
   * 调用 useChapterLoadingOverlay hook，该 hook 内部会：
   * 1. 调用 registerRenderer 注册自己的渲染函数
   * 2. 监听 activeChapters 状态变化
   * 3. 在章节进入 pending/receiving 状态时显示 Loading
   * 4. 在章节完成时移除 Loading
   *
   * 改动必要性：
   * - 旧版使用 useLoadingPlaceholders，需要在编辑器 DOM 中插入占位节点
   * - 新版使用外部浮层，不污染编辑器内容，且支持统一调度
   */
  useChapterLoadingOverlay(editorRef, {
    onStop: options.onStop,
    registerRenderer,
    requestRender,
    activeChapters: options.chapterLoadingChapters ?? [],
  });

  /**
   * 监听编辑器就绪状态，自动触发首次渲染
   *
   * @description
   * 当编辑器从未初始化变为已初始化时，触发一次渲染。
   * 使用 useUpdateEffect 避免首次挂载时执行（此时编辑器还未就绪）。
   */
  useUpdateEffect(() => {
    if (editorRef.current && editorRef.current.getBody()) {
      renderComponents();
    }
  }, [editorRef, renderComponents]);

  /**
   * 组件卸载时清理 RAF 任务
   *
   * @description
   * 避免组件卸载后仍有待执行的 RAF 回调，防止内存泄漏和错误。
   */
  useEffect(
    () => () => {
      cancelFrame(rafHandleRef.current);
    },
    []
  );

  return {
    /**
     * 内部渲染触发器
     * @description 用于在 ContentSet 等事件中触发外部组件重新渲染
     */
    renderComponents,

    /**
     * 初始化 hover 检测
     * @description 需要在编辑器初始化后调用，用于监听章节标题的鼠标事件
     */
    initializeHoverDetection,
  };
};
