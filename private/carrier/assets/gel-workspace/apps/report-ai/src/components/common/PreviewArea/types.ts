/**
 * 预览视图模式枚举
 */
export type PreviewMode = 'list' | 'preview';

/**
 * PreviewArea 组件属性接口
 */
export interface PreviewAreaProps {
  /** 当前预览模式 */
  mode: PreviewMode;
  /** 列表视图内容渲染 */
  listContent: React.ReactNode;
  /** 预览视图内容渲染 */
  previewContent?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}
