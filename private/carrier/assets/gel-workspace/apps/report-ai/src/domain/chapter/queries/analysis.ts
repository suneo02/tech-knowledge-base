/**
 * 章节分析工具
 *
 * 职责：
 * - 构建章节映射表（ID → 节点）
 * - 构建层级映射表（ID → 层级）
 * - 构建路径映射表（ID → 路径）
 * - 构建排序映射表（ID → 顺序）
 *
 * 使用场景：
 * - 快速查找章节
 * - 计算章节层级
 * - 生成层级编号
 *
 * @module chapter/queries/analysis
 */

import { buildTreeLevelMap, buildTreeMap, buildTreeOrderMap, buildTreePathMap, TreePath } from 'gel-util/common';
import type { ChapterLike } from '../types';

export type ChapterNodeMap<T extends ChapterLike<T>> = Map<string, T>;

/**
 * 构建章节ID到节点的映射表
 */
export const buildChapterMap = <T extends ChapterLike<T>>(nodes: T[]): ChapterNodeMap<T> => {
  return buildTreeMap(nodes, (node) => String(node.chapterId));
};

/**
 * 构建章节层级映射表
 */
export const buildChapterLevelMap = <T extends ChapterLike<T>>(
  nodes: T[],
  options: { startLevel?: number } = {}
): Map<string, number> => {
  const { startLevel = 1 } = options;
  return buildTreeLevelMap(nodes, (node) => String(node.chapterId), { startLevel });
};

/**
 * 构建章节排序映射表
 */
export const buildChapterOrderMap = <T extends ChapterLike<T>>(nodes: T[]): Map<string, number> => {
  return buildTreeOrderMap(nodes, (node) => String(node.chapterId));
};

/**
 * 构建章节路径映射表
 *
 * @description 为每个章节ID构建其在树结构中的路径，用于生成层级编号
 * @param nodes 章节树节点列表
 * @returns Map<chapterId, TreePath> 章节ID到路径的映射
 */
export const buildChapterPathMap = <T extends ChapterLike<T>>(nodes: T[]): Map<string, TreePath> => {
  return buildTreePathMap(nodes, (node) => String(node.chapterId));
};
