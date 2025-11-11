/**
 * 导航相关的 Reducer
 *
 * @description 处理大纲导航状态管理
 */

import { EditorState, OutlineAction, OutlineEditorAction } from '../types';

/**
 * 处理导航相关的 Action
 *
 * @param state 当前状态
 * @param action 要处理的 Action
 * @returns 更新后的状态，如果不处理则返回 null
 */
export const handleNavigationActions = (state: EditorState, action: OutlineEditorAction): EditorState | null => {
  switch (action.type) {
    case OutlineAction.SET_SELECTED_PATH:
      return {
        ...state,
        selectedPath: action.payload.path,
      };

    case OutlineAction.SET_ACTIVE_ITEM:
      return {
        ...state,
        activeItem: action.payload,
      };

    default:
      return null; // 不处理的 Action 返回 null
  }
};
