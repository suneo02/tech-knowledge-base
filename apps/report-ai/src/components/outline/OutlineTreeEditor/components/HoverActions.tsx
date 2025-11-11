/**
 * 大纲项目Hover操作组件
 *
 * @description 在hover时显示的提示文本和操作按钮
 */

import { CloseO } from '@wind/icons';
import { Button } from '@wind/wind-ui';
import { TreePath } from 'gel-util/common';
import React, { useCallback } from 'react';
import styles from './HoverActions.module.less';

export interface HoverActionsProps {
  /** 项目路径 */
  path: TreePath;
  /** 是否只读模式 */
  readonly?: boolean;
  /** 新增同级项目回调 */
  onAddSibling: (path: TreePath) => void;
  /** 删除项目回调 */
  onDelete: (path: TreePath) => void;
}

/**
 * 大纲项目Hover操作组件
 */
export const HoverActions: React.FC<HoverActionsProps> = ({ path, readonly = false, onDelete }) => {
  /**
   * 处理删除操作
   */
  const handleDelete = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onDelete(path);
    },
    [onDelete, path]
  );

  // 只读模式下不显示
  if (readonly) {
    return null;
  }

  return (
    <div className={styles['hover-actions']}>
      {/* 提示文本 */}
      <span className={styles['hover-actions__edit-hint']}>单击进行编辑</span>

      {/* 操作按钮 */}
      <div className={styles['hover-actions__buttons']}>
        {/* 删除按钮 */}
        <Button
          className={styles['hover-actions__delete-button']}
          onClick={handleDelete}
          aria-label="删除此项目"
          icon={<CloseO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          size="small"
          type="text"
        />
      </div>
    </div>
  );
};
