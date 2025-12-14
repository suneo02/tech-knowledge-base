/**
 * 大纲数据相关的 Reducer
 *
 * @description 处理大纲数据的加载、同步和编辑操作
 */

import { executeOutlineEditAction, outlineEditActionFactory } from '../../core/index.js';
import { EditorState, OutlineAction, OutlineEditorAction } from '../types.js';
import { updateChapterIdAtPath } from './utils.js';

/**
 * 处理大纲数据相关的 Action
 *
 * @param state 当前状态
 * @param action 要处理的 Action
 * @returns 更新后的状态，如果不处理则返回 null
 */
export const handleOutlineActions = (state: EditorState, action: OutlineEditorAction): EditorState | null => {
  switch (action.type) {
    case OutlineAction.LOAD_OUTLINE:
      return {
        ...state,
        data: action.payload,
        error: null,
      };

    case OutlineAction.START_SYNC:
    case OutlineAction.FINISH_SYNC:
      return {
        ...state,
        isSyncing: action.payload,
      };

    case OutlineAction.RENAME_CHAPTER_TITLE:
      try {
        const action_obj = outlineEditActionFactory.createRename(
          action.payload.chapterPath,
          action.payload.newTitle,
          action.payload.previousTitle
        );
        const result = executeOutlineEditAction(state.data, action_obj);
        return {
          ...state,
          data: result.data,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Rename failed',
        };
      }

    case OutlineAction.UPDATE_WRITING_THOUGHT:
      try {
        const action_obj = outlineEditActionFactory.createUpdateThought(
          action.payload.chapterPath,
          action.payload.newThought,
          action.payload.previousThought
        );
        const result = executeOutlineEditAction(state.data, action_obj);
        return {
          ...state,
          data: result.data,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Update thought failed',
        };
      }

    case OutlineAction.ADD_NEW_CHAPTER:
      try {
        const action_obj = outlineEditActionFactory.createInsert(
          action.payload.insertAfterPath,
          action.payload.newChapter
        );
        const result = executeOutlineEditAction(state.data, action_obj);
        return {
          ...state,
          data: result.data,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Insert chapter failed',
        };
      }

    case OutlineAction.DELETE_CHAPTER:
      try {
        const action_obj = outlineEditActionFactory.createRemove(
          action.payload.chapterPath,
          action.payload.deletedChapter
        );
        const result = executeOutlineEditAction(state.data, action_obj);
        return {
          ...state,
          data: result.data,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Remove chapter failed',
        };
      }

    case OutlineAction.INDENT_CHAPTER:
      try {
        const action_obj = outlineEditActionFactory.createIndent(action.payload.chapterPath);
        const result = executeOutlineEditAction(state.data, action_obj);
        return {
          ...state,
          data: result.data,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Indent chapter failed',
        };
      }

    case OutlineAction.OUTDENT_CHAPTER:
      try {
        const action_obj = outlineEditActionFactory.createUnindent(action.payload.chapterPath);
        const result = executeOutlineEditAction(state.data, action_obj);
        return {
          ...state,
          data: result.data,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Unindent chapter failed',
        };
      }

    case OutlineAction.UPDATE_CHAPTER_ID:
      try {
        // 更新指定路径章节的 ID
        const { chapterPath, newChapterId } = action.payload;
        const newData = updateChapterIdAtPath(state.data, chapterPath, newChapterId);
        return {
          ...state,
          data: newData,
          error: null,
        };
      } catch (error) {
        return {
          ...state,
          error: error instanceof Error ? error.message : 'Update chapter ID failed',
        };
      }

    default:
      return null; // 不处理的 Action 返回 null
  }
};
