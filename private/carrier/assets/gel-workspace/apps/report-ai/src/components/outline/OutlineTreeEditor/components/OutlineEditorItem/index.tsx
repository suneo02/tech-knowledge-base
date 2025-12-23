/**
 * 大纲编辑器项目组件
 *
 * @description 负责渲染单个大纲项目，组合标题和编写思路组件
 */

import { createPathKey } from '@/components/outline/pathUtils';
import { calculatePathLevel } from 'gel-util/common';
import React from 'react';
import { selectFocusedPath, selectIsEditingTitle, useOutlineState } from '../../context';
import { OutlineEditorItemProps } from '../../types/types';
import { OutlineItemHeader } from './OutlineItemHeader';
import { OutlineItemKeywords } from './OutlineItemKeywords';
import { OutlineItemWritingThought } from './OutlineItemWritingThought';
import styles from './index.module.less';

/**
 * 大纲编辑器项目组件
 */
export const OutlineEditorItem: React.FC<OutlineEditorItemProps> = ({
  item,
  path,
  placeholder,
  readonly = false,
  ideaSummaryLines = 10,
}) => {
  // 读取状态用于样式计算
  const state = useOutlineState();
  const focusedPath = selectFocusedPath(state);
  const isEditingTitle = selectIsEditingTitle(state, path);
  const isFocused =
    focusedPath !== null && path.length === focusedPath.length && path.every((p, i) => p === focusedPath[i]);

  const level = calculatePathLevel(path);
  const hasChildren = item.children && item.children.length > 0;
  const isLeaf = !hasChildren;

  // 组合CSS类名
  const itemClasses = [
    styles['outline-item'],
    isFocused && styles['outline-item--focused'],
    !item.title.trim() && styles['outline-item--empty'],
    hasChildren && styles['outline-item--has-children'],
    readonly && styles['outline-item--readonly'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={itemClasses} data-level={level} data-path={createPathKey(path)}>
      {/* 项目头部（标题和操作按钮） */}
      <OutlineItemHeader path={path} isEditing={isEditingTitle} placeholder={placeholder} readonly={readonly} />

      {/* 关键词编辑区域 - 只在叶子节点显示 */}
      {isLeaf && <OutlineItemKeywords path={path} readonly={readonly} />}

      {/* 编写思路区域 - 只在叶子节点显示 */}
      {isLeaf && <OutlineItemWritingThought path={path} readonly={readonly} ideaSummaryLines={ideaSummaryLines} />}
    </div>
  );
};
