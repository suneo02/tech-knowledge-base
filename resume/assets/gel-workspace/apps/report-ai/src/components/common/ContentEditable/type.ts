/**
 * 可编辑内容组件的属性接口
 *
 * 提供富文本编辑功能的内容区域
 */
export interface ContentEditableProps {
  /** 当前的文本内容 */
  content: string;

  /** 占位符文本 */
  placeholder: string;

  /** 是否自动聚焦 */
  autoFocus?: boolean;

  /** 是否为只读模式（预览模式） */
  readonly?: boolean;

  /** 内容变更的回调函数 */
  onContentChange: (content: string) => void;

  /** 聚焦时的回调函数 */
  onFocus: () => void;

  /** 失去焦点时的回调函数 */
  onBlur?: () => void;

  /** 键盘事件的回调函数 */
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;

  /** 额外的CSS类名 */
  className?: string;

  /** 自动调整大小配置 */
  autoSize?: { minRows?: number; maxRows?: number };
}
