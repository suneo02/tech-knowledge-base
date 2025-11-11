/**
 * 章节高级业务操作
 *
 * 职责：
 * - 提供业务层的章节操作接口
 * - 封装底层的树操作（basic.ts）
 * - 所有函数都是纯函数，无副作用
 *
 * 设计原则：
 * - 业务语义：使用业务术语（rename, updateThought）而非技术术语
 * - 纯函数：不修改输入，返回新对象
 * - 类型安全：使用 ReportOutlineData 类型
 *
 * @module chapter/mutations/operations
 */

import { ReportOutlineData, RPChapter, RPChapterSavePayload } from 'gel-api';
import {
  appendTreeChildAtPath,
  getTreeNodeByPath,
  indentNode,
  insertTreeSiblingAfterPath,
  removeTreeNodeAtPath,
  setTreeNodeByPath,
  TreePath,
  unindentNode,
} from 'gel-util/common';

/**
 * 树形结构的基础操作接口
 */
export interface TreeOperations {
  /** 重命名节点 */
  rename: (data: ReportOutlineData, path: TreePath, newTitle: string) => ReportOutlineData;
  /** 更新编写思路 */
  updateThought: (data: ReportOutlineData, path: TreePath, newThought: string) => ReportOutlineData;
  /** 更新关键词 */
  updateKeywords: (data: ReportOutlineData, path: TreePath, newKeywords: string[]) => ReportOutlineData;
  /** 在指定位置插入节点 */
  insert: (
    data: ReportOutlineData,
    path: TreePath,
    chapter: RPChapterSavePayload | RPChapter
  ) => { data: ReportOutlineData; newPath: TreePath };
  /** 添加子节点 */
  addChild: (
    data: ReportOutlineData,
    parentPath: TreePath,
    chapter: RPChapterSavePayload | RPChapter
  ) => { data: ReportOutlineData; newPath: TreePath };
  /** 删除节点 */
  remove: (data: ReportOutlineData, path: TreePath) => ReportOutlineData;
  /** 移动节点（缩进/取消缩进） */
  move: (
    data: ReportOutlineData,
    fromPath: TreePath,
    toPath: TreePath
  ) => { data: ReportOutlineData; newPath: TreePath };
  /** 缩进节点 */
  indent: (data: ReportOutlineData, path: TreePath) => { data: ReportOutlineData; newPath: TreePath };
  /** 取消缩进节点 */
  unindent: (data: ReportOutlineData, path: TreePath) => { data: ReportOutlineData; newPath: TreePath };
}

/**
 * Domain 层的树操作实现
 */
export const chapterTreeOperations: TreeOperations = {
  /**
   * 重命名节点
   */
  rename: (data: ReportOutlineData, path: TreePath, newTitle: string): ReportOutlineData => {
    const chapter = getTreeNodeByPath(data.chapters, path);
    if (!chapter) return data;

    const updatedChapter = { ...chapter, title: newTitle };
    const newChapters = setTreeNodeByPath(data.chapters, path, updatedChapter);

    return {
      ...data,
      chapters: newChapters,
    };
  },

  /**
   * 更新编写思路
   */
  updateThought: (data: ReportOutlineData, path: TreePath, newThought: string): ReportOutlineData => {
    const chapter = getTreeNodeByPath(data.chapters, path);
    if (!chapter) return data;

    const updatedChapter = { ...chapter, writingThought: newThought };
    const newChapters = setTreeNodeByPath(data.chapters, path, updatedChapter);

    return {
      ...data,
      chapters: newChapters,
    };
  },

  /**
   * 更新关键词
   */
  updateKeywords: (data: ReportOutlineData, path: TreePath, newKeywords: string[]): ReportOutlineData => {
    const chapter = getTreeNodeByPath(data.chapters, path);
    if (!chapter) return data;

    const updatedChapter = { ...chapter, keywords: newKeywords };
    const newChapters = setTreeNodeByPath(data.chapters, path, updatedChapter);

    return {
      ...data,
      chapters: newChapters,
    };
  },

  /**
   * 在指定位置插入节点
   */
  insert: (data: ReportOutlineData, path: TreePath, chapter: RPChapterSavePayload | RPChapter) => {
    // 类型断言说明：
    // 1. RPChapterSavePayload 结构与 RPChapter 兼容（除 chapterId 可选）
    // 2. 在运行时可以安全插入树中，保存后通过 applyIdMapToChapters 替换为真实 ID
    // 3. ReportOutlineData.chapters 类型定义为 RPChapter[]，需要断言以通过类型检查
    const result = insertTreeSiblingAfterPath(data.chapters, path, chapter as RPChapter);
    return {
      data: {
        ...data,
        chapters: result.nodes,
      },
      newPath: result.newPath,
    };
  },

  /**
   * 添加子节点
   */
  addChild: (data: ReportOutlineData, parentPath: TreePath, chapter: RPChapterSavePayload | RPChapter) => {
    // 类型断言说明：同 insert 方法，结构兼容，运行时安全
    const result = appendTreeChildAtPath(data.chapters, parentPath, chapter as RPChapter);
    return {
      data: {
        ...data,
        chapters: result.nodes,
      },
      newPath: result.newPath,
    };
  },

  /**
   * 删除节点
   */
  remove: (data: ReportOutlineData, path: TreePath): ReportOutlineData => {
    const newChapters = removeTreeNodeAtPath(data.chapters, path);
    return {
      ...data,
      chapters: newChapters,
    };
  },

  /**
   * 移动节点（通用移动，暂时简化实现）
   */
  move: (data: ReportOutlineData, fromPath: TreePath, toPath: TreePath) => {
    // 简化实现：先删除再插入
    const chapter = getTreeNodeByPath(data.chapters, fromPath);
    if (!chapter) return { data, newPath: fromPath };

    const afterRemove = chapterTreeOperations.remove(data, fromPath);
    const result = chapterTreeOperations.insert(afterRemove, toPath, chapter);

    return result;
  },

  /**
   * 缩进节点
   */
  indent: (data: ReportOutlineData, path: TreePath) => {
    const result = indentNode(data.chapters, path);
    return {
      data: {
        ...data,
        chapters: result.nodes,
      },
      newPath: result.newPath,
    };
  },

  /**
   * 取消缩进节点
   */
  unindent: (data: ReportOutlineData, path: TreePath) => {
    const result = unindentNode(data.chapters, path);
    return {
      data: {
        ...data,
        chapters: result.nodes,
      },
      newPath: result.newPath,
    };
  },
};
