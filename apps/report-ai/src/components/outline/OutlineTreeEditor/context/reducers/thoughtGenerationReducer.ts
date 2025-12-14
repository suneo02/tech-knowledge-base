/**
 * 编写思路生成相关的 Reducer
 *
 * @description 处理编写思路生成状态管理
 */

import { createPathKey } from '../../../pathUtils';
import { EditorState, OutlineAction, OutlineEditorAction } from '../types';

/**
 * 处理编写思路生成相关的 Action
 *
 * @param state 当前状态
 * @param action 要处理的 Action
 * @returns 更新后的状态，如果不处理则返回 null
 */
export const handleThoughtGenerationActions = (state: EditorState, action: OutlineEditorAction): EditorState | null => {
  switch (action.type) {
    case OutlineAction.START_THOUGHT_GENERATION: {
      const pathKey = createPathKey(action.payload.chapterPath);
      return {
        ...state,
        thoughtGeneratingPaths: new Set([...state.thoughtGeneratingPaths, pathKey]),
        thoughtGenerationErrors: { ...state.thoughtGenerationErrors, [pathKey]: '' },
      };
    }

    case OutlineAction.FINISH_THOUGHT_GENERATION: {
      const pathKey = createPathKey(action.payload.chapterPath);
      const newGeneratingPaths = new Set(state.thoughtGeneratingPaths);
      newGeneratingPaths.delete(pathKey);
      return {
        ...state,
        thoughtGeneratingPaths: newGeneratingPaths,
      };
    }

    case OutlineAction.STOP_THOUGHT_GENERATION: {
      const pathKey = createPathKey(action.payload.chapterPath);
      const newGeneratingPaths = new Set(state.thoughtGeneratingPaths);
      newGeneratingPaths.delete(pathKey);
      return {
        ...state,
        thoughtGeneratingPaths: newGeneratingPaths,
        // 暂停不记为错误，仅移除生成状态
      };
    }

    case OutlineAction.FAIL_THOUGHT_GENERATION: {
      const pathKey = createPathKey(action.payload.chapterPath);
      const newGeneratingPaths = new Set(state.thoughtGeneratingPaths);
      newGeneratingPaths.delete(pathKey);
      return {
        ...state,
        thoughtGeneratingPaths: newGeneratingPaths,
        thoughtGenerationErrors: {
          ...state.thoughtGenerationErrors,
          [pathKey]: action.payload.error,
        },
      };
    }

    case OutlineAction.CLEAR_THOUGHT_GENERATION_ERROR: {
      const pathKey = createPathKey(action.payload.chapterPath);
      return {
        ...state,
        thoughtGenerationErrors: { ...state.thoughtGenerationErrors, [pathKey]: '' },
      };
    }

    default:
      return null; // 不处理的 Action 返回 null
  }
};
