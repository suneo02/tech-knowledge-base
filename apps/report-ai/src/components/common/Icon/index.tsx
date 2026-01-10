import classNames from 'classnames';
import type { CSSProperties, ReactNode } from 'react';

/**
 * IconWrapper 组件属性
 */
export interface IconWrapperProps {
  /** 图标内容（SVG ReactNode） */
  children: ReactNode;
  /** 图标尺寸（px），通过 fontSize 控制 */
  size?: number;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
}

/**
 * IconWrapper - SVG 图标包装器组件
 *
 * @description
 * 统一的 SVG 图标包装组件，用于标准化图标样式和尺寸控制。
 * 要求 SVG 的 width/height 设置为 1em，以便通过 fontSize 控制尺寸。
 *
 * @example
 * ```tsx
 * // 基础使用
 * <IconWrapper size={16}>
 *   <YourSvgIcon />
 * </IconWrapper>
 *
 * // 自定义样式
 * <IconWrapper size={20} className="custom-icon" style={{ color: '#1890ff' }}>
 *   <YourSvgIcon />
 * </IconWrapper>
 * ```
 *
 * @see 样式规范 docs/rule/code-style-less-bem-rule.md
 * @see React 规范 docs/rule/code-react-component-rule.md
 */
export const WuiIconWrapper = ({ children, size, className, style }: IconWrapperProps) => {
  const inlineStyle: CSSProperties = {
    ...style,
    ...(size && { fontSize: `${size}px` }),
  };

  return (
    <span className={classNames('wicon-svg', className)} style={inlineStyle}>
      {children}
    </span>
  );
};

