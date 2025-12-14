/**
 * PDF 文档渲染组件
 * 基于 react-pdf 实现 PDF 页面渲染，支持懒加载和文本选区高亮
 *
 * @see 设计文档 {@link ../../../../docs/RPDetail/Reference/02-design.md}
 */

import React, { useEffect, useMemo, useState } from 'react';
import styles from './PDFDocument.module.less';

import { isDev } from '@/utils';
import { Spin } from '@wind/wind-ui';
import { GELService, generatePrefixUrl } from 'gel-util/link';
import { range } from 'lodash-es';
import { OnDocumentLoadSuccess } from 'node_modules/react-pdf/dist/esm/shared/types';
import path from 'path-browserify';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { LazyToLoad } from './lazyToLoad';
import { PDFSelectionModel } from './types';

// 配置 PDF.js Worker
// 根据不同环境配置 Worker 文件路径
const getPdfJsPath = (filename: string) =>
  path.join('/', generatePrefixUrl({ service: GELService.ReportAI, isDev }), 'pdfjs', filename);

pdfjs.GlobalWorkerOptions.workerSrc = getPdfJsPath('pdf.worker.min.js');

// PDF.js 配置选项
// cMapUrl: 字符映射文件路径，用于支持中文、日文、韩文等非拉丁字符
// cMapPacked: 使用压缩的 CMap 文件以提高加载性能
const options = {
  cMapUrl: getPdfJsPath('cmaps/'),
  cMapPacked: true,
};

/**
 * PDF 文档渲染器组件属性
 */
interface PDFDocumentProps {
  /** PDF 文件 URL */
  fileURL?: string;
  /** PDF 文件 Blob 对象 */
  file?: Blob;
  /** 显示宽度 */
  width: number;
  /** 缩放比例 */
  scale?: number;
  /** 旋转角度（度） */
  rotate?: number;
  /** 总页数 */
  totalPage: number;
  /** 设置总页数的回调函数 */
  setTotalPage(p: number): void;
  /** 页面选区映射表，key 为页码 */
  selectionTextMap?: Record<number, PDFSelectionModel[]>;
}

/**
 * 计算实际显示宽度
 * @param containerWidth 容器宽度
 * @param scale 缩放比例
 * @returns 实际显示宽度
 */
const calculateDisplayWidth = (containerWidth: number, scale: number): number => {
  return containerWidth * 0.8 * scale;
};

/**
 * PDF 文档渲染器组件
 * 基于 react-pdf 实现的 PDF 文档渲染
 * 支持懒加载、文本选区高亮、缩放、旋转等功能
 *
 * @example
 * ```tsx
 * <PDFDocument
 *   fileURL="/path/to/document.pdf"
 *   width={800}
 *   scale={1}
 *   rotate={0}
 *   totalPage={totalPage}
 *   setTotalPage={setTotalPage}
 * />
 * ```
 */
const PDFDocumentInner: React.FC<PDFDocumentProps> = ({
  fileURL,
  file,
  width,
  scale = 1,
  rotate = 0,
  totalPage,
  setTotalPage,
  selectionTextMap,
}) => {
  // 计算实际显示宽度（容器宽度的 80% 再乘以缩放比例）
  const domWidth = useMemo(() => calculateDisplayWidth(width, scale), [width, scale]);

  // PDF 文档代理对象
  const [pdfProxy, setPdfProxy] = useState<Parameters<OnDocumentLoadSuccess>[0] | null>(null);

  // 页面原始尺寸（未缩放）
  const [pageWH, setPageWH] = useState<{ height: number; width: number }>();
  // 页面实际渲染尺寸（已缩放）
  const [realWH, setRealWH] = useState<{ height: number; width: number }>();
  // 实际缩放比例
  const [realScale, setRealScale] = useState<number>();

  /**
   * PDF 文档加载成功回调
   * @param proxy PDF 文档代理对象
   */
  const onDocumentLoadSuccess: OnDocumentLoadSuccess = (proxy) => {
    setPdfProxy(proxy);
    setTotalPage(proxy.numPages);
  };

  // 获取第一页的原始尺寸，用于后续计算
  useEffect(() => {
    if (!pdfProxy) return;

    pdfProxy.getPage(1).then((pageProxy) => {
      const { height, width } = pageProxy.getViewport({ scale: 1 });
      setPageWH({ height, width });
    });
  }, [pdfProxy]);

  // 根据容器宽度和页面原始尺寸计算实际缩放比例和渲染尺寸
  useEffect(() => {
    if (!pageWH || !width) return;

    const rScale = domWidth / pageWH.width;
    const h = rScale * pageWH.height;

    setRealScale(rScale);
    setRealWH({ width: domWidth, height: h });
  }, [domWidth, pageWH, width]);

  // 生成页码数组，用于渲染所有页面
  const pages = useMemo(() => range(0, totalPage), [totalPage]);

  return (
    <div style={{ width: domWidth, margin: 'auto', overflow: 'hidden' }}>
      <Document
        options={options}
        className={styles.pdf}
        file={file || fileURL}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(e) => {
          console.log('onLoadError', e);
        }}
        loading={
          <div className={styles['pdf-document__loading']}>
            <Spin spinning />
          </div>
        }
        data-uc-id="0gz3OjOtCBZ"
        data-uc-ct="document"
      >
        {realWH &&
          pages.map((v) => {
            const pageNum = v + 1;
            return (
              <LazyToLoad
                page={pageNum}
                key={pageNum}
                scale={realScale}
                width={realWH.width}
                height={realWH.height}
                selectionText={selectionTextMap?.[pageNum]}
                rotate={rotate}
                data-uc-id={`UmOXaXvp35H${pageNum}`}
                data-uc-ct="lazytoload"
                data-uc-x={pageNum}
              >
                {(visible, first, onRenderSuccess) => {
                  return visible || !first ? (
                    <Page
                      key={pageNum}
                      pageNumber={pageNum}
                      width={domWidth}
                      // scale={realScale}
                      rotate={rotate}
                      renderTextLayer={true}
                      renderAnnotationLayer={false}
                      loading={
                        <div className={styles['pdf-document__loading']}>
                          <Spin spinning />
                        </div>
                      }
                      onRenderSuccess={onRenderSuccess}
                      onRenderError={(e) => {
                        console.log('Page onRenderError', e);
                      }}
                      data-uc-id={`Kdb_uA6Y3b1${pageNum}`}
                      data-uc-ct="page"
                      data-uc-x={pageNum}
                    />
                  ) : null;
                }}
              </LazyToLoad>
            );
          })}
      </Document>
    </div>
  );
};

// 使用 React.memo 优化性能，避免不必要的重渲染
export const PDFDocument = React.memo(PDFDocumentInner);
