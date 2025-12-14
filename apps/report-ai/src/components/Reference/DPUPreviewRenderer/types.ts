import { DPUItem } from 'gel-api';
import { CSSProperties } from 'react';

/**
 * 表格预览渲染器组件属性
 */
export interface DPUPreviewRendererProps {
  /** 表格数据 */
  tableData: DPUItem;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 自定义CSS类名 */
  className?: string;
}
