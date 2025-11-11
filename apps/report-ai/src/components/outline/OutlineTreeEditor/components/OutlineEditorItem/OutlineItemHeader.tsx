/**
 * 大纲项目头部组件
 *
 * @description 负责渲染大纲项目的标题和操作按钮
 */

import { CheckO, DeleteO, PlusO } from '@wind/icons';
import { TreePath } from 'gel-util/common';
import React from 'react';
import { ContentEditable } from '../../../../common';
import { useOutlineItemHeaderKeyboard } from '../../hooks/useOutlineItemHeaderKeyboard';
import { useOutlineItemHeaderState } from '../../hooks/useOutlineItemHeaderState';
import { HierarchicalNumber } from '../HierarchicalNumber';
import { HoverActions } from '../HoverActions';
import { ShortcutTooltip } from '../ShortcutTooltip';
import styles from './OutlineItemHeader.module.less';

export interface OutlineItemHeaderProps {
  /** 项目路径 */
  path: TreePath;
  /** 是否编辑中 */
  isEditing: boolean;
  /** 占位符文本 */
  placeholder: string;
  /** 是否只读 */
  readonly: boolean;
}

/**
 * 大纲项目头部组件
 */
export const OutlineItemHeader: React.FC<OutlineItemHeaderProps> = ({ path, isEditing, placeholder, readonly }) => {
  // 使用状态管理 Hook
  const {
    title,
    editingTitle,
    setEditingTitle,
    containerRef,
    contentRef,
    handleTitleChange,
    handleTitleClick,
    handleFocus,
    handleConfirm,
    handleDelete,
    handleAddSibling,
    handleAddSiblingMouseDown,
    isGeneratingThought,
  } = useOutlineItemHeaderState({ path, isEditing, placeholder, readonly });

  // 使用专门的键盘事件处理 Hook
  const { handleKeyDown } = useOutlineItemHeaderKeyboard({
    isEditing,
    title,
    path,
    onConfirm: handleConfirm,
    onAddSibling: handleAddSibling,
    setEditingTitle,
  });

  return (
    <div ref={containerRef} className={styles['outline-item-header']}>
      {isEditing ? (
        /* 编辑模式布局 */
        <div className={styles['outline-item-header__edit-mode']}>
          {/* 左侧：添加同级图标 */}
          <PlusO
            className={styles['outline-item-header__add-sibling']}
            onClick={handleAddSibling}
            onMouseDown={handleAddSiblingMouseDown}
            aria-label="新增同级项目"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          {/* 层级编号 */}
          <HierarchicalNumber path={path} className={styles['outline-item-header__number']} />

          {/* 中间：标题输入框容器 */}
          <div className={styles['outline-item-header__editor-container']}>
            <ContentEditable
              ref={contentRef}
              content={editingTitle}
              placeholder={placeholder}
              autoFocus={true}
              readonly={readonly}
              onContentChange={handleTitleChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              className={styles['outline-item-header__editor']}
            />
            {/* 快捷键提示按钮 */}
            <ShortcutTooltip>
              <span className={styles['outline-item-header__help-button']}>?</span>
            </ShortcutTooltip>
          </div>

          {/* 右侧：删除图标 */}
          <DeleteO
            className={styles['outline-item-header__delete']}
            onClick={handleDelete}
            aria-label="删除此项目"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />

          {/* 最右侧：确认图标 */}
          <CheckO
            className={styles['outline-item-header__confirm']}
            onClick={handleConfirm}
            aria-label="确认保存"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        </div>
      ) : (
        /* 查看模式布局 */
        <div className={styles['outline-item-header__view-mode']}>
          {/* 占位空间 - 保持与编辑模式按钮位置一致 */}
          <div className={styles['outline-item-header__placeholder-space']} />

          {/* 层级编号 */}
          <HierarchicalNumber path={path} className={styles['outline-item-header__number']} />

          {/* 标题显示区域 - 点击进入编辑 */}
          <div className={styles['outline-item-header__title']} onClick={handleTitleClick}>
            {title || placeholder}
          </div>

          {/* hover时显示的提示文本和操作按钮 */}
          <HoverActions
            path={path}
            readonly={readonly || isGeneratingThought}
            onAddSibling={handleAddSibling}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};
