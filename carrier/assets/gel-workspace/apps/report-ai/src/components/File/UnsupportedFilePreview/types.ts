import { RPFileTraced } from 'gel-api';

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
