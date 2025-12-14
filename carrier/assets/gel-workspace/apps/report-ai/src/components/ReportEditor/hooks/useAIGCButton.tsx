/**
 * AIGC 按钮 Hook（简化版）
 *
 * @description 管理章节标题悬停时显示的 AIGC 按钮
 * 负责按钮的创建、定位、渲染和清理
 * @see apps/report-ai/docs/specs/aigc-button-on-hover/spec-design-v1.md
 */

import { SmartGenBtn } from '@/components/common/SmartGenBtn';
import type { EditorFacade } from '@/domain/reportEditor/editor';
import { useCallback, useEffect, useRef } from 'react';
import { type ChapterHoverInfo } from './useChapterHoverWithInit';
import {
  calculateAIGCButtonPositionForChapter,
  createExternalComponentRenderer,
  EXTERNAL_COMPONENT_CONFIGS,
  getEditorBody,
  isEditorReady,
} from './utils';

/**
 * 渲染器注册接口
 */
type ExternalRendererRegistration = {
  id: string;
  render: () => void;
};

/**
 * AIGC 按钮 Hook 的配置选项
 */
export interface UseAIGCButtonOptions {
  /** 当前悬停的章节信息 */
  hoveredChapter: ChapterHoverInfo | null;
  /** AIGC 按钮点击回调 */
  onClick?: (chapterId: string) => void;
  /** 按钮是否禁用 */
  disabled?: boolean;
  /** 渲染器注册函数（来自 useExternalComponentRenderer） */
  registerRenderer: (renderer: ExternalRendererRegistration) => () => void;
  /** 请求渲染函数（来自 useExternalComponentRenderer） */
  requestRender: () => void;
}

/**
 * AIGC 按钮 Hook
 *
 * @description
 * 使用注册器模式，与 Loading Overlay 保持一致的架构。
 * 通过 registerRenderer 注册到统一调度器中。
 *
 * @param editorRef 编辑器实例引用
 * @param options 配置选项
 */
export const useAIGCButton = (editorRef: React.RefObject<EditorFacade | null>, options: UseAIGCButtonOptions): void => {
  const { hoveredChapter, onClick, disabled = false, registerRenderer, requestRender } = options;

  // 使用统一的外部组件渲染器（使用预定义配置）
  const rendererRef = useRef(createExternalComponentRenderer<string>(EXTERNAL_COMPONENT_CONFIGS.AIGC_BUTTON));
  const activeChapterIdRef = useRef<string | null>(null);
  const hoveredChapterRef = useRef<ChapterHoverInfo | null>(null);

  // 更新 hover 状态的 ref
  hoveredChapterRef.current = hoveredChapter;

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
   * 渲染 AIGC 按钮（从 ref 读取最新状态）
   */
  const renderAIGCButton = useCallback(() => {
    try {
      const currentHoveredChapter = hoveredChapterRef.current;

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
      if (!currentHoveredChapter) {
        const activeChapterId = activeChapterIdRef.current;
        if (activeChapterId) {
          renderer.hideInstance(activeChapterId);
        }
        activeChapterIdRef.current = null;
        return;
      }

      // 渲染按钮组件
      renderAIGCButtonComponent(currentHoveredChapter);
    } catch (error) {
      console.error('[AIGCButton] Error rendering AIGC button:', error);
    }
  }, [editorRef, renderAIGCButtonComponent]);

  /**
   * 监听 hover 状态变化，触发重新渲染
   */
  useEffect(() => {
    requestRender();
  }, [hoveredChapter, requestRender]);

  /**
   * 注册 AIGC 按钮渲染器
   */
  useEffect(() => {
    const unregister = registerRenderer({
      id: 'aigc-button',
      render: renderAIGCButton,
    });
    return () => {
      unregister();
      rendererRef.current?.cleanup();
    };
  }, [registerRenderer, renderAIGCButton]);
};
