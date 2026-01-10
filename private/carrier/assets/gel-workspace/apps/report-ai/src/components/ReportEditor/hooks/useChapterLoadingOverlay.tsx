import { AliceGenerating } from '@/components/common/Generating';
import type { EditorFacade } from '@/domain/reportEditor/editor';
import { ChapterGenerationStatus } from '@/types/editor';
import type { RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { getChapterBottomPosition, getEditorFrameOffset } from './chapterPositionUtils';
import { createExternalComponentRenderer, EXTERNAL_COMPONENT_CONFIGS, isEditorReady } from './utils';

type ExternalRendererRegistration = {
  id: string;
  render: () => void;
};

interface UseChapterLoadingOverlayOptions {
  activeChapters: ChapterLoadingOverlayState[];
  onStop?: (chapterId: string) => void;
  registerRenderer: (renderer: ExternalRendererRegistration) => () => void;
  requestRender: () => void;
}

interface ActiveChapter {
  chapterId: string;
  status: ChapterGenerationStatus;
}

const isGeneratingStatus = (status: ChapterGenerationStatus) => status === 'pending' || status === 'receiving';

export interface ChapterLoadingOverlayState {
  chapterId: string;
  status: ChapterGenerationStatus;
}

export const useChapterLoadingOverlay = (
  editorRef: RefObject<EditorFacade | null>,
  options: UseChapterLoadingOverlayOptions
) => {
  const { onStop, registerRenderer, requestRender, activeChapters = [] } = options;
  const rendererRef = useRef(createExternalComponentRenderer<string>(EXTERNAL_COMPONENT_CONFIGS.CHAPTER_LOADING));
  const activeChaptersRef = useRef<ActiveChapter[]>([]);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    activeChaptersRef.current = activeChapters.filter((item) => isGeneratingStatus(item.status));
    requestRender();
  }, [activeChapters, requestRender]);

  // 监听编辑器内容变化，实时更新 loading overlay 位置
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const editorBody = editor.getBody();
    if (!editorBody) return;

    // 只在有活跃章节时启动 MutationObserver
    if (activeChaptersRef.current.length === 0) {
      mutationObserverRef.current?.disconnect();
      mutationObserverRef.current = null;
      return;
    }

    // 创建 MutationObserver 监听 DOM 变化
    mutationObserverRef.current = new MutationObserver(() => {
      // 使用 requestRender 触发重新渲染，利用已有的防抖机制
      requestRender();
    });

    // 监听子节点变化和文本内容变化
    mutationObserverRef.current.observe(editorBody, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      mutationObserverRef.current?.disconnect();
      mutationObserverRef.current = null;
    };
  }, [editorRef, requestRender, activeChapters]);

  const renderLoadingOverlay = useCallback(() => {
    const renderer = rendererRef.current;
    const editor = editorRef.current;

    if (!renderer) {
      return;
    }

    if (!isEditorReady(editor)) {
      renderer.clearInstances();
      return;
    }

    const frameOffset = getEditorFrameOffset(editor);
    const chapters = activeChaptersRef.current;
    const activeSet = new Set(chapters.map((item) => item.chapterId));

    // 渲染每个章节的 loading overlay
    chapters.forEach(({ chapterId }) => {
      const position = getChapterBottomPosition(editor, chapterId, frameOffset);

      if (!position.found) {
        renderer.deleteInstance(chapterId);
        return;
      }

      const styles = {
        position: 'absolute' as const,
        top: `${position.bottom}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        pointerEvents: 'auto' as const,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      };

      const instance = renderer.getOrCreateInstance(chapterId, {
        className: 'chapter-loading-overlay',
        styles: {
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'auto',
          width: '100%',
          backgroundColor: 'transparent',
        },
      });

      instance.root.render(
        <div style={styles}>
          <AliceGenerating onStop={() => onStop?.(chapterId)} />
        </div>
      );

      renderer.showInstance(chapterId);
    });

    // 清理不再活跃的章节
    renderer.getAllInstances().forEach((_, key) => {
      if (!activeSet.has(key)) {
        renderer.deleteInstance(key);
      }
    });
  }, [editorRef, onStop]);

  useEffect(() => {
    const unregister = registerRenderer({
      id: 'chapter-loading-overlay',
      render: renderLoadingOverlay,
    });
    return () => {
      unregister();
      rendererRef.current?.cleanup();
    };
  }, [registerRenderer, renderLoadingOverlay]);
};
