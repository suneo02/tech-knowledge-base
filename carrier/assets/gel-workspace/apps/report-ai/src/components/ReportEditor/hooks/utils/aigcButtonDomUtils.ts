/**
 * AIGC 按钮业务工具函数
 *
 * @description 为章节标题悬停显示的 AIGC 按钮提供业务逻辑支撑
 * 专注于定位计算、容器创建等核心业务逻辑
 */

import type { CSSProperties } from 'react';
import type { ChapterHoverInfo } from '../useChapterHoverWithInit';
import { getElementViewportPosition, getResponsiveBreakpoint } from './editorDomUtils';
import { calculateButtonPosition, type ButtonPositionConfig } from './positionCalculator';

/**
 * AIGC 按钮定位计算
 */

/**
 * 根据屏幕尺寸计算 AIGC 按钮与章节标题的间距
 */
export const calculateAIGCButtonOffset = (): number => {
  if (typeof window === 'undefined') return 12;

  const breakpoint = getResponsiveBreakpoint();
  switch (breakpoint) {
    case 'mobile':
      return 8;
    case 'tablet':
      return 10;
    case 'desktop':
    default:
      return 12;
  }
};

/**
 * 计算 AIGC 按钮相对于章节标题的显示位置
 * 按钮显示在章节标题左侧，垂直居中对齐
 */
export const calculateAIGCButtonPositionForChapter = (hoveredChapter: ChapterHoverInfo): CSSProperties => {
  // 使用统一的位置计算工具
  const chapterRect = getElementViewportPosition(hoveredChapter.element);
  const buttonOffset = calculateAIGCButtonOffset();

  const config: ButtonPositionConfig = {
    position: 'left',
    offset: buttonOffset,
    zIndex: 10001,
  };

  return calculateButtonPosition(chapterRect, config);
};

/**
 * AIGC 按钮容器管理
 *
 * @note 容器创建和管理已迁移至 externalComponentRenderer.ts
 * 保留此文件用于位置计算等业务逻辑
 */
