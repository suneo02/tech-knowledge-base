import { PDFViewer, PDFViewerRef } from '@/components/File';
import classNames from 'classnames';
import { FC, useCallback, useRef, useState } from 'react';
import { usePDFChapterNavigation } from './hooks/usePDFChapterNavigation';
import styles from './PDFPreviewWrapper.module.less';
import { QuickJumper } from './QuickJumper';
import { PDFPreviewWrapperProps } from './types';

/**
 * PDF预览包装器组件
 *
 * @description 封装PDFPreview组件，提供统一的加载状态和错误处理，支持章节快速跳转
 * @see 设计文档 {@link ../../../../docs/specs/pdf-preview-trace-navigation/spec-design-v1.md}
 */
export const PDFPreviewWrapper: FC<PDFPreviewWrapperProps> = ({
  url,
  fileName,
  initialPage,
  file,
  chapterMap,
  onLoad,
  style,
  className,
}) => {
  const pdfViewerRef = useRef<PDFViewerRef>(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  // 使用章节导航 Hook
  const { chapterJumpData, shouldShowJumper, handleChapterClick } = usePDFChapterNavigation({
    file,
    chapterMap,
    initialPage,
    pdfViewerRef,
    pdfLoaded,
  });

  /**
   * 处理 PDF 文档加载完成
   */
  const handleDocumentLoad = useCallback(
    (totalPages: number) => {
      console.log(`PDF文档加载成功: ${fileName}, 总页数: ${totalPages}`);
      setPdfLoaded(true);
      onLoad?.();
    },
    [fileName, onLoad]
  );

  return (
    <div className={classNames(styles['pdf-preview-wrapper'], className)} style={style}>
      {shouldShowJumper && <QuickJumper chapters={chapterJumpData} onChapterClick={handleChapterClick} />}
      <div className={styles['pdf-preview-wrapper__viewer']}>
        <PDFViewer
          ref={pdfViewerRef}
          source={{ url }}
          fileName={fileName}
          initialPage={initialPage}
          onTotalChange={handleDocumentLoad}
          showHeader={false}
          showToolbar={true}
        />
      </div>
    </div>
  );
};

PDFPreviewWrapper.displayName = 'PDFPreviewWrapper';
