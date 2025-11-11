import { CopyIcon } from '@/assets/icon';
import { PDFLoadState, usePdfLoader, type PDFSource } from '@/hooks/usePdfLoader';
import { message, Spin } from '@wind/wind-ui';
import { useSize } from 'ahooks';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { PDFPagination, PDFToolbar, ScaleSelector } from './components';
import { usePage, usePDFNavigation, usePDFScroll, useRotate, useScale } from './hooks';
import { PDFDocument } from './PDFDocument';
import { DEFAULT_FALLBACK_STRATEGY, PDFFallbackViewer } from './pdfFallback';
import styles from './PDFViewer.module.less';
import { PDFSelectionModel } from './types';

/**
 * PDF 查看器控制器引用接口
 * 用于通过 ref 暴露给父组件的方法
 */
export interface PDFViewerRef {
  /** 滚动到指定页码 */
  scrollToPage(page: number): void;
  /** 滚动到指定页面的指定元素 */
  scrollToElement(page: number, elementId: string): void;
  /** 获取当前页码 */
  getCurrentPage(): number;
  /** 获取总页数 */
  getTotalPages(): number;
}

// PDFSource 和 PDFLoadState 类型已移至 @/hooks/usePdfLoader
export type { PDFLoadState, PDFSource } from '@/hooks/usePdfLoader';

/**
 * PDF 查看器组件属性接口
 */
export interface PDFViewerProps {
  /** PDF 文件名（用于显示和下载） */
  fileName?: string;
  /** PDF 加载源配置 */
  source: PDFSource;
  /** 总页数变化回调 */
  onTotalChange?(totalPages: number): void;
  /** 当前页码变化回调 */
  onPageChange?(currentPage: number): void;
  /** PDF 加载状态变化回调 */
  onLoadStateChange?(state: PDFLoadState): void;
  /** 页面选区文本映射，key 为页码，value 为选区数组 */
  selectionTextMap?: Record<number, PDFSelectionModel[]>;
  /** 是否显示工具栏，默认 true */
  showToolbar?: boolean;
  /** 是否显示头部（文件名和分页器），默认 true */
  showHeader?: boolean;
  /** 初始缩放比例，默认 1 (100%) */
  initialScale?: number;
  /** 初始旋转角度，默认 0 */
  initialRotate?: number;
  /** 初始页码，默认 1 */
  initialPage?: number;
}

/**
 * PDF 查看器组件
 * 用于在报表分析流程中展示和操作 PDF 文档
 * 支持放大缩小、旋转、翻页、定位到指定页面、文本高亮选区等功能
 *
 * @see 需求文档 {@link ../../../../docs/RPDetail/Reference/01-requirement.md}
 * @see 设计文档 {@link ../../../../docs/RPDetail/Reference/02-design.md}
 * @see 技术选型 {@link ../../../../docs/RPDetail/Reference/presearch.md}
 *
 * @example
 * ```tsx
 * // 方式1: 直接提供 URL
 * <PDFViewer source={{ url: '/path/to/file.pdf' }} fileName="document.pdf" />
 *
 * // 方式2: 提供 Blob 对象
 * <PDFViewer source={{ file: pdfBlob }} fileName="document.pdf" />
 *
 * // 方式3: 提供加载函数（推荐用于复杂场景）
 * <PDFViewer
 *   source={{
 *     loader: async () => {
 *       // 使用项目级别的 PDF 服务
 *       return await pdfService.loadPdfFromGFS('path', 'file.pdf');
 *     }
 *   }}
 *   fileName="document.pdf"
 * />
 * ```
 */
