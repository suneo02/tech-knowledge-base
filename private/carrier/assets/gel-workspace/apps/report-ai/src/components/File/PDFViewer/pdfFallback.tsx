import React from 'react';

/**
 * PDF 降级方案模块
 * 当智能文本加载失败时，提供原生 PDF 查看器作为降级方案
 */

/**
 * PDF 降级查看器属性接口
 */
export interface PDFFallbackViewerProps {
  /** PDF 文件 URL */
  pdfUrl: string;
  /** PDF 文件名 */
  fileName?: string;
  /** 查看器类型 */
  viewerType?: 'object' | 'iframe' | 'embed';
}

/**
 * 使用 <object> 标签的 PDF 查看器
 *
 * 优点：
 * - 浏览器原生支持
 * - 兼容性好
 * - 支持降级提示
 *
 * @param props - 组件属性
 */
export const PDFObjectViewer: React.FC<PDFFallbackViewerProps> = ({ pdfUrl, fileName }) => {
  return (
    <object
      name={fileName}
      title={fileName}
      data={pdfUrl}
      type="application/pdf"
      style={{ width: '100%', height: 'calc(100% - 6px)', border: 'none' }}
    >
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>浏览器不支持 PDF 预览，请下载后查看：</p>
        <a href={pdfUrl} download={fileName} style={{ color: '#1890ff', textDecoration: 'underline' }}>
          {fileName || '下载 PDF'}
        </a>
      </div>
    </object>
  );
};

/**
 * 使用 <iframe> 标签的 PDF 查看器
 *
 * 优点：
 * - 简单直接
 * - 隔离性好
 *
 * 缺点：
 * - 某些浏览器可能不支持
 * - 无法提供降级提示
 *
 * @param props - 组件属性
 */
export const PDFIframeViewer: React.FC<PDFFallbackViewerProps> = ({ pdfUrl, fileName }) => {
  return (
    <iframe title={fileName} src={pdfUrl} style={{ width: '100%', height: 'calc(100% - 6px)', border: 'none' }}>
      <p>
        浏览器不支持 PDF 预览，请下载后查看：
        <a href={pdfUrl} download={fileName}>
          {fileName}
        </a>
      </p>
    </iframe>
  );
};

/**
 * 使用 <embed> 标签的 PDF 查看器
 *
 * 优点：
 * - 轻量级
 * - 兼容性较好
 *
 * 缺点：
 * - 无法提供降级提示
 * - 某些浏览器可能不支持
 *
 * @param props - 组件属性
 */
export const PDFEmbedViewer: React.FC<PDFFallbackViewerProps> = ({ pdfUrl, fileName }) => {
  return (
    <embed title={fileName} src={pdfUrl} type="application/pdf" style={{ width: '100%', height: 'calc(100% - 6px)' }} />
  );
};

/**
 * PDF 降级查看器（智能选择）
 *
 * 根据 viewerType 自动选择合适的查看器
 * 默认使用 <object> 标签，因为它提供最好的降级支持
 *
 * @param props - 组件属性
 *
 * @example
 * ```tsx
 * <PDFFallbackViewer
 *   pdfUrl={pdfUrl}
 *   fileName="document.pdf"
 *   viewerType="object"
 * />
 * ```
 */
export const PDFFallbackViewer: React.FC<PDFFallbackViewerProps> = ({ pdfUrl, fileName, viewerType = 'object' }) => {
  switch (viewerType) {
    case 'iframe':
      return <PDFIframeViewer pdfUrl={pdfUrl} fileName={fileName} />;
    case 'embed':
      return <PDFEmbedViewer pdfUrl={pdfUrl} fileName={fileName} />;
    case 'object':
    default:
      return <PDFObjectViewer pdfUrl={pdfUrl} fileName={fileName} />;
  }
};

/**
 * 检测浏览器是否支持 PDF 预览
 *
 * @returns 是否支持 PDF 预览
 */
export function isBrowserSupportPDF(): boolean {
  // 检测是否支持 PDF MIME 类型
  const mimeTypes = navigator.mimeTypes;
  if (mimeTypes && mimeTypes['application/pdf']) {
    return true;
  }

  // 检测是否为现代浏览器（通常都支持 PDF）
  const isModernBrowser = 'fetch' in window && 'Promise' in window && 'URL' in window && 'createObjectURL' in URL;

  return isModernBrowser;
}

/**
 * PDF 降级策略配置
 */
export interface PDFFallbackStrategy {
  /** 是否启用降级 */
  enabled: boolean;
  /** 降级查看器类型 */
  viewerType: 'object' | 'iframe' | 'embed';
  /** 降级提示消息 */
  message?: string;
}

/**
 * 默认降级策略
 */
export const DEFAULT_FALLBACK_STRATEGY: PDFFallbackStrategy = {
  enabled: true,
  viewerType: 'object',
  message: '智能文本加载失败，为不影响您的阅读体验，我们为您切换至原始文件，识别内容在文档中的定位功能可能失效。',
};
