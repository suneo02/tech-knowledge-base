import { PDFViewerRef } from '@/components/File';
import { RPChapterEnriched } from '@/types';
import { RPFileUnified } from '@/types/file';
import { RefObject, useCallback, useEffect, useMemo } from 'react';
import { ChapterJumpItem } from '../types';

/**
 * PDF 章节导航 Hook 参数
 */
export interface UsePDFChapterNavigationParams {
  /** 文件数据 */
  file?: RPFileUnified;
  /** 章节映射 */
  chapterMap?: Map<string, RPChapterEnriched>;
  /** 初始页码 */
  initialPage?: number;
  /** PDF Viewer 引用 */
  pdfViewerRef: RefObject<PDFViewerRef>;
  /** PDF 是否已加载 */
  pdfLoaded: boolean;
}

/**
 * PDF 章节导航 Hook 返回值
 */
export interface UsePDFChapterNavigationReturn {
  /** 章节跳转数据 */
  chapterJumpData: ChapterJumpItem[];
  /** 是否显示快速跳转器 */
  shouldShowJumper: boolean;
  /** 处理章节点击 */
  handleChapterClick: (page: number) => void;
}

/**
 * PDF 章节导航自定义 Hook
 *
 * @description 封装 PDF 章节导航相关的逻辑，包括：
 * - 计算章节跳转数据
 * - 判断是否显示快速跳转器
 * - 处理章节点击和页码变化
 * - 自动跳转到初始页码
 *
 * @see 设计文档 {@link ../../../../../docs/specs/pdf-preview-trace-navigation/spec-design-v1.md}
 */
export function usePDFChapterNavigation({
  file,
  chapterMap,
  initialPage,
  pdfViewerRef,
  pdfLoaded,
}: UsePDFChapterNavigationParams): UsePDFChapterNavigationReturn {
  /**
   * 计算章节跳转数据
   * 过滤掉 position 为 undefined 的章节
   */
  const chapterJumpData = useMemo<ChapterJumpItem[]>(() => {
    if (!file || !file.refChapter || !file.position) {
      return [];
    }

    const items: ChapterJumpItem[] = [];

    for (let i = 0; i < file.refChapter.length; i++) {
      const chapterId = file.refChapter[i];
      const position = file.position[i];

      // 跳过没有位置信息的章节
      if (!position?.startPoint?.page) {
        continue;
      }

      const chapter = chapterMap?.get(String(chapterId));
      const chapterName = chapter?.title ? `${chapter.hierarchicalNumber} ${chapter.title}` : `章节 ${chapterId}`;

      items.push({
        chapterId: String(chapterId),
        chapterName,
        startPage: position.startPoint.page,
      });
    }

    return items;
  }, [file, chapterMap]);

  /**
   * 判断是否显示 QuickJumper
   * - 如果有 initialPage，说明是外部引用跳转，不显示 Jumper
   * - 如果有 trace 数据（chapterJumpData.length >= 1），显示 Jumper
   */
  const shouldShowJumper = !initialPage && chapterJumpData.length >= 1;

  /**
   * 处理章节点击
   */
  const handleChapterClick = useCallback(
    (page: number) => {
      pdfViewerRef.current?.scrollToPage(page);
    },
    [pdfViewerRef]
  );

  /**
   * 当 PDF 加载完成且有 initialPage 时，跳转到指定页码
   */
  useEffect(() => {
    if (pdfLoaded && initialPage) {
      pdfViewerRef.current?.scrollToPage(initialPage);
    }
  }, [pdfLoaded, initialPage, pdfViewerRef]);

  return {
    chapterJumpData,
    shouldShowJumper,
    handleChapterClick,
  };
}
