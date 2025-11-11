/**
 * AIGC 按钮 Hook（简化版）
 *
 * @description 管理章节标题悬停时显示的 AIGC 按钮
 * 负责按钮的创建、定位、渲染和清理
 * @see apps/report-ai/docs/specs/aigc-button-on-hover/spec-design-v1.md
 */

import { SmartGenBtn } from '@/components/common/SmartGenBtn';
import type { EditorFacade } from '@/domain/reportEditor/editor';
import { useCallback, useRef } from 'react';
import { type ChapterHoverInfo } from './useChapterHoverWithInit';
import {
  calculateAIGCButtonPositionForChapter,
  createExternalComponentRenderer,
  createGlobalContainerConfig,
  ExternalComponentRenderer,
  getEditorBody,
  isEditorReady,
} from './utils';

/**
 * AIGC 按钮 Hook 的配置选项
 */
export interface UseAIGCButtonOptions {
  /** AIGC 按钮点击回调 */
  onClick?: (chapterId: string) => void;
  /** 按钮是否禁用 */
  disabled?: boolean;
}

/**
 * AIGC 按钮 Hook 的返回值
 */
export interface UseAIGCButtonReturn {
  /** 渲染 AIGC 按钮 */
  renderAIGCButton: (hoveredChapter: ChapterHoverInfo | null) => void;
  /** 清理 AIGC 按钮资源 */
  cleanupAIGCButton: () => void;
}

/**
 * AIGC 按钮 Hook
 *
 * @param editorRef 编辑器实例引用
 * @param options 配置选项
 * @returns AIGC 按钮渲染和控制函数
 */
export const useAIGCButton = (
  editorRef: React.RefObject<EditorFacade | null>,
  options: UseAIGCButtonOptions = {}
): UseAIGCButtonReturn => {
  const { onClick, disabled = false } = options;

  // 使用统一的外部组件渲染器
  const rendererRef = useRef<ExternalComponentRenderer<string>>();
  const activeChapterIdRef = useRef<string | null>(null);

  // 初始化渲染器
  if (!rendererRef.current) {
    const config = createGlobalContainerConfig('aigc-button', 10000);
    rendererRef.current = createExternalComponentRenderer<string>(config);
  }

  /**
   * 清理 AIGC 按钮相关资源
   */
  const cleanupAIGCButton = useCallback(() => {
    rendererRef.current?.cleanup();
    activeChapterIdRef.current = null;
  }, []);

  /**
   * 渲染 AIGC 按钮组件
   */
  const renderAIGCButtonComponent = useCallback(
    (hoveredChapter: ChapterHoverInfo) => {
      const renderer = rendererRef.current;
      if (!renderer) return;

      const buttonStyle = calculateAIGCButtonPositionForChapter(hoveredChapter);

      const instance = renderer.getOrCreateInstance(hoveredChapter.chapterId, {
        className: 'aigc-button-instance',
        styles: {
          position: 'absolute',
          top: '0',
          left: '0',
          pointerEvents: 'auto',
        },
      });

      instance.root.render(
        <div style={buttonStyle}>
          <SmartGenBtn onClick={() => onClick?.(hoveredChapter.chapterId)} disabled={disabled} />
        </div>
      );

      renderer.showInstance(hoveredChapter.chapterId);
      renderer.hideOtherInstances(hoveredChapter.chapterId);
      activeChapterIdRef.current = hoveredChapter.chapterId;
    },
    [onClick, disabled]
  );

  /**
   * 渲染 AIGC 按钮
   */
  const renderAIGCButton = useCallback(
    (hoveredChapter: ChapterHoverInfo | null) => {
      try {
        // 确保编辑器已经初始化
        if (!isEditorReady(editorRef.current)) {
          return;
        }

        const editorBody = getEditorBody(editorRef.current);
        if (!editorBody) {
          return;
        }

        const renderer = rendererRef.current;
        if (!renderer) {
          return;
        }

        // 如果没有悬停的章节，隐藏当前激活的按钮
        if (!hoveredChapter) {
          const activeChapterId = activeChapterIdRef.current;
          if (activeChapterId) {
            renderer.hideInstance(activeChapterId);
          }
          activeChapterIdRef.current = null;
          return;
        }

        // 渲染按钮组件
        renderAIGCButtonComponent(hoveredChapter);
      } catch (error) {
        console.error('[AIGCButton] Error rendering AIGC button:', error);
      }
    },
    [editorRef, renderAIGCButtonComponent]
  );

  return {
    renderAIGCButton,
    cleanupAIGCButton,
  };
};
