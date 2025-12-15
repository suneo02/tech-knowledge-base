/**
 * 章节底层变更操作
 *
 * 职责：
 * - 插入章节（同级插入）
 * - 移动章节（同级移动）
 * - 重排序章节
 *
 * 特点：
 * - 底层操作，不包含业务逻辑
 * - 使用 gel-util 的树工具
 * - 返回变更记录（用于撤销/重做）
 *
 * @module chapter/mutations/basic
 */

import { TreePath, insertSiblingNode, moveSiblingNode } from 'gel-util/common';
import { ChapterLike } from '../types';

export interface InsertResult<T extends ChapterLike> {
  nodes: T[];
  newPath: TreePath;
}

export interface ReorderChange {
  chapterId: string;
  oldIndex: number;
  newIndex: number;
}

export interface ReorderResult<T extends ChapterLike<T>> {
  nodes: T[];
  changes: ReorderChange[];
}

// ===== 排序操作（使用通用树工具） =====
// 注意：cloneNodes 函数已不再需要，因为通用树工具已处理克隆

/**
 * 在同级节点间移动位置（使用通用树工具）
 */
export const moveSibling = <T extends ChapterLike<T>>(
  nodes: T[],
  fromIndex: number,
  toIndex: number
): ReorderResult<T> => {
  const result = moveSiblingNode(nodes, fromIndex, toIndex, (node) => String(node.chapterId), 'children');
  return {
    nodes: result.nodes,
    changes: result.changes.map((change) => ({
      chapterId: change.nodeId,
      oldIndex: change.oldIndex,
      newIndex: change.newIndex,
    })),
  };
};

/**
 * 在同级节点列表中插入新节点（使用通用树工具）
 */
export const insertSibling = <T extends ChapterLike<T>>(nodes: T[], index: number, newNode: T): ReorderResult<T> => {
  const result = insertSiblingNode(nodes, index, newNode, (node) => String(node.chapterId), 'children');
  return {
    nodes: result.nodes,
    changes: result.changes.map((change) => ({
      chapterId: change.nodeId,
      oldIndex: change.oldIndex,
      newIndex: change.newIndex,
    })),
  };
};
