/**
 * 层级编号组件
 *
 * 这个组件负责显示大纲项目的层级编号，主要功能包括：
 * - 生成层级编号（如 1, 1.1, 1.2.3）
 * - 支持多层级嵌套显示
 * - 提供清晰的视觉层级指示
 * - 响应式的编号样式
 */

import { generateChapterHierarchicalNumber } from '@/domain/chapter';
import { calculatePathLevel } from 'gel-util/common';
import React from 'react';
import { HierarchicalNumberProps } from '../types/types';
import styles from './HierarchicalNumber.module.less';

/**
 * 层级编号组件
 *
 * @param props - 组件属性
 * @returns 层级编号组件
 */
export const HierarchicalNumber: React.FC<HierarchicalNumberProps> = ({ path, className }) => {
  /**
   * 生成层级编号文本
   * 例如：[0] -> "1", [0, 1] -> "1.2", [0, 1, 2] -> "1.2.3"
   */
  const hierarchicalNumber = generateChapterHierarchicalNumber(path);

  // 组合样式类名
  const numberClasses = [styles['hierarchical-number'], className].filter(Boolean).join(' ');

  // 动态计算层级
  const level = calculatePathLevel(path);

  return (
    <div className={numberClasses} data-level={level}>
      <span className={styles['hierarchical-number__text']}>{hierarchicalNumber}</span>
    </div>
  );
};