export const PDFViewer = forwardRef<PDFViewerRef, PDFViewerProps>(
  (
    {
      fileName,
      source,
      onTotalChange,
      onPageChange,
      onLoadStateChange,
      selectionTextMap,
      showToolbar = true,
      showHeader = true,
      initialScale,
      initialRotate,
      initialPage,
    },
    ref
  ) => {
    // 使用项目级别的 PDF 加载 Hook
    const { url: pdfURL, file: pdfFile, state: loadState } = usePdfLoader(source, onLoadStateChange);

    // 获取容器宽度，用于自适应 PDF 显示
    const domRef = useRef<HTMLDivElement>(null);
    const size = useSize(domRef);
    const width = size?.width || 0;

    // 分页相关状态和方法
    const { currentPage, totalPage, setCurrentPage, setTotalPage } = usePage();
    // 缩放相关状态和方法
    const { currentScale, zoomIn, zoomOut, setCurrentScale } = useScale();
    // 旋转相关状态和方法
    const { rotate, onRotate, setRotate } = useRotate();

    // 是否显示原始 PDF（智能文本加载失败时的降级方案）
    const [showOrigin, setShowOrigin] = useState(false);

    // 滚动管理
    const { scrollRef, scrollToPage, scrollToDom, timerRef } = usePDFScroll({
      onPageChange: setCurrentPage,
    });

    // 页面导航
    const { onJumpPage, onNextPage, onPreviousPage } = usePDFNavigation({
      currentPage,
      totalPage,
      setCurrentPage,
      scrollToPage,
    });

    // 暂存的定位请求（用于 PDF 加载完成前的跳转请求）
    const pendingScrollRef = useRef<{ page: number; elementId?: string } | null>(null);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      scrollToPage: (page: number) => {
        if (totalPage > 0) {
          scrollToPage(page);
        } else {
          // PDF 未加载完成，暂存请求
          pendingScrollRef.current = { page };
        }
      },
      scrollToElement: (page: number, elementId: string) => {
        if (totalPage > 0) {
          scrollToDom(elementId, page);
        } else {
          // PDF 未加载完成，暂存请求
          pendingScrollRef.current = { page, elementId };
        }
      },
      getCurrentPage: () => currentPage,
      getTotalPages: () => totalPage,
    }));

    // 设置初始缩放比例
    useEffect(() => {
      if (initialScale !== undefined) {
        const scaleItem = { value: initialScale, name: `${Math.round(initialScale * 100)}%` };
        setCurrentScale(scaleItem);
      }
    }, [initialScale, setCurrentScale]);

    // 设置初始旋转角度
    useEffect(() => {
      if (initialRotate !== undefined) {
        setRotate(initialRotate);
      }
    }, [initialRotate, setRotate]);

    // 设置初始页码
    useEffect(() => {
      if (initialPage !== undefined && totalPage > 0 && initialPage <= totalPage) {
        scrollToPage(initialPage);
      }
    }, [initialPage, totalPage, scrollToPage]);

    // 总页数变化时通知父组件
    useEffect(() => {
      onTotalChange?.(totalPage);
    }, [totalPage, onTotalChange]);

    // 当前页码变化时通知父组件
    useEffect(() => {
      onPageChange?.(currentPage);
    }, [currentPage, onPageChange]);

    /**
     * PDF 加载失败处理
     * 切换到原始 PDF 展示模式（降级方案）
     */
    const loadErrorHandler = () => {
      message.info(DEFAULT_FALLBACK_STRATEGY.message);
      setShowOrigin(true);
    };

    // 监听 PDF 加载错误事件
    useEffect(() => {
      document.addEventListener('loadPdfError', loadErrorHandler);

      return () => {
        timerRef.current && clearTimeout(timerRef.current);
        document.removeEventListener('loadPdfError', loadErrorHandler);
      };
    }, [pdfURL]);

    /**
     * 处理 PDF 总页数加载完成
     */
    const handleTotalPageLoaded = (pages: number) => {
      setTotalPage(pages);
      // 处理暂存的跳转请求
      if (pendingScrollRef.current) {
        const { page, elementId } = pendingScrollRef.current;
        if (elementId) {
          scrollToDom(elementId, page);
        } else {
          scrollToPage(page);
        }
        pendingScrollRef.current = null;
      }
    };

    return (
      <div className={styles['pdf-viewer']} ref={domRef}>
        {showOrigin ? (
          <PDFFallbackViewer pdfUrl={pdfURL} fileName={fileName} viewerType="object" />
        ) : (
          <>
            {showHeader && (
              <div className={styles['pdf-viewer__header']}>
                <div className={styles['pdf-viewer__file-name']}>{fileName}</div>
                <PDFPagination
                  currentPage={currentPage}
                  totalPage={totalPage}
                  onPrevious={onPreviousPage}
                  onNext={onNextPage}
                  onJumpPage={onJumpPage}
                  data-uc-id="x5XluQX-o_j"
                  data-uc-ct="pdfpagination"
                />
                <ScaleSelector
                  scaleName={currentScale.name}
                  onZoomIn={zoomIn}
                  onZoomOut={zoomOut}
                  data-uc-id="3e4oPhZs3j-"
                  data-uc-ct="scaleselector"
                />
              </div>
            )}
            <div className={styles['pdf-viewer__scroll-container']} ref={scrollRef}>
              {loadState === 'loading' ? (
                <div className={styles['pdf-viewer__loading']}>
                  <Spin spinning />
                </div>
              ) : loadState === 'error' ? (
                <div className={styles['pdf-viewer__error']}>
                  <p>PDF 加载失败，请稍后重试</p>
                </div>
              ) : (
                <>
                  <PDFDocument
                    fileURL={pdfURL}
                    file={pdfFile}
                    width={Math.round(width)}
                    scale={currentScale.value}
                    totalPage={totalPage}
                    setTotalPage={handleTotalPageLoaded}
                    selectionTextMap={selectionTextMap}
                    rotate={rotate}
                    data-uc-id="UaXDhKtHOST"
                    data-uc-ct="pdfviewer"
                  />
                  <CopyIcon />
                </>
              )}
            </div>
            {showToolbar && (pdfURL || pdfFile) && (
              <PDFToolbar
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onRotate={onRotate}
                data-uc-id="HGHLdCOljq3"
                data-uc-ct="pdftoolbar"
              />
            )}
          </>
        )}
      </div>
    );
  }
);

PDFViewer.displayName = 'PDFViewer';
