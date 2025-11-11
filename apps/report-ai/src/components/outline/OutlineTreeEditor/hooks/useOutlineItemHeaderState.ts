/**
 * OutlineItemHeader 状态管理 Hook
 *
 * @description 管理 OutlineItemHeader 组件的状态和事件处理逻辑
 */

import { TreePath } from 'gel-util/common';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  OutlineAction,
  selectChapterByPath,
  selectFocusedPath,
  selectIsGeneratingThought,
  useOutlineDispatch,
  useOutlineState,
} from '../context';
import { useOutlineOperationsContext } from '../context/operations';

export interface UseOutlineItemHeaderStateOptions {
  /** 项目路径 */
  path: TreePath;
  /** 是否编辑中 */
  isEditing: boolean;
  /** 占位符文本 */
  placeholder: string;
  /** 是否只读 */
  readonly: boolean;
}

export interface UseOutlineItemHeaderStateReturn {
  // 状态数据
  chapter: ReturnType<typeof selectChapterByPath>;
  isGeneratingThought: boolean;
  title: string;
  editingTitle: string;
  setEditingTitle: (title: string) => void;

  // Refs
  containerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<any>;

  // 移除了不必要的 context 值暴露

  // 必要的事件处理函数（包含业务逻辑）
  handleTitleChange: (content: string) => void;
  handleTitleClick: () => void;
  handleFocus: () => void;
  handleConfirm: () => void;
  handleDelete: () => void;
  handleAddSibling: () => Promise<void>;
  handleAddSiblingMouseDown: (event: React.MouseEvent) => void;
}

/**
 * OutlineItemHeader 状态管理 Hook
 */
export function useOutlineItemHeaderState(options: UseOutlineItemHeaderStateOptions): UseOutlineItemHeaderStateReturn {
  const { path, isEditing, readonly } = options;

  // 直接从 context 读取状态和操作
  const state = useOutlineState();
  const dispatch = useOutlineDispatch();
  const { rename, insertAfter, remove } = useOutlineOperationsContext();

  // 读取状态
  const chapter = selectChapterByPath(state, path);
  const focusedPath = selectFocusedPath(state);
  const isGeneratingThought = selectIsGeneratingThought(state, path);
  const title = chapter?.title || '';
  const isFocused =
    focusedPath !== null && path.length === focusedPath.length && path.every((p, i) => p === focusedPath[i]);

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef(null);
  const [editingTitle, setEditingTitle] = useState(title);

  /**
   * 同步外部title变化到编辑状态
   */
  useEffect(() => {
    if (!isEditing) {
      setEditingTitle(title);
    }
  }, [title, isEditing]);

  /**
   * 当项目获得焦点时，自动聚焦到内容编辑区域
   */
  useEffect(() => {
    if (isFocused && contentRef.current) {
      // 使用 ContentEditable 组件的 focus 方法
      const element = contentRef.current as any;
      if (element?.focus) {
        element.focus();
      }
    }
  }, [isFocused]);

  /**
   * 处理标题变更 - 只更新本地编辑状态，不立即调用接口
   */
  const handleTitleChange = useCallback((content: string) => {
    setEditingTitle(content);
  }, []);

  /**
   * 处理标题点击 - 进入编辑模式
   */
  const handleTitleClick = useCallback(() => {
    if (!readonly && !isGeneratingThought) {
      setEditingTitle(title); // 初始化编辑内容为当前标题
      dispatch({
        type: OutlineAction.SET_ACTIVE_ITEM,
        payload: { path, mode: 'editing', editingType: 'title' },
      });
    }
  }, [readonly, isGeneratingThought, title, dispatch, path]);

  /**
   * 处理聚焦事件
   */
  const handleFocus = useCallback(() => {
    // 保持编辑状态，不要在编辑模式下覆盖为 focused
    if (!isEditing) {
      dispatch({
        type: OutlineAction.SET_ACTIVE_ITEM,
        payload: { path, mode: 'focused' },
      });
    }
  }, [isEditing, dispatch, path]);

  /**
   * 处理确认保存 - 调用接口更新标题
   */
  const handleConfirm = useCallback(() => {
    // 只有当标题有变化时才调用接口
    if (editingTitle !== title) {
      rename(path, editingTitle);
    }
    dispatch({
      type: OutlineAction.SET_ACTIVE_ITEM,
      payload: null,
    });
  }, [editingTitle, title, rename, path, dispatch]);

  /**
   * 处理删除操作
   */
  const handleDelete = useCallback(() => {
    remove(path);
  }, [remove, path]);

  /**
   * 处理新增同级操作
   */
  const handleAddSibling = useCallback(async () => {
    const newPath = await insertAfter(path);
    if (newPath) {
      dispatch({
        type: OutlineAction.SET_ACTIVE_ITEM,
        payload: { path: newPath, mode: 'focused' },
      });
    }
  }, [insertAfter, path, dispatch]);

  /**
   * 阻止在编辑状态下点击按钮时导致的失焦行为
   */
  const handleAddSiblingMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return {
    // 状态数据
    chapter,
    isGeneratingThought,
    title,
    editingTitle,
    setEditingTitle,

    // Refs
    containerRef,
    contentRef,

    // 移除了不必要的 context 值暴露

    // 必要的事件处理函数（包含业务逻辑）
    handleTitleChange,
    handleTitleClick,
    handleFocus,
    handleConfirm,
    handleDelete,
    handleAddSibling,
    handleAddSiblingMouseDown,
  };
}
