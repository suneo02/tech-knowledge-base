/**
 * Canonical 层章节选择器
 *
 * @description
 * 这些选择器直接基于 Canonical 层（服务器返回的事实层）数据。
 * 用于：
 * - 初始化和重注水
 * - 保存后的基线数据
 * - 导出和历史版本
 *
 * ⚠️ 注意：如果需要反映用户正在编辑的实时结构，请使用 Draft 层选择器
 * （参见 chapters-draft.ts）
 */

import {
  buildChapterLevelMap,
  buildChapterMap,
  buildChapterPathMap,
  generateChapterHierarchicalNumber,
} from '@/domain/chapter';
import { buildSortedReferencesFromChapters, ReferenceMap, RPReferenceItem } from '@/domain/chat';
import { aggregateFileData, isReportFileStatusMutable } from '@/domain/file';
import { buildReportReferenceOrdinalMap, calculateTopReportFiles } from '@/domain/reportReference';
import { RPFileUnified } from '@/types/file';
import { RPChapterEnriched, RPLeafChapterEnriched } from '@/types/report';
import { createSelector } from '@reduxjs/toolkit';
import { RPDetailChapter } from 'gel-api';
import { flattenTreeWithPath, getLeafNodes } from 'gel-util/common';
import { selectChapters, selectReportFiles } from './base';

// ==================== Stable Fallbacks ====================
const EMPTY_REFERENCES: RPReferenceItem[] = [];
const EMPTY_ORDINAL_MAP = new Map<string, number>();

// ==================== Canonical 层选择器 ====================

/**
 * 【Canonical】选择章节映射表
 *
 * @description 基于 Canonical 层的章节映射，用于查找章节
 */
export const selectCanonicalChapterMap = createSelector(selectChapters, (chapters) => {
  return buildChapterMap(chapters || []);
});

// ==================== 扩展章节数据（包含衍生字段） ====================

/**
 * 【Canonical】选择扩展章节树（包含 level、path、order、hierarchicalNumber）
 *
 * @description
 * 基于 Canonical 层的章节数据，计算并附加前端需要的衍生字段：
 * - level: 章节层级（1, 2, 3...）
 * - path: 章节路径（[0, 1, 2]）
 * - order: 章节在树中的顺序索引
 * - hierarchicalNumber: 层级编号（"1.2.3"）
 *
 * @note 用于需要完整章节信息的场景，如导出、打印等
 * @returns RPChapterEnriched[] 包含衍生数据的章节树
 */
export const selectCanonicalChaptersEnriched = createSelector([selectChapters], (chapters): RPChapterEnriched[] => {
  // 扁平化章节树，获取每个节点的路径和顺序
  const flatChapters = flattenTreeWithPath(chapters, 'children');

  // 一次性构建所有映射
  const levelMap = buildChapterLevelMap(chapters);
  const pathMap = buildChapterPathMap(chapters);
  const orderMap = new Map<string, number>();

  flatChapters.forEach(({ node }, index) => {
    orderMap.set(String(node.chapterId), index);
  });

  // 递归转换章节树
  const enrichChapter = (chapter: RPDetailChapter): RPChapterEnriched => {
    const chapterId = String(chapter.chapterId);
    const level = levelMap.get(chapterId) ?? 1;
    const path = pathMap.get(chapterId) ?? [];
    const order = orderMap.get(chapterId) ?? 0;
    const hierarchicalNumber = generateChapterHierarchicalNumber(path);

    return {
      ...chapter,
      level,
      path,
      order,
      hierarchicalNumber,
      children: chapter.children?.map(enrichChapter),
    };
  };

  return chapters.map(enrichChapter);
});

/**
 * 【Canonical】选择扩展章节映射（chapterId -> RPChapterEnriched）
 *
 * @description 基于扩展章节树构建的映射表，用于快速查找
 * @returns Map<chapterId, RPChapterEnriched>
 */
export const selectCanonicalChaptersEnrichedMap = createSelector(
  [selectCanonicalChaptersEnriched],
  (enrichedChapters): Map<string, RPChapterEnriched> => {
    const map = new Map<string, RPChapterEnriched>();
    const flatChapters = flattenTreeWithPath(enrichedChapters, 'children');

    flatChapters.forEach(({ node }) => {
      map.set(String(node.chapterId), node);
    });

    return map;
  }
);

