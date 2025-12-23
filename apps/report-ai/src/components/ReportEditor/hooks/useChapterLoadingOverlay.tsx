import { AliceGenerating } from '@/components/common/Generating';
import type { EditorFacade } from '@/domain/reportEditor/editor';
import { RP_SELECTORS } from '@/domain/reportEditor/foundation';
import { ChapterGenerationStatus } from '@/types/editor';
import type { RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import {
  createExternalComponentRenderer,
  EXTERNAL_COMPONENT_CONFIGS,
  getEditorFrameOffset,
  isEditorReady,
} from './utils';

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

  useEffect(() => {
    activeChaptersRef.current = activeChapters.filter((item) => isGeneratingStatus(item.status));
    requestRender();
  }, [activeChapters, requestRender]);

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

    chapters.forEach(({ chapterId }) => {
      const headingElement = editor.querySelector(RP_SELECTORS.CHAPTER_BY_ID(chapterId)) as HTMLElement | null;

      if (!headingElement) {
        renderer.deleteInstance(chapterId);
        return;
      }

      const rect = headingElement.getBoundingClientRect();
      const styles = {
        position: 'absolute' as const,
        top: `${frameOffset.top + rect.bottom}px`,
        left: `${frameOffset.left + rect.left}px`,
        width: `${rect.width}px`,
        pointerEvents: 'auto' as const,
        display: 'flex',
        justifyContent: 'center',
      };

      const instance = renderer.getOrCreateInstance(chapterId, {
        className: 'chapter-loading-overlay',
        styles: {
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'auto',
          width: '100%',
        },
      });

      instance.root.render(
        <div style={styles}>
          <AliceGenerating onStop={() => onStop?.(chapterId)} />
        </div>
      );

      renderer.showInstance(chapterId);
    });

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
