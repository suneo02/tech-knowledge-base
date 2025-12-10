/**
 * 大纲编辑器状态管理类型定义
 *
 * @description 包含所有状态、Action 类型定义
 */

import { ReportOutlineData } from 'gel-api';
import { TreePath } from 'gel-util/common';

/**
 * 编辑器状态（扁平结构）
 */
export interface EditorState {
  // ===== 基础状态 =====
  /** 当前数据 */
  data: ReportOutlineData;
  /** 是否正在同步 */
  isSyncing: boolean;
  /** 错误信息 */
  error: string | null;

  // ===== 导航和编辑状态 =====
  /** 当前选中的项目路径 */
  selectedPath: TreePath | null;
  /** 当前活跃项目状态 */
  activeItem: {
    /** 活跃项目的路径 */
    path: TreePath | null;
    /** 活跃项目的模式 */
    mode: 'focused' | 'editing';
    /** 编辑类型（仅在 mode 为 'editing' 时有效） */
    editingType?: 'title' | 'thought';
  } | null;

  // ===== 编写思路生成状态 =====
  /** 正在生成编写思路的章节路径集合 */
  thoughtGeneratingPaths: Set<string>;
  /** 编写思路生成错误信息 */
  thoughtGenerationErrors: Record<string, string>;
}

/**
 * 大纲编辑器 Action 类型
 *
 * @description 体现大纲编辑的业务逻辑，使用业务术语命名
 */
export enum OutlineAction {
  // 大纲数据管理
  LOAD_OUTLINE = 'LOAD_OUTLINE',
  START_SYNC = 'START_SYNC',
  FINISH_SYNC = 'FINISH_SYNC',

  // 章节内容编辑
  RENAME_CHAPTER_TITLE = 'RENAME_CHAPTER_TITLE',
  UPDATE_WRITING_THOUGHT = 'UPDATE_WRITING_THOUGHT',

  // 章节结构调整
  ADD_NEW_CHAPTER = 'ADD_NEW_CHAPTER',
  DELETE_CHAPTER = 'DELETE_CHAPTER',
  INDENT_CHAPTER = 'INDENT_CHAPTER', // 增加层级（缩进）
  OUTDENT_CHAPTER = 'OUTDENT_CHAPTER', // 减少层级（取消缩进）

  // 导航和编辑状态管理
  SET_SELECTED_PATH = 'SET_SELECTED_PATH',
  SET_ACTIVE_ITEM = 'SET_ACTIVE_ITEM',

  // 编写思路生成管理
  START_THOUGHT_GENERATION = 'START_THOUGHT_GENERATION',
  STOP_THOUGHT_GENERATION = 'STOP_THOUGHT_GENERATION',
  FINISH_THOUGHT_GENERATION = 'FINISH_THOUGHT_GENERATION',
  FAIL_THOUGHT_GENERATION = 'FAIL_THOUGHT_GENERATION',
  CLEAR_THOUGHT_GENERATION_ERROR = 'CLEAR_THOUGHT_GENERATION_ERROR',

  // ID 同步管理
  UPDATE_CHAPTER_ID = 'UPDATE_CHAPTER_ID',
}

/**
 * 大纲编辑器 Actions
 *
 * @description 定义所有可能的大纲编辑操作
 */
export type OutlineEditorAction =
  // 大纲数据管理
  | { type: OutlineAction.LOAD_OUTLINE; payload: ReportOutlineData }
  | { type: OutlineAction.START_SYNC; payload: boolean }
  | { type: OutlineAction.FINISH_SYNC; payload: boolean }

  // 章节内容编辑
  | {
      type: OutlineAction.RENAME_CHAPTER_TITLE;
      payload: {
        chapterPath: TreePath;
        newTitle: string;
        previousTitle: string;
      };
    }
  | {
      type: OutlineAction.UPDATE_WRITING_THOUGHT;
      payload: {
        chapterPath: TreePath;
        newThought: string;
        previousThought: string;
      };
    }

  // 章节结构调整
  | {
      type: OutlineAction.ADD_NEW_CHAPTER;
      payload: {
        insertAfterPath: TreePath;
        newChapter: any;
      };
    }
  | {
      type: OutlineAction.DELETE_CHAPTER;
      payload: {
        chapterPath: TreePath;
        deletedChapter: any;
      };
    }
  | {
      type: OutlineAction.INDENT_CHAPTER;
      payload: { chapterPath: TreePath };
    }
  | {
      type: OutlineAction.OUTDENT_CHAPTER;
      payload: { chapterPath: TreePath };
    }

  // 导航和编辑状态管理
  | {
      type: OutlineAction.SET_SELECTED_PATH;
      payload: { path: TreePath | null };
    }
  | {
      type: OutlineAction.SET_ACTIVE_ITEM;
      payload: {
        path: TreePath | null;
        mode: 'focused' | 'editing';
        editingType?: 'title' | 'thought';
      } | null;
    }

  // 编写思路生成管理
  | {
      type: OutlineAction.START_THOUGHT_GENERATION;
      payload: { chapterPath: TreePath };
    }
  | {
      type: OutlineAction.STOP_THOUGHT_GENERATION;
      payload: { chapterPath: TreePath };
    }
  | {
      type: OutlineAction.FINISH_THOUGHT_GENERATION;
      payload: { chapterPath: TreePath };
    }
  | {
      type: OutlineAction.FAIL_THOUGHT_GENERATION;
      payload: { chapterPath: TreePath; error: string };
    }
  | {
      type: OutlineAction.CLEAR_THOUGHT_GENERATION_ERROR;
      payload: { chapterPath: TreePath };
    }

  // ID 同步管理
  | {
      type: OutlineAction.UPDATE_CHAPTER_ID;
      payload: { chapterPath: TreePath; newChapterId: number };
    };
