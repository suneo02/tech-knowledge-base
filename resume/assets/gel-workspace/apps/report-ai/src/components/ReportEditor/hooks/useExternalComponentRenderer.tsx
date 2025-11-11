import type { EditorFacade } from '@/domain/reportEditor/editor';
import { useUpdateEffect } from 'ahooks';
import { RefObject, useCallback } from 'react';
import { useAIGCButton } from './useAIGCButton';
import { useChapterHoverWithInit } from './useChapterHoverWithInit';
import { useLoadingPlaceholders } from './useLoadingPlaceholders';

/**
 * 外部组件渲染器的配置选项
 *
 * @description 定义外部组件渲染器的配置参数
 * @see apps/report-ai/docs/RPDetail/RPEditor/external-component-rendering.md
 * @since 1.0.0
 */
export interface UseExternalComponentRendererOptions {
  /** 停止生成的回调函数 */
  onStop?: (sectionId: string) => void;
  /** 当用户 hover/聚焦 Citation 摘要时加载明细内容（返回 HTML 片段或空） */
  onCitationHover?: (sectionId: string) => Promise<string | void> | string | void;
  /** AIGC 按钮点击回调 */
  onAIGCButtonClick?: (chapterId: string) => void;
  /** AIGC 按钮是否禁用 */
  aigcButtonDisabled?: boolean;
}

/**
 * 组件在页面中的位置信息
 *
 * @description 定义组件在页面中的绝对位置和尺寸
 * @since 1.0.0
 */
// 已移除外部覆盖定位方案，不再需要位置类型

/**
 * 已挂载的组件信息
 *
 * @description 包含组件的 React Root 实例、容器元素和清理函数
 * @since 1.0.0
 */
// 已移除外部覆盖挂载信息，不再需要存根类型

/**
 * 在 TinyMCE 编辑器外部渲染 React 组件的 Hook
 * 适用于临时性 UI 组件，如 loading、提示等
 *
 * @description 协调加载占位与 AIGC 按钮的渲染时机
 * @see apps/report-ai/docs/RPDetail/RPEditor/external-component-rendering.md
 */
export const useExternalComponentRenderer = (
  editorRef: RefObject<EditorFacade | null>,
  options: UseExternalComponentRendererOptions = {}
) => {
  const { render: renderLoading } = useLoadingPlaceholders(editorRef, { onStop: options.onStop });
  const { hoveredChapter, initializeHoverDetection } = useChapterHoverWithInit(editorRef);
  const { renderAIGCButton } = useAIGCButton(editorRef, {
    onClick: options.onAIGCButtonClick,
    disabled: options.aigcButtonDisabled,
  });

  /**
   * 渲染所有需要渲染的外部组件
   */
  const renderComponents = useCallback(() => {
    try {
      // 确保编辑器已经初始化
      if (!editorRef.current || !editorRef.current.isReady()) {
        console.log('Editor not ready, skipping component rendering');
        return;
      }

      // 避免与流式 DOM 更新竞争：microtask + raf 之后再渲染
      Promise.resolve().then(() => {
        requestAnimationFrame(() => {
          renderLoading();
          renderAIGCButton(hoveredChapter);
        });
      });
    } catch (error) {
      console.error('Error rendering external components:', error);
    }
  }, [editorRef, renderLoading, renderAIGCButton, hoveredChapter]);

  // 卸载/位置更新相关逻辑已删除

  // 当编辑器变为可用时，自动渲染组件
  useUpdateEffect(() => {
    if (editorRef.current && editorRef.current.getBody()) {
      renderComponents();
    }
  }, [editorRef, renderComponents]);

  return {
    renderComponents,
    initializeHoverDetection,
  };
};
