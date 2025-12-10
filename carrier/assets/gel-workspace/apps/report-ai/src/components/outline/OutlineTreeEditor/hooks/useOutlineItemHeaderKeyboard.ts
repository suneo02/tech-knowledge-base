/**
 * OutlineItemHeader 键盘事件处理 Hook
 *
 * @description 专门处理 OutlineItemHeader 组件的键盘事件逻辑
 */

import { getNextTreeNodePath, getPrevTreeNodePath, TreePath } from 'gel-util/common';
import { useCallback } from 'react';
import { OutlineAction, useOutlineDispatch, useOutlineState } from '../context';
import { useOutlineOperationsContext } from '../context/operations';

export interface UseOutlineItemHeaderKeyboardOptions {
  /** 是否在编辑模式 */
  isEditing: boolean;
  /** 当前标题 */
  title: string;
  /** 项目路径 */
  path: TreePath;
  /** 确认保存 */
  onConfirm: () => void;
  /** 添加同级节点 */
  onAddSibling: () => void;
  /** 设置编辑标题 */
  setEditingTitle: (title: string) => void;
}

export interface UseOutlineItemHeaderKeyboardReturn {
  /** 键盘事件处理器 */
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * OutlineItemHeader 键盘事件处理 Hook
 */
export function useOutlineItemHeaderKeyboard(
  options: UseOutlineItemHeaderKeyboardOptions
): UseOutlineItemHeaderKeyboardReturn {
  const { isEditing, title, path, onConfirm, onAddSibling, setEditingTitle } = options;

  // 直接从 context 获取状态和操作
  const state = useOutlineState();
  const dispatch = useOutlineDispatch();
  const { remove, indent, unindent } = useOutlineOperationsContext();

  // 导航工具函数
  const getNextItemPath = useCallback(
    (currentPath: TreePath): TreePath | null => {
      return getNextTreeNodePath(state.data.chapters, currentPath);
    },
    [state.data.chapters]
  );

  const getPrevItemPath = useCallback(
    (currentPath: TreePath): TreePath | null => {
      return getPrevTreeNodePath(state.data.chapters, currentPath);
    },
    [state.data.chapters]
  );

  /**
   * 处理键盘事件（仅在编辑模式下处理）
   */
  const handleKeyDown = useCallback(
    async (event: React.KeyboardEvent<HTMLDivElement>) => {
      // 只在编辑模式下处理键盘事件
      if (!isEditing) return;

      const { key, shiftKey, ctrlKey, metaKey } = event;
      const isModifierPressed = ctrlKey || metaKey;

      if (key === 'Escape') {
        // ESC键取消编辑，恢复原标题
        dispatch({
          type: OutlineAction.SET_ACTIVE_ITEM,
          payload: null,
        });
        setEditingTitle(title);
        event.preventDefault();
        return;
      }

      if (key === 'Enter') {
        if (shiftKey) {
          // Shift+Enter: 添加同级节点
          event.preventDefault();
          onConfirm(); // 先保存当前编辑
          // 然后添加同级节点
          setTimeout(() => {
            onAddSibling();
          }, 0);
        } else {
          // Enter: 保存
          event.preventDefault();
          onConfirm();
        }
        return;
      }

      // Tab 和 Shift+Tab: 缩进操作
      if (key === 'Tab') {
        if (shiftKey) {
          // Shift + Tab: 取消缩进
          const newPath = await unindent(path);
          if (newPath) {
            dispatch({
              type: OutlineAction.SET_ACTIVE_ITEM,
              payload: { path: newPath, mode: 'editing', editingType: 'title' },
            });
            event.preventDefault();
          }
        } else {
          // Tab: 缩进
          const newPath = await indent(path);
          if (newPath) {
            dispatch({
              type: OutlineAction.SET_ACTIVE_ITEM,
              payload: { path: newPath, mode: 'editing', editingType: 'title' },
            });
            event.preventDefault();
          }
        }
        return;
      }

      // 方向键导航
      if (key === 'ArrowDown') {
        // ArrowDown: 修改下一标题（保存当前编辑，焦点移至下一节点）
        const nextPath = getNextItemPath(path);
        if (nextPath) {
          onConfirm(); // 先保存当前编辑
          dispatch({
            type: OutlineAction.SET_ACTIVE_ITEM,
            payload: { path: nextPath, mode: 'editing', editingType: 'title' },
          });
          event.preventDefault();
        }
        return;
      }

      if (key === 'ArrowUp') {
        // ArrowUp: 修改上一标题（保存当前编辑，焦点移至上一节点）
        const prevPath = getPrevItemPath(path);
        if (prevPath) {
          onConfirm(); // 先保存当前编辑
          dispatch({
            type: OutlineAction.SET_ACTIVE_ITEM,
            payload: { path: prevPath, mode: 'editing', editingType: 'title' },
          });
          event.preventDefault();
        }
        return;
      }

      // Ctrl/Cmd + Backspace: 删除项目
      if (key === 'Backspace' && isModifierPressed) {
        await remove(path);
        // 删除后聚焦到上一个项目
        const prevPath = getPrevItemPath(path);
        if (prevPath) {
          dispatch({
            type: OutlineAction.SET_ACTIVE_ITEM,
            payload: { path: prevPath, mode: 'focused' },
          });
        }
        event.preventDefault();
        return;
      }
    },
    [
      isEditing,
      title,
      path,
      onConfirm,
      onAddSibling,
      setEditingTitle,
      dispatch,
      remove,
      indent,
      unindent,
      getNextItemPath,
      getPrevItemPath,
    ]
  );

  return {
    handleKeyDown,
  };
}
