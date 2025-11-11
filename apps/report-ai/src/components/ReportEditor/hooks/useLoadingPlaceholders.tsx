/**
 * 加载占位组件 Hook
 *
 * @description 在章节生成时渲染加载动画与停止按钮
 * @see apps/report-ai/docs/RPDetail/RPEditor/external-component-rendering.md
 */

import { AliceGenerating } from '@/components/common/Generating';
import type { EditorFacade } from '@/domain/reportEditor/editor';
import { RefObject, useCallback, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  cleanupOrphanLoadingPlaceholders,
  ensureLoadingPlaceholderMount,
  extractChapterIdFromContainer,
  findLoadingPlaceholderContainers,
  generateLoadingMountId,
  isEditorReady,
} from './utils';

export interface UseLoadingPlaceholdersOptions {
  onStop?: (sectionId: string) => void;
}

export const useLoadingPlaceholders = (
  editorRef: RefObject<EditorFacade | null>,
  options: UseLoadingPlaceholdersOptions = {}
) => {
  const loadingRootsRef = useRef<Map<string, Root>>(new Map());

  /**
   * 获取或创建加载占位符的 React Root
   */
  const getOrCreateLoadingRoot = useCallback((sectionId: string, mount: HTMLElement): Root => {
    let root = loadingRootsRef.current.get(sectionId);
    if (!root) {
      root = createRoot(mount);
      loadingRootsRef.current.set(sectionId, root);
    }
    return root;
  }, []);

  const findLoadingContainers = useCallback((): Element[] => {
    const ed = editorRef.current;
    if (!isEditorReady(ed)) return [];
    return findLoadingPlaceholderContainers(ed);
  }, [editorRef]);

  const ensureLoadingMount = useCallback(
    (sectionId: string, container: Element): HTMLElement | null => {
      const ed = editorRef.current;
      if (!isEditorReady(ed)) return null;

      return ensureLoadingPlaceholderMount(ed, container as HTMLElement, sectionId);
    },
    [editorRef]
  );

  const renderLoadingReact = useCallback(
    (sectionId: string) => {
      const ed = editorRef.current;
      if (!isEditorReady(ed)) return;

      const mountId = generateLoadingMountId(sectionId);
      const mount = ed.getElementById(mountId) as HTMLElement | null;
      if (!mount) return;

      const root = getOrCreateLoadingRoot(sectionId, mount);
      root.render(<AliceGenerating onStop={() => options.onStop?.(sectionId)} />);
    },
    [editorRef, options.onStop, getOrCreateLoadingRoot]
  );

  const cleanupOrphanLoading = useCallback(() => {
    const ed = editorRef.current;
    if (!isEditorReady(ed)) return;

    cleanupOrphanLoadingPlaceholders(ed, loadingRootsRef.current);
  }, [editorRef]);

  const render = useCallback(() => {
    const containers = findLoadingContainers();
    containers.forEach((container: Element) => {
      const sectionId = extractChapterIdFromContainer(container);
      if (!sectionId) return;

      const mount = ensureLoadingMount(sectionId, container);
      if (mount) renderLoadingReact(sectionId);
    });
    cleanupOrphanLoading();
  }, [findLoadingContainers, ensureLoadingMount, renderLoadingReact, cleanupOrphanLoading]);

  return { render };
};
