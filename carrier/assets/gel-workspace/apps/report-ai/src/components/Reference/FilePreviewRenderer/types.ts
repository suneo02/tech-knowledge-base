import { RPFileTraced } from 'gel-api';

/**
 * 文件预览渲染器属性接口
 */
export interface FilePreviewRendererProps {
  /** 文件数据 */
  file: RPFileTraced;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 文件加载完成回调 */
  onLoad?: () => void;
  /** 文件加载失败回调 */
  onError?: (error: Error) => void;
}

/**
 * PDF预览组件属性
 */
export interface PDFPreviewWrapperProps {
  /** 文件URL */
  url: string;
  /** 文件名 */
  fileName: string;
  /** 加载完成回调 */
  onLoad?: () => void;
  /** 加载失败回调 */
  onError?: (error: Error) => void;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
}

/**
 * 文本预览组件属性
 */
export interface TextPreviewProps {
  /** 文本内容URL */
  url: string;
  /** 文件名 */
  fileName: string;
  /** 加载完成回调 */
  onLoad?: () => void;
  /** 加载失败回调 */
  onError?: (error: Error) => void;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
}
