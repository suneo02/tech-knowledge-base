/**
 * 大纲项目编写思路组件
 *
 * @description 负责渲染大纲项目的编写思路编辑区域
 */

import { TreePath } from 'gel-util/common';
import React, { useCallback, useEffect, useState } from 'react';
import { ContentEditable } from '../../../../common';
import { AliceGenerating } from '../../../../common/Generating';
import {
  OutlineAction,
  selectChapterByPath,
  selectIsEditingThought,
  selectIsGeneratingThought,
  useOutlineDispatch,
  useOutlineState,
} from '../../context';
import { useOutlineOperationsContext } from '../../context/operations';
import styles from './OutlineItemWritingThought.module.less';

export interface OutlineItemWritingThoughtProps {
  /** 项目路径 */
  path: TreePath;
  /** 是否只读 */
  readonly: boolean;
  /** 思路摘要显示的行数 */
  ideaSummaryLines: number;
}

/**
 * 大纲项目编写思路组件
 */
export const OutlineItemWritingThought: React.FC<OutlineItemWritingThoughtProps> = ({
  path,
  readonly,
  ideaSummaryLines,
}) => {
  // 直接从 context 读取状态和操作
  const state = useOutlineState();
  const dispatch = useOutlineDispatch();
  const { updateThought, markUnsaved, pauseThought } = useOutlineOperationsContext();

  // 读取状态
  const chapter = selectChapterByPath(state, path);
  const isGenerating = selectIsGeneratingThought(state, path);
  const isEditingThought = selectIsEditingThought(state, path); // 检查是否正在编辑这个思路
  const writingThought = chapter?.writingThought || '';

  // 状态设置函数
  const setEditingPath = useCallback(
    (newPath: TreePath | null) => {
      dispatch({
        type: OutlineAction.SET_ACTIVE_ITEM,
        payload: newPath ? { path: newPath, mode: 'editing', editingType: 'thought' } : null,
      });
    },
    [dispatch]
  );

  // 内部回调函数
  const onFocus = useCallback(
    (itemPath: TreePath) => {
      // 进入编辑模式
      setEditingPath(itemPath);
    },
    [setEditingPath]
  );

  const onBlur = useCallback(() => {
    // 退出编辑模式
    setEditingPath(null);
  }, [setEditingPath]);

  // 本地编辑状态，用于即时更新UI
  const [localThought, setLocalThought] = useState(writingThought);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const { key } = event;

      if (key === 'Escape') {
        // Esc: 退出编辑模式（内容已通过自动保存处理）
        event.preventDefault();
        setEditingPath(null);
        return;
      }
    },
    [setEditingPath]
  );

  const onStopGenerating = useCallback(() => {
    pauseThought(path);
  }, [path, pauseThought]);

  // 同步外部 props 变化到本地状态
  useEffect(() => {
    setLocalThought(writingThought);
  }, [writingThought]);

  /**
   * 处理编写思路变更 - 立即更新本地状态，防抖调用接口
   */
  const handleWritingThoughtChange = useCallback(
    (text: string) => {
      // 立即更新本地状态，保证UI响应性
      setLocalThought(text);
      // 标记为未保存，便于其他模块感知
      markUnsaved();
      // 借助 SaveController 的自动保存能力（内部带去抖）
      updateThought(path, text, { mode: 'auto' }).catch((error) => {
        console.error('Auto saving writing thought failed:', error);
      });
    },
    [path, markUnsaved, updateThought]
  );

  /**
   * 处理聚焦事件 - 进入编辑模式
   */
  const handleFocus = useCallback(() => {
    onFocus(path);
  }, [onFocus, path]);

  /**
   * 处理失焦事件 - 退出编辑模式
   */
  const handleBlur = useCallback(() => {
    onBlur();
  }, [onBlur]);

  /**
   * 处理停止生成事件
   */
  const handleStopGenerating = useCallback(() => {
    onStopGenerating();
  }, [onStopGenerating]);

  // 在生成过程中禁用编辑
  const isDisabled = readonly || isGenerating;

  return (
    <div className={styles['outline-item-writing-thought']}>
      {isGenerating ? (
        /* 生成中状态：只显示 AliceGenerating 组件 */
        <div className={styles['outline-item-writing-thought__container']}>
          <AliceGenerating onStop={handleStopGenerating} />
        </div>
      ) : isEditingThought ? (
        /* 编辑状态：显示编辑器，使用统一的编辑器容器样式 */
        <div className={styles['outline-item-writing-thought__container--editing']}>
          <ContentEditable
            content={localThought}
            placeholder={readonly ? '未填写编写思路' : '在此补充编写思路（可选）'}
            autoFocus={true}
            readonly={isDisabled}
            onContentChange={handleWritingThoughtChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            className={styles['outline-item-writing-thought__editor']}
            autoSize={{ minRows: 1, maxRows: ideaSummaryLines }}
          />
        </div>
      ) : (
        /* 查看状态：显示思路内容，点击进入编辑 */
        <div className={styles['outline-item-writing-thought__view']} onClick={readonly ? undefined : handleFocus}>
          {writingThought || (readonly ? '未填写编写思路' : '点击补充编写思路')}
        </div>
      )}
    </div>
  );
};
