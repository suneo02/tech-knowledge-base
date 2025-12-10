import { updateChapterOrdinals } from '@/domain/reportEditor';
import { ApplyIdMapResult, applySectionIdMap, ensureSectionIds } from '@/domain/reportEditor/chapterId';
import type { EditorFacade } from '@/domain/reportEditor/editor';
import { useCallback, useEffect, useRef } from 'react';

/**
 * 统一的编辑器 DOM 同步 Hook
 *
 * 职责：
 * - 提供章节 ID 与章节编号的同步入口
 * - 在内容变化、命令式写入时保持 DOM 幂等
 * - 避免循环触发和重复执行
 *
 * 设计原则：
 * - 单一职责：只负责 DOM 同步，不处理业务逻辑
 * - 事件驱动：由调用方在合适的时机显式调度，内部用 RAF 合并请求
 * - 防重入：使用标记避免重复执行
 * - 纯函数驱动：所有 DOM 操作都通过纯函数完成
 *
 * 与旧架构的区别：
 * - 旧架构：SectionIdMaintainer + ChapterOrdinalCoordinator（两个 Class，两个 Observer）
 * - 新架构：useEditorDomSync（一个 Hook，一套纯函数，同步由事件驱动）
 *
 * 优势：
 * - 移除 MutationObserver 轮询，执行时机更可控
 * - 重入控制简单，便于调试
 * - 逻辑更清晰，易于理解和维护
 * - 易于测试（纯函数）
 */

/** 编辑器 DOM 同步选项 */
export interface UseEditorDomSyncOptions {
  /** 是否打印调试信息 */
  debug?: boolean;
}

/** 单次同步请求选项 */
export interface EditorDomSyncOptions {
  /** 是否以静默模式执行（不会写入撤销栈或触发编辑事件） */
  silent?: boolean;
}

/** 编辑器 DOM 同步句柄 */
export interface UseEditorDomSyncHandles {
  /** 立即执行同步（不等待 RAF） */
  syncNow: (options?: EditorDomSyncOptions) => void;
  /** 将同步安排到下一帧 */
  syncSoon: (options?: EditorDomSyncOptions) => void;
  /** 应用 ID 映射（临时 ID → 正式 ID） */
  applyIdMap: (idMap: Record<string, string>) => ApplyIdMapResult;
}

/**
 * 封装 requestAnimationFrame，兼容测试环境
 */
const raf = (callback: FrameRequestCallback): number => {
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame(callback);
  }
  return setTimeout(() => callback(Date.now()), 16) as unknown as number;
};

/**
 * 取消 requestAnimationFrame
 */
const caf = (handle: number) => {
  if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(handle);
  } else {
    clearTimeout(handle as unknown as NodeJS.Timeout);
  }
};

/**
 * 统一的编辑器 DOM 同步 Hook
 *
 * 使用示例：
 * ```typescript
 * const editorRef = useRef<EditorFacade | null>(null);
 * const domSync = useEditorDomSync(editorRef, { debug: true });
 *
 * // 立即同步
 * domSync.syncNow();
 *
 * // 应用 ID 映射
 * domSync.applyIdMap({ 'new-chapter-123': 'chapter-456' });
 * ```
 *
 * @param editorRef - EditorFacade 引用
 * @param options - 同步选项
 * @returns 同步句柄
 */
export const useEditorDomSync = (
  editorRef: React.MutableRefObject<EditorFacade | null>,
  options: UseEditorDomSyncOptions = {}
): UseEditorDomSyncHandles => {
  const { debug = false } = options;
  const rafHandleRef = useRef<number | null>(null);
  const syncingRef = useRef(false); // 防重入标记
  const pendingSilentRef = useRef(false); // 静默模式标记

  /**
   * 执行同步（防重入）
   *
   * 核心流程：
   * 1. 检查防重入标记
   * 2. 先补齐章节 ID（ensureSectionIds）
   * 3. 再更新章节序号（updateChapterOrdinals）
   * 4. 清除防重入标记
   *
   * 注意：
   * - 使用 try-finally 确保标记一定会被清除
   * - 两个纯函数都是幂等操作，多次调用结果一致
   */
  const performSync = useCallback(
    (options: EditorDomSyncOptions = {}) => {
      const editor = editorRef.current;
      if (!editor || !editor.isReady()) return;

      // 防重入检查
      if (syncingRef.current) {
        if (debug) {
          console.log('[useEditorDomSync] 跳过重入调用');
        }
        return;
      }

      // 设置同步标记
      syncingRef.current = true;

      const executeSync = () => {
        // 1. 先补齐章节 ID
        const idResult = ensureSectionIds(editor, { debug });

        // 2. 再更新章节序号
        const numberResult = updateChapterOrdinals(editor, { debug });

        if (debug) {
          console.log('[useEditorDomSync] 同步完成', { idResult, numberResult });
        }
      };

      try {
        if (options.silent) {
          editor.ignore(executeSync);
        } else {
          executeSync();
        }
      } finally {
        // 清除同步标记
        syncingRef.current = false;
      }
    },
    [debug, editorRef]
  );

  /**
   * 请求同步（防抖）
   *
   * 使用 RAF 将多次请求合并为一次执行
   */
  const requestSync = useCallback(
    (options: EditorDomSyncOptions = {}) => {
      if (debug) {
        console.log('[useEditorDomSync] requestSync 被调用');
      }
      if (options.silent) {
        pendingSilentRef.current = true;
      }
      if (rafHandleRef.current !== null) return; // 已有待执行的同步

      rafHandleRef.current = raf(() => {
        rafHandleRef.current = null;
        const shouldRunSilent = pendingSilentRef.current;
        pendingSilentRef.current = false;
        performSync({ silent: shouldRunSilent });
      });
    },
    [debug, performSync]
  );

  /**
   * 立即同步（不等待 RAF）
   *
   * 使用场景：
   * - 编辑器初始化时
   * - 保存前需要确保 DOM 同步
   * - 测试环境中需要同步执行
   */
  const syncNow = useCallback(
    (options: EditorDomSyncOptions = {}) => {
      // 取消待执行的 RAF
      if (rafHandleRef.current !== null) {
        caf(rafHandleRef.current);
        rafHandleRef.current = null;
      }
      pendingSilentRef.current = false;
      performSync(options);
    },
    [performSync]
  );

  const syncSoon = useCallback(
    (options?: EditorDomSyncOptions) => {
      requestSync(options ?? {});
    },
    [requestSync]
  );

  /**
   * 应用 ID 映射（临时 ID → 正式 ID）
   *
   * 使用场景：
   * - 保存成功后，后端返回 idMap
   * - 需要将临时 ID 替换为正式 ID
   *
   * 注意：
   * - 应用 idMap 后会自动触发同步
   */
  const applyIdMapAndSync = useCallback(
    (idMap: Record<string, string>): ApplyIdMapResult => {
      const editor = editorRef.current;
      if (!editor || !editor.isReady()) {
        return { replacedCount: 0, affectedIds: [], unmatchedIds: Object.keys(idMap) };
      }

      // 应用 ID 映射
      const result = applySectionIdMap(editor, idMap, { debug });

      // 立即同步（确保编号与新 ID 关联）
      syncNow();

      return result;
    },
    [debug, editorRef, syncNow]
  );

  useEffect(() => {
    return () => {
      if (rafHandleRef.current !== null) {
        caf(rafHandleRef.current);
        rafHandleRef.current = null;
      }
    };
  }, []);

  return {
    syncNow,
    syncSoon,
    applyIdMap: applyIdMapAndSync,
  };
};
