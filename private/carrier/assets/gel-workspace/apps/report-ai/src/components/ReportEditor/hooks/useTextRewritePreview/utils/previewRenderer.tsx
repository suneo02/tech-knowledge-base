/**
 * 预览内容渲染工具
 *
 * 负责渲染预览内容，包括 Markdown 处理和节流控制
 */

import { TextRewritePreview } from '@/components/editor/TextRewritePreview';
import { SelectionUserDecision } from '@/types/editor/selection-types';
import { useThrottleFn } from 'ahooks';
import type { PreviewInstance } from '../types';

/**
 * 预览渲染配置
 */
const PREVIEW_RENDER_CONFIG = {
  /** 节流等待时间（毫秒） */
  throttleWait: 100,
  /** 加载状态文本 */
  loadingText: '正在生成...',
};

/**
 * 预览渲染器 Hook
 *
 * @returns 渲染预览内容的函数
 */
export function usePreviewRenderer() {
  /**
   * 渲染预览内容（节流）
   */
  const { run: renderPreviewContent, cancel: cancelPendingRender } = useThrottleFn(
    (
      content: string,
      instance: PreviewInstance,
      isCompleted: boolean,
      onDecision?: (decision: SelectionUserDecision) => void
    ) => {
      if (!instance) {
        return;
      }

      try {
        instance.root.render(
          <TextRewritePreview
            content={content}
            isCompleted={isCompleted}
            onApply={() => onDecision?.('apply')}
            onCancel={() => onDecision?.('cancel')}
          />
        );
      } catch (error) {
        // Silent render error
      }
    },
    { wait: PREVIEW_RENDER_CONFIG.throttleWait }
  );

  /**
   * 渲染加载状态
   */
  const renderLoadingState = (instance: PreviewInstance) => {
    renderPreviewContent(PREVIEW_RENDER_CONFIG.loadingText, instance, false);
  };

  return {
    renderPreviewContent,
    renderLoadingState,
    cancelPendingRender,
  };
}
