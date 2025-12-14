/**
 * 文件预览渲染器组件
 *
 * @description 支持多种文件格式的预览，包括PDF、图片等
 * 根据文件类型自动选择合适的预览组件
 */

export { FilePreviewRenderer } from './FilePreviewRenderer';
export type { FilePreviewRendererProps, PDFPreviewWrapperProps, TextPreviewProps } from './types';

// 导出子组件
export { PDFPreviewWrapper } from './PDFPreviewWrapper';
