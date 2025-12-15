/**
 * 位置计算工具
 *
 * @description 提供统一的浮层、弹窗、按钮等元素的位置计算逻辑
 * 支持自动避让、响应式调整、边界检测等功能
 */

import type { CSSProperties } from 'react';
import { getViewportSize, type RectPosition } from './editorDomUtils';

/**
 * ==================== 位置计算配置 ====================
 */

/**
 * 浮层位置配置
 */
export interface FloatingPositionConfig {
  /** 浮层宽度 */
  width: number;
  /** 浮层最大高度 */
  maxHeight: number;
  /** 边距 */
  padding: number;
  /** 最小可用空间 */
  minSpace: number;
  /** z-index */
  zIndex: number;
}

/**
 * 默认浮层配置
 */
export const DEFAULT_FLOATING_CONFIG: FloatingPositionConfig = {
  width: 600,
  maxHeight: 400,
  padding: 16,
  minSpace: 200,
  zIndex: 10000,
};

/**
 * ==================== 垂直位置计算 ====================
 */

/**
 * 垂直位置计算结果
 */
export interface VerticalPositionResult {
  top: number;
  maxHeight: number;
  placement: 'above' | 'below';
}

/**
 * 计算垂直位置（上方或下方）
 * 优先显示在下方，空间不足时显示在上方
 */
export const calculateVerticalPosition = (
  anchorTop: number,
  anchorBottom: number,
  config: FloatingPositionConfig
): VerticalPositionResult => {
  const viewport = getViewportSize();
  const spaceBelow = viewport.height - anchorBottom - config.padding;
  const spaceAbove = anchorTop - config.padding;

  let top: number;
  let maxHeight: number;
  let placement: 'above' | 'below';

  // 优先显示在下方
  if (spaceBelow >= config.minSpace) {
    top = anchorBottom + config.padding;
    maxHeight = Math.min(config.maxHeight, spaceBelow);
    placement = 'below';
  }
  // 上方空间充足
  else if (spaceAbove >= config.minSpace) {
    maxHeight = Math.min(config.maxHeight, spaceAbove);
    top = anchorTop - config.padding - maxHeight;
    placement = 'above';
  }
  // 两侧空间都不足，使用较大的一侧
  else {
    if (spaceBelow > spaceAbove) {
      top = anchorBottom + config.padding;
      maxHeight = Math.min(config.maxHeight, spaceBelow);
      placement = 'below';
    } else {
      maxHeight = Math.min(config.maxHeight, spaceAbove);
      top = anchorTop - config.padding - maxHeight;
      placement = 'above';
    }
  }

  // 确保不超出视口顶部
  top = Math.max(config.padding, top);

  return { top, maxHeight, placement };
};

/**
 * ==================== 水平位置计算 ====================
 */

/**
 * 水平对齐方式
 */
export type HorizontalAlignment = 'left' | 'center' | 'right';

/**
 * 水平位置计算结果
 */
export interface HorizontalPositionResult {
  left: number;
  alignment: HorizontalAlignment;
}

/**
 * 计算水平位置（居中对齐，但不超出视口）
 */
export const calculateHorizontalPosition = (
  anchorLeft: number,
  anchorRight: number,
  width: number,
  padding: number,
  preferredAlignment: HorizontalAlignment = 'center'
): HorizontalPositionResult => {
  const viewport = getViewportSize();
  const anchorCenter = (anchorLeft + anchorRight) / 2;

  let left: number;
  let alignment: HorizontalAlignment = preferredAlignment;

  switch (preferredAlignment) {
    case 'left':
      left = anchorLeft;
      break;
    case 'right':
      left = anchorRight - width;
      break;
    case 'center':
    default:
      left = anchorCenter - width / 2;
      break;
  }

  // 边界检测和调整
  const minLeft = padding;
  const maxLeft = viewport.width - width - padding;

  if (left < minLeft) {
    left = minLeft;
    alignment = 'left';
  } else if (left > maxLeft) {
    left = maxLeft;
    alignment = 'right';
  }

  return { left, alignment };
};

/**
 * ==================== 浮层位置计算 ====================
 */

/**
 * 浮层位置计算结果
 */
export interface FloatingPositionResult {
  style: CSSProperties;
  placement: 'above' | 'below';
  alignment: HorizontalAlignment;
}

/**
 * 计算浮层位置（相对于锚点元素）
 * 返回完整的 CSS 样式对象
 */
export const calculateFloatingPosition = (
  anchorRect: RectPosition,
  config: FloatingPositionConfig = DEFAULT_FLOATING_CONFIG,
  horizontalAlignment: HorizontalAlignment = 'center'
): FloatingPositionResult => {
  // 计算垂直位置
  const vertical = calculateVerticalPosition(anchorRect.top, anchorRect.bottom, config);

  // 计算水平位置
  const horizontal = calculateHorizontalPosition(
    anchorRect.left,
    anchorRect.right,
    config.width,
    config.padding,
    horizontalAlignment
  );

  return {
    style: {
      position: 'fixed',
      top: `${vertical.top}px`,
      left: `${horizontal.left}px`,
      width: `${config.width}px`,
      maxHeight: `${vertical.maxHeight}px`,
      zIndex: config.zIndex,
      pointerEvents: 'auto',
    },
    placement: vertical.placement,
    alignment: horizontal.alignment,
  };
};

/**
 * ==================== 按钮位置计算 ====================
 */

/**
 * 按钮相对位置
 */
export type ButtonRelativePosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * 按钮位置配置
 */
export interface ButtonPositionConfig {
  /** 按钮相对于锚点的位置 */
  position: ButtonRelativePosition;
  /** 偏移距离 */
  offset: number;
  /** z-index */
  zIndex: number;
}

/**
 * 计算按钮位置（相对于锚点元素）
 */
export const calculateButtonPosition = (anchorRect: RectPosition, config: ButtonPositionConfig): CSSProperties => {
  const { position, offset, zIndex } = config;
  let top: number;
  let left: number;
  let transform: string;

  switch (position) {
    case 'left':
      // 按钮在锚点左侧，垂直居中
      top = anchorRect.top + anchorRect.height / 2;
      left = anchorRect.left - offset;
      transform = 'translate(-100%, -50%)';
      break;

    case 'right':
      // 按钮在锚点右侧，垂直居中
      top = anchorRect.top + anchorRect.height / 2;
      left = anchorRect.right + offset;
      transform = 'translate(0, -50%)';
      break;

    case 'top':
      // 按钮在锚点上方，水平居中
      top = anchorRect.top - offset;
      left = anchorRect.left + anchorRect.width / 2;
      transform = 'translate(-50%, -100%)';
      break;

    case 'bottom':
      // 按钮在锚点下方，水平居中
      top = anchorRect.bottom + offset;
      left = anchorRect.left + anchorRect.width / 2;
      transform = 'translate(-50%, 0)';
      break;
  }

  return {
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    transform,
    zIndex,
    pointerEvents: 'auto',
  };
};

/**
 * ==================== 降级位置计算 ====================
 */

/**
 * 获取降级位置（视口中央）
 */
export const getFallbackCenterPosition = (width: number, height: number, zIndex: number = 10000): CSSProperties => {
  const viewport = getViewportSize();
  const left = (viewport.width - width) / 2;
  const top = (viewport.height - height) / 2;

  return {
    position: 'fixed',
    top: `${Math.max(0, top)}px`,
    left: `${Math.max(0, left)}px`,
    width: `${width}px`,
    maxHeight: `${height}px`,
    zIndex,
    pointerEvents: 'auto',
  };
};
