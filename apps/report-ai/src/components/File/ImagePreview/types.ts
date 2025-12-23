import { RPFileTraced } from 'gel-api';

/**
 * 图片预览组件属性
 */
export interface ImagePreviewProps {
  /** 图片URL */
  url: string;
  /** 图片文件名 */
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
 * 不支持预览的文件组件属性
 */
export interface UnsupportedFilePreviewProps {
  /** 文件数据 */
  file: RPFileTraced;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
}
