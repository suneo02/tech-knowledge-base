/**
 * 编辑器草稿同步 Hook
 *
 * @description 基于树结构 Draft Tree 的编辑器内容同步
 * @note 用户编辑完整 HTML，解析拆分后更新对应的草稿节点
 *
 * @see {@link ../../../docs/RPDetail/ContentManagement/data-layer-guide.md | 数据与状态管理 - Draft 层}
 * @see {@link ./README.md | Hooks 架构说明}
 * @see apps/report-ai/docs/RPDetail/RPEditor/rendering-and-presentation-guide.md - 状态同步机制
 */

import { DocumentChapterNode, parseDocumentChapterTree } from '@/domain/reportEditor';
import { DebouncedFunc, debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRPDetailDispatch, useRPDetailSelector } from '../hooksRedux';
import { selectBaselineDocHash, selectCanonicalChaptersEnriched, selectGlobalOp } from '../selectors';
import { selectHasDraftState } from '../selectors/draftTreeSelectors';
import { rpDetailActions } from '../slice';
import { calculateContentHash } from '../utils/contentHash';

export interface UseEditorDraftSyncOptions {
  /** 是否启用同步 */
  enabled?: boolean;
  /** 防抖延迟（毫秒，默认 100） */
  debounceMs?: number;
  /** 错误回调 */
  onError?: (error: Error) => void;
}

export interface UseEditorDraftSyncReturn {
  /** 是否正在同步 */
  isSyncing: boolean;
  /** 最后同步时间 */
  lastSyncAt: number | null;
  /** 处理编辑器内容变更 */
  handleContentChange: (html: string) => void;
  /** 立即执行待处理的内容变更 */
  flushPendingContentChange: () => void;
  /** 取消待处理的内容变更 */
  cancelPendingContentChange: () => void;
  /** 同步错误 */
  error: Error | null;
  /** 清除错误 */
  clearError: () => void;
}

export const useEditorDraftSync = (options: UseEditorDraftSyncOptions = {}): UseEditorDraftSyncReturn => {
  const { enabled = true, debounceMs = 100, onError } = options;

  const dispatch = useRPDetailDispatch();
  const syncingRef = useRef(false);
  const lastSyncAtRef = useRef<number | null>(null);
  const errorRef = useRef<Error | null>(null);
  const enabledRef = useRef(enabled);

  // 从 Redux store 获取状态
  const chapters = useRPDetailSelector(selectCanonicalChaptersEnriched);
  const hasDraftState = useRPDetailSelector(selectHasDraftState);
  const globalOperation = useRPDetailSelector(selectGlobalOp);
  const baselineDocHash = useRPDetailSelector(selectBaselineDocHash);

  // 更新启用状态
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // 处理内容变更的核心逻辑
  const handleContentChange = useCallback(
    (fullHtml: string) => {
      if (!enabledRef.current || !fullHtml || !chapters || chapters.length === 0) {
        return;
      }

      syncingRef.current = true;
      errorRef.current = null;

      try {
        // 计算当前文档的 hash（简化逻辑：使用文档级 hash 比较）
        const currentDocHash = calculateContentHash(fullHtml.trim());

        // 通过文档级 hash 检测变更
        const hasDocumentChanged = currentDocHash !== baselineDocHash;

        if (hasDocumentChanged) {
          // 解析 HTML 内容，检测章节变更
          const { chapters: parsedChapters } = parseDocumentChapterTree(fullHtml);
          const chapterTree: DocumentChapterNode[] | undefined = parsedChapters.length ? parsedChapters : undefined;

          // 更新 Redux 状态
          const timestamp = Date.now();
          dispatch(
            rpDetailActions.handleEditorContentChange({
              currentDocHash,
              timestamp,
              chapterTree,
            })
          );

          lastSyncAtRef.current = timestamp;
        }
      } catch (error) {
        const syncError = error instanceof Error ? error : new Error(String(error));
        errorRef.current = syncError;
        onError?.(syncError);
      } finally {
        syncingRef.current = false;
      }
    },
    [chapters, hasDraftState, globalOperation, baselineDocHash, dispatch, onError]
  );

  // 创建防抖的内容变更处理器
  const debouncedHandleContentChange = useMemo<DebouncedFunc<typeof handleContentChange>>(
    () => debounce(handleContentChange, debounceMs),
    [handleContentChange, debounceMs]
  );

  // 对外暴露的编辑器内容变更处理器（防抖）
  const handleContentChangeDebounced = useCallback(
    (html: string) => {
      debouncedHandleContentChange(html);
    },
    [debouncedHandleContentChange]
  );

  // 立即执行尚未触发的变更处理（用于需要即时同步的场景）
  const flushPendingContentChange = useCallback(() => {
    debouncedHandleContentChange.flush();
  }, [debouncedHandleContentChange]);

  // 取消等待中的变更处理
  const cancelPendingContentChange = useCallback(() => {
    debouncedHandleContentChange.cancel();
  }, [debouncedHandleContentChange]);

  // 清除错误
  const clearError = useCallback(() => {
    errorRef.current = null;
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cancelPendingContentChange();
    };
  }, [cancelPendingContentChange]);

  return {
    isSyncing: syncingRef.current,
    lastSyncAt: lastSyncAtRef.current,
    handleContentChange: handleContentChangeDebounced,
    flushPendingContentChange,
    cancelPendingContentChange,
    error: errorRef.current,
    clearError,
  };
};
