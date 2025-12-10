/**
 * 文本改写悬浮预览 Hook
 *
 * @description 管理文本改写的悬浮预览组件，包括：
 * - 悬浮容器创建与定位（参考 useAIGCButton）
 * - 使用 AIAnswerMarkdownViewer 渲染预览内容
 * - 预览内容实时更新（节流 100ms）
 * - 完成检测与自动替换
 * - 替换后标记脏状态并移除预览组件
 *
 * 注意：这是一个纯 UI Hook，不直接访问 Redux 或 Context
 * 所有数据通过 props 传递，保持组件的抽象性
 *
 * @see apps/report-ai/docs/RPDetail/RPEditor/external-component-rendering.md
 * @see apps/report-ai/docs/specs/text-ai-rewrite-implementation/spec-implementation-v1.md
 * @see apps/report-ai/src/components/ReportEditor/hooks/useAIGCButton.tsx - 悬浮组件定位参考
 * @see packages/ai-ui/src/md/index.tsx - Markdown 预览组件
 */

import { EditorFacade } from '@/domain/reportEditor';
import { restoreSelection } from '@/domain/reportEditor/selection';
import { SelectionUserDecision } from '@/types/editor/selection-types';
import { useCallback, useEffect, useRef } from 'react';
import type { PreviewInstance, UseTextRewritePreviewOptions, UseTextRewritePreviewReturn } from './types';
import { cleanupPreviewContainer, createPreviewContainer, isPreviewInstanceValid } from './utils';
import { usePreviewRenderer } from './utils/previewRenderer';

/**
 * 文本改写悬浮预览 Hook
 *
 * @example
 * ```tsx
 * const rewriteState = {
 *   isRewriting: true,
 *   correlationId: 'text_rewrite_123',
 *   snapshot: selectionSnapshot,
 *   previewContent: 'Generated content...',
 *   isCompleted: false,
 * };
 *
 * const { cleanup } = useTextRewritePreview(editorRef, {
 *   entWebAxiosInstance,
 *   wsid: 'workspace-123',
 *   isDev: false,
 *   rewriteState,
 *   onComplete: (content, snapshot) => {
 *     // 替换选区内容
 *   },
 * });
 * ```
 */
export function useTextRewritePreview(
  editorFacade: EditorFacade | null,
  options: UseTextRewritePreviewOptions
): UseTextRewritePreviewReturn {
  const { rewriteState, onUserDecision } = options;

  // 从 props 获取状态
  const { isRewriting, correlationId, snapshot, previewContent, isCompleted } = rewriteState;

  // 预览实例引用
  const previewInstanceRef = useRef<PreviewInstance | null>(null);

  // 预览渲染器
  const { renderPreviewContent, renderLoadingState, cancelPendingRender } = usePreviewRenderer();

  /**
   * 清理预览组件
   */
  const cleanup = useCallback(() => {
    cancelPendingRender();
    cleanupPreviewContainer(previewInstanceRef.current);
    previewInstanceRef.current = null;
  }, [cancelPendingRender]);

  /**
   * 处理用户决策
   */
  const handleUserDecision = useCallback(
    (decision: SelectionUserDecision) => {
      if (!previewContent || !snapshot) {
        return;
      }

      // 如果用户选择应用，替换选区内容
      if (decision === 'apply' && editorFacade) {
        try {
          // 恢复选区
          restoreSelection(editorFacade, snapshot);

          // 替换选区内容
          editorFacade.setSelectedContent(previewContent);

          // 触发内容变化事件，标记为脏状态
          editorFacade.fire('change');
        } catch (error) {
          console.error('[useTextRewritePreview] Failed to apply rewrite:', error);
        }
      }

      // 通知主流程用户的决策
      if (onUserDecision) {
        onUserDecision(decision, previewContent, snapshot);
      }

      // 清理预览组件
      cleanup();
    },
    [previewContent, snapshot, editorFacade, onUserDecision, cleanup]
  );

  /**
   * 监听改写状态变化
   * 当开始改写时创建预览容器
   */
  useEffect(() => {
    if (!isRewriting || !correlationId || !snapshot) {
      // 如果不在改写状态，清理预览
      cleanup();
      return;
    }

    // 如果已经有预览实例且 correlationId 相同，不重复创建
    if (isPreviewInstanceValid(previewInstanceRef.current, correlationId)) {
      return;
    }

    // 清理旧的预览实例
    cleanup();

    // 创建新的预览实例
    const instance = createPreviewContainer(editorFacade, correlationId);
    if (instance) {
      previewInstanceRef.current = instance;

      // 初始渲染（显示加载状态）
      renderLoadingState(instance);
    }
  }, [isRewriting, correlationId, snapshot, editorFacade, cleanup, renderLoadingState]);

  /**
   * 监听预览内容变化，更新预览
   */
  useEffect(() => {
    if (!isRewriting || !correlationId || !previewInstanceRef.current) {
      return;
    }

    // 更新预览内容
    if (previewContent) {
      renderPreviewContent(previewContent, previewInstanceRef.current, isCompleted, handleUserDecision);
    }
  }, [previewContent, isRewriting, correlationId, isCompleted, renderPreviewContent, handleUserDecision]);

  /**
   * 监听完成状态
   * 注意：不再自动执行替换，等待用户点击确认或取消按钮
   */
  useEffect(() => {
    if (!isCompleted || !previewContent || !snapshot || !previewInstanceRef.current) {
      return;
    }

    // 完成时重新渲染，启用按钮
    renderPreviewContent(previewContent, previewInstanceRef.current, true, handleUserDecision);
  }, [isCompleted, previewContent, snapshot, renderPreviewContent, handleUserDecision]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    cleanup,
  };
}
