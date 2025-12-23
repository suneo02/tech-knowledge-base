/**
 * Ops 层 - 操作对象和逆操作定义
 *
 * @description 定义所有可能的操作类型和对应的逆操作，支持批量操作和回滚
 * 按照设计文档要求：每个操作定义其逆操作，允许打包成批次
 */

import { chapterTreeOperations, createChapter } from '@/domain/chapter';
import { RPChapter, RPChapterSavePayload, ReportOutlineData } from 'gel-api';
import { TreePath } from 'gel-util/common';

/**
 * 大纲编辑操作类型枚举
 */
export enum OutlineEditActionType {
  RENAME = 'RENAME',
  UPDATE_THOUGHT = 'UPDATE_THOUGHT',
  UPDATE_KEYWORDS = 'UPDATE_KEYWORDS',
  INSERT = 'INSERT',
  REMOVE = 'REMOVE',
  INDENT = 'INDENT',
  UNINDENT = 'UNINDENT',
}

/**
 * 基础大纲编辑操作接口
 */
export interface BaseOutlineEditAction {
  id: string;
  type: OutlineEditActionType;
  timestamp: number;
}

/**
 * 重命名操作
 */
export interface RenameAction extends BaseOutlineEditAction {
  type: OutlineEditActionType.RENAME;
  path: TreePath;
  newTitle: string;
  oldTitle: string;
}

/**
 * 更新编写思路操作
 */
export interface UpdateThoughtAction extends BaseOutlineEditAction {
  type: OutlineEditActionType.UPDATE_THOUGHT;
  path: TreePath;
  newThought: string;
  oldThought: string;
}

/**
 * 更新关键词操作
 */
export interface UpdateKeywordsAction extends BaseOutlineEditAction {
  type: OutlineEditActionType.UPDATE_KEYWORDS;
  path: TreePath;
  newKeywords: string[];
  oldKeywords: string[];
}

/**
 * 插入操作
 */
export interface InsertAction extends BaseOutlineEditAction {
  type: OutlineEditActionType.INSERT;
  path: TreePath;
  chapter: RPChapterSavePayload;
  newPath?: TreePath; // 执行后的新路径
}

/**
 * 删除操作
 */
export interface RemoveAction extends BaseOutlineEditAction {
  type: OutlineEditActionType.REMOVE;
  path: TreePath;
  removedChapter: RPChapter;
}

/**
 * 缩进操作
 */
export interface IndentAction extends BaseOutlineEditAction {
  type: OutlineEditActionType.INDENT;
  path: TreePath;
  newPath?: TreePath; // 执行后的新路径
}

/**
 * 取消缩进操作
 */
export interface UnindentAction extends BaseOutlineEditAction {
  type: OutlineEditActionType.UNINDENT;
  path: TreePath;
  newPath?: TreePath; // 执行后的新路径
}

/**
 * 所有大纲编辑操作的联合类型
 */
export type OutlineEditAction =
  | RenameAction
  | UpdateThoughtAction
  | UpdateKeywordsAction
  | InsertAction
  | RemoveAction
  | IndentAction
  | UnindentAction;

/**
 * 大纲编辑操作批次
 */
export interface OutlineEditBatch {
  id: string;
  actions: OutlineEditAction[];
  timestamp: number;
  description?: string;
}

/**
 * 生成大纲编辑操作ID
 */
const generateActionId = (): string => {
  return `outline_edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 获取章节的深拷贝（用于保存删除的章节）
 */
const cloneChapter = (chapter: RPChapter): RPChapter => {
  return {
    ...chapter,
    children: chapter.children ? chapter.children.map(cloneChapter) : [],
  };
};

/**
 * 大纲编辑操作工厂函数
 */
export const outlineEditActionFactory = {
  /**
   * 创建重命名操作
   */
  createRename: (path: TreePath, newTitle: string, oldTitle: string): RenameAction => ({
    id: generateActionId(),
    type: OutlineEditActionType.RENAME,
    timestamp: Date.now(),
    path,
    newTitle,
    oldTitle,
  }),

  /**
   * 创建更新编写思路操作
   */
  createUpdateThought: (path: TreePath, newThought: string, oldThought: string): UpdateThoughtAction => ({
    id: generateActionId(),
    type: OutlineEditActionType.UPDATE_THOUGHT,
    timestamp: Date.now(),
    path,
    newThought,
    oldThought,
  }),

  /**
   * 创建更新关键词操作
   */
  createUpdateKeywords: (path: TreePath, newKeywords: string[], oldKeywords: string[]): UpdateKeywordsAction => ({
    id: generateActionId(),
    type: OutlineEditActionType.UPDATE_KEYWORDS,
    timestamp: Date.now(),
    path,
    newKeywords,
    oldKeywords,
  }),

  /**
   * 创建插入操作
   */
  createInsert: (path: TreePath, chapter?: RPChapterSavePayload): InsertAction => ({
    id: generateActionId(),
    type: OutlineEditActionType.INSERT,
    timestamp: Date.now(),
    path,
    chapter: chapter || createChapter(),
  }),

  /**
   * 创建删除操作
   */
  createRemove: (path: TreePath, removedChapter: RPChapter): RemoveAction => ({
    id: generateActionId(),
    type: OutlineEditActionType.REMOVE,
    timestamp: Date.now(),
    path,
    removedChapter: cloneChapter(removedChapter),
  }),

  /**
   * 创建缩进操作
   */
  createIndent: (path: TreePath): IndentAction => ({
    id: generateActionId(),
    type: OutlineEditActionType.INDENT,
    timestamp: Date.now(),
    path,
  }),

  /**
   * 创建取消缩进操作
   */
  createUnindent: (path: TreePath): UnindentAction => ({
    id: generateActionId(),
    type: OutlineEditActionType.UNINDENT,
    timestamp: Date.now(),
    path,
  }),

  /**
   * 创建操作批次
   */
  createBatch: (actions: OutlineEditAction[], description?: string): OutlineEditBatch => ({
    id: generateActionId(),
    actions,
    timestamp: Date.now(),
    description,
  }),
};

/**
 * 执行大纲编辑操作
 */
export const executeOutlineEditAction = (
  data: ReportOutlineData,
  action: OutlineEditAction
): { data: ReportOutlineData; action: OutlineEditAction } => {
  let result: { data: ReportOutlineData; newPath?: TreePath };
  let updatedAction = { ...action };

  switch (action.type) {
    case OutlineEditActionType.RENAME:
      result = { data: chapterTreeOperations.rename(data, action.path, action.newTitle) };
      break;

    case OutlineEditActionType.UPDATE_THOUGHT:
      result = { data: chapterTreeOperations.updateThought(data, action.path, action.newThought) };
      break;

    case OutlineEditActionType.UPDATE_KEYWORDS:
      result = { data: chapterTreeOperations.updateKeywords(data, action.path, action.newKeywords) };
      break;

    case OutlineEditActionType.INSERT:
      result = chapterTreeOperations.insert(data, action.path, action.chapter);
      updatedAction = { ...action, newPath: result.newPath };
      break;

    case OutlineEditActionType.REMOVE:
      result = { data: chapterTreeOperations.remove(data, action.path) };
      break;

    case OutlineEditActionType.INDENT:
      result = chapterTreeOperations.indent(data, action.path);
      updatedAction = { ...action, newPath: result.newPath };
      break;

    case OutlineEditActionType.UNINDENT:
      result = chapterTreeOperations.unindent(data, action.path);
      updatedAction = { ...action, newPath: result.newPath };
      break;

    default:
      throw new Error(`Unknown action type: ${(action as any).type}`);
  }

  return { data: result.data, action: updatedAction };
};
