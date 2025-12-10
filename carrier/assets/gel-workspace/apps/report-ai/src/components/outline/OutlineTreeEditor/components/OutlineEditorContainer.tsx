/**
 * 大纲编辑器容器组件
 *
 * 这个组件负责递归渲染大纲模版树结构，主要功能包括：
 * - 递归渲染多层级的大纲模版项目
 * - 管理项目的展开/折叠状态
 * - 处理空状态显示
 * - 优化大列表的渲染性能
 * - 传递各种交互事件给子组件
 */

import { RPChapter } from 'gel-api';
import React from 'react';
import { selectEditingPath, useOutlineState } from '../context';
import { OutlineEditorContainerProps } from '../types/types';
import styles from './OutlineEditorContainer.module.less';
import { OutlineEditorItem } from './OutlineEditorItem';

/**
 * 大纲模版容器组件
 *
 * @param props - 组件属性
 * @returns 大纲模版容器组件
 */
export const OutlineEditorContainer: React.FC<OutlineEditorContainerProps> = ({
  items,
  parentPath,
  placeholder,
  readonly = false,
  ideaSummaryLines,
}) => {
  // 从 context 读取编辑状态
  const state = useOutlineState();
  const editingPath = selectEditingPath(state);
  /**
   * 渲染单个大纲项目
   *
   * @param item - 大纲项目数据
   * @param path - 项目在树中的路径
   * @returns 渲染的项目组件
   */
  const renderItem = (item: RPChapter, path: number[]) => {
    // 判断当前项目是否处于编辑状态
    const isCurrentItemEditing =
      editingPath !== null && path.length === editingPath.length && path.every((p, i) => p === editingPath[i]);

    return (
      <OutlineEditorItem
        key={item.chapterId}
        item={item}
        path={path}
        isEditing={isCurrentItemEditing}
        placeholder={placeholder}
        readonly={readonly}
        ideaSummaryLines={ideaSummaryLines}
      />
    );
  };

  /**
   * 递归渲染大纲项目树
   *
   * @param items - 项目列表
   * @param currentParentPath - 当前父级路径
   * @returns 渲染的项目树
   */
  const renderItemTree = (items: RPChapter[], currentParentPath: number[] = []) => {
    return items.map((item, index) => {
      const currentPath = [...currentParentPath, index];

      return (
        <div key={item.chapterId} className={styles['outline-container__item-wrapper']}>
          {/* 渲染当前项目 */}
          {renderItem(item, currentPath)}

          {/* 递归渲染子项目 */}
          {item.children && item.children.length > 0 && (
            <div className={styles['outline-container__children']}>{renderItemTree(item.children, currentPath)}</div>
          )}
        </div>
      );
    });
  };

  // 如果没有项目，显示空状态
  if (!items || items.length === 0) {
    return (
      <div className={styles['outline-container']}>
        <div className={styles['outline-container__empty']}>
          <div className={styles['outline-container__empty-icon']}>📝</div>
          <div className={styles['outline-container__empty-text']}>还没有大纲内容</div>
          <div className={styles['outline-container__empty-tip']}>点击上方的"添加项目"按钮开始编写您的大纲</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['outline-container']}>
      <div className={styles['outline-container__list']}>{renderItemTree(items, parentPath)}</div>
    </div>
  );
};
