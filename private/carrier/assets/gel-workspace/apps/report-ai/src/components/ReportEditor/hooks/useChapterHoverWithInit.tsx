/**
 * 章节标题悬停检测 Hook（简化版）
 *
 * @description 监听鼠标移动，检测鼠标位置的章节，仅在 leaf chapter 时输出章节信息
 * @see apps/report-ai/docs/specs/aigc-button-on-hover/spec-design-v1.md
 */

import type { EditorFacade } from '@/domain/reportEditor/editor';
import { useReportContentSelector } from '@/store/reportContentStore';
import { selectCanonicalChaptersEnrichedMap } from '@/store/reportContentStore/selectors';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  calculateChapterHoverPosition,
  createRafThrottle,
  findChapterHeadingByPosition,
  getEditorBody,
  getEditorDocumentContext,
  isEditorReady,
  isLeafChapter,
  RafThrottledFunction,
} from './utils';

export interface ChapterHoverInfo {
  /** 章节 ID */
  chapterId: string;
  /** 标题元素 */
  element: HTMLElement;
  /** 按钮位置信息 */
  position: {
    top: number;
    left: number;
  };
}

export interface ChapterHoverOptions {
  /** 是否启用悬停检测 */
  enabled?: boolean;
}

export interface UseChapterHoverWithInitReturn {
  hoveredChapter: ChapterHoverInfo | null;
  initializeHoverDetection: () => void;
  cleanup: () => void;
}

export const useChapterHoverWithInit = (
  editorRef: React.RefObject<EditorFacade | null>,
  options: ChapterHoverOptions = {}
): UseChapterHoverWithInitReturn => {
  const { enabled = true } = options;
  const [hoveredChapter, setHoveredChapter] = useState<ChapterHoverInfo | null>(null);

  const bodyRef = useRef<HTMLElement | null>(null);
  const documentRef = useRef<Document | null>(null);
  const frameWindowRef = useRef<Window | null>(null);
  const throttledHandlerRef = useRef<RafThrottledFunction<(clientX: number, clientY: number) => void> | null>(null);
  const isInitializedRef = useRef(false);

  const chapterMap = useReportContentSelector(selectCanonicalChaptersEnrichedMap);

  /**
   * 检测鼠标位置的章节，判断是否为 leaf chapter
   */
  const handleDetection = useCallback(
    (clientX: number, clientY: number) => {
      const doc = documentRef.current;
      if (!doc) {
        return;
      }

      // 使用 elementFromPoint 检测鼠标位置的标题元素
      const heading = findChapterHeadingByPosition(doc, clientX, clientY);

      // 如果没有找到标题，隐藏所有按钮
      if (!heading) {
        setHoveredChapter(null);
        return;
      }

      // 计算章节悬停位置信息
      const hoverInfo = calculateChapterHoverPosition(heading);
      if (!hoverInfo) {
        setHoveredChapter(null);
        return;
      }

      // 判断是否为 leaf chapter
      if (!isLeafChapter(hoverInfo.chapterId, chapterMap)) {
        // 非 leaf chapter，隐藏所有按钮
        setHoveredChapter(null);
        return;
      }

      // 是 leaf chapter，显示按钮
      setHoveredChapter((prev) => {
        // 避免重复更新相同章节
        if (prev?.chapterId === hoverInfo.chapterId) {
          return prev;
        }
        return hoverInfo;
      });
    },
    [chapterMap]
  );

  /**
   * 鼠标移动事件处理（RAF 节流）
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!enabled) {
        return;
      }

      const { clientX, clientY } = event;
      throttledHandlerRef.current?.(clientX, clientY);
    },
    [enabled]
  );

  /**
   * 鼠标离开 body 时隐藏按钮
   */
  const handleBodyLeave = useCallback(() => {
    setHoveredChapter(null);
  }, []);

  /**
   * 初始化悬停检测
   */
  const initializeHoverDetection = useCallback(() => {
    if (!enabled || isInitializedRef.current) {
      return;
    }

    if (!editorRef.current) {
      return;
    }

    const editor = editorRef.current;
    if (!isEditorReady(editor)) {
      return;
    }

    const contentArea = getEditorBody(editor);
    if (!contentArea) {
      return;
    }

    const documentContext = getEditorDocumentContext(editor);

    bodyRef.current = contentArea;
    documentRef.current = documentContext.document;
    frameWindowRef.current = documentContext.window;

    // 创建 RAF 节流处理器
    throttledHandlerRef.current = createRafThrottle(handleDetection, frameWindowRef.current ?? undefined);

    // 只监听 body 的鼠标移动事件
    bodyRef.current?.addEventListener('mousemove', handleMouseMove);

    isInitializedRef.current = true;
  }, [editorRef, enabled, handleBodyLeave, handleMouseMove, handleDetection]);

  /**
   * 清理事件监听
   */
  const cleanup = useCallback(() => {
    // 取消 RAF 节流
    throttledHandlerRef.current?.cancel();
    throttledHandlerRef.current = null;

    // 移除事件监听
    bodyRef.current?.removeEventListener('mousemove', handleMouseMove);

    // 清空引用
    bodyRef.current = null;
    documentRef.current = null;
    frameWindowRef.current = null;
    isInitializedRef.current = false;

    setHoveredChapter(null);
  }, [handleBodyLeave, handleMouseMove]);

  useEffect(() => cleanup, [cleanup]);

  return {
    hoveredChapter,
    initializeHoverDetection,
    cleanup,
  };
};
