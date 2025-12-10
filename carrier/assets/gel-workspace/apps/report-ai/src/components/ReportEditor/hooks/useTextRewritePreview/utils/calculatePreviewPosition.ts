/**
 * 预览位置计算工具
 *
 * 根据选区位置计算悬浮容器的定位
 * 优先显示在选区下方，如果空间不足则显示在上方
 */

import { EditorFacade } from '@/domain/reportEditor';
import type { CSSProperties } from 'react';
import { getEditorFrameOffset, isEditorReady } from '../../utils/editorDomUtils';
import {
  calculateFloatingPosition,
  getFallbackCenterPosition,
  type FloatingPositionConfig,
} from '../../utils/positionCalculator';
import type { PreviewContainerConfig } from '../types';

/**
 * 默认预览容器配置
 */
export const DEFAULT_PREVIEW_CONFIG: PreviewContainerConfig = {
  width: 600,
  maxHeight: 400,
  padding: 16,
  minSpace: 200,
  zIndex: 10000,
};

/**
 * 计算预览容器的位置
 *
 * @param editorFacade 编辑器引用
 * @param config 预览容器配置
 * @returns 预览容器的样式对象，如果无法计算则返回 null
 */
export function calculatePreviewPosition(
  editorFacade: EditorFacade | null,
  config: PreviewContainerConfig = DEFAULT_PREVIEW_CONFIG
): CSSProperties | null {
  if (!isEditorReady(editorFacade)) {
    return null;
  }

  try {
    // 获取编辑器的选区
    const selection = editorFacade.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const selectionRect = range.getBoundingClientRect();

    // 获取 iframe 偏移
    const frameOffset = getEditorFrameOffset(editorFacade);

    // 计算选区在视口中的实际位置
    const anchorRect = {
      top: frameOffset.top + selectionRect.top,
      left: frameOffset.left + selectionRect.left,
      right: frameOffset.left + selectionRect.right,
      bottom: frameOffset.top + selectionRect.bottom,
      width: selectionRect.width,
      height: selectionRect.height,
    };

    // 使用统一的浮层位置计算
    const floatingConfig: FloatingPositionConfig = {
      width: config.width,
      maxHeight: config.maxHeight,
      padding: config.padding,
      minSpace: config.minSpace,
      zIndex: config.zIndex,
    };

    const result = calculateFloatingPosition(anchorRect, floatingConfig, 'center');
    return result.style;
  } catch (error) {
    return getFallbackCenterPosition(config.width, config.maxHeight, config.zIndex);
  }
}