/**
 * 【Canonical】选择叶子章节列表（保持顺序）
 *
 * @description 基于 Canonical 层提取所有叶子章节（无子章节的章节），保持树的遍历顺序
 * @note 用于全文生成等需要按顺序遍历叶子节点的场景
 * @returns RPDetailChapter[] 叶子章节数组，按树的遍历顺序排列
 */
export const selectLeafChapters = createSelector([selectCanonicalChaptersEnriched], (chapters) => {
  return getLeafNodes(chapters) as RPLeafChapterEnriched[];
});

/**
 * 【Canonical】选择叶子章节映射
 *
 * @description 基于 Canonical 层提取所有叶子章节（无子章节的章节）
 * @note 用于多章节生成等需要快速查找叶子章节的场景
 * @returns Map<chapterId, RPDetailChapter> 叶子章节ID到章节对象的映射
 */
export const selectLeafChapterMap = createSelector([selectLeafChapters], (leafChapters) => {
  const map = new Map<string, RPLeafChapterEnriched>();
  leafChapters.forEach((chapter) => {
    map.set(String(chapter.chapterId), chapter);
  });
  return map;
});

/**
 * 【Canonical】选择叶子章节顺序索引
 *
 * @description 基于 Canonical 层构建叶子章节ID到其在树中顺序位置的映射
 * @note 用于多章节生成时按树的遍历顺序排序章节ID
 * @returns Map<chapterId, index> 叶子章节ID到顺序索引的映射
 */
export const selectLeafChapterOrderMap = createSelector([selectLeafChapters], (leafChapters): Map<string, number> => {
  const orderMap = new Map<string, number>();
  leafChapters.forEach((chapter, index) => {
    orderMap.set(String(chapter.chapterId), index);
  });
  return orderMap;
});

// ==================== 文件状态（基于 Canonical） ====================

/**
 * 选择统一文件映射（fileId -> RPFileUnified）
 */
export const selectFileUnifiedMap = createSelector([selectChapters, selectReportFiles], (chapters, reportFiles) => {
  return aggregateFileData(reportFiles, chapters);
});

// ==================== 引用资料（基于 Canonical） ====================

/**
 * 【Canonical】选择排序后的引用资料列表
 */
export const selectSortedReferences = createSelector([selectChapters, selectFileUnifiedMap], (chapters, fileMap) => {
  try {
    return buildSortedReferencesFromChapters(chapters, { fileMap });
  } catch (error) {
    console.error('[selectSortedReferences] Error processing references:', error);
    return EMPTY_REFERENCES;
  }
});

/**
 * 【Canonical】选择引用资料映射
 */
export const selectReferenceMap = createSelector([selectSortedReferences], (sortedReferences) => {
  return new ReferenceMap(sortedReferences);
});

/**
 * 【Canonical】选择全局引用序号映射
 */
export const selectReferenceOrdinalMap = createSelector([selectSortedReferences], (sortedReferences) => {
  try {
    return buildReportReferenceOrdinalMap(sortedReferences);
  } catch (error) {
    console.error('[selectReferenceOrdinalMap] Error building reference ordinal map:', error);
    return EMPTY_ORDINAL_MAP;
  }
});

/**
 * 选择需要轮询的文件 ID 列表
 *
 * 从 fileUnifiedMap 中筛选出状态为可变的文件（需要轮询）
 */
export const selectPendingFileIds = createSelector([selectFileUnifiedMap], (fileUnifiedMap) => {
  const pendingIdSet = new Set<string>();

  fileUnifiedMap.forEach((file, fileId) => {
    if (isReportFileStatusMutable(file.status)) {
      pendingIdSet.add(fileId);
    }
  });

  return Array.from(pendingIdSet);
});

/**
 * 选择置顶文件（未被章节引用的报告级文件）
 */
export const selectTopReportFiles = createSelector([selectFileUnifiedMap], (unifiedMap): RPFileUnified[] =>
  calculateTopReportFiles(unifiedMap)
);
