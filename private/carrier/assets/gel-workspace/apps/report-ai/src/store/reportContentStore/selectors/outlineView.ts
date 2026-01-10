/**
 * 大纲视图选择器
 *
 * @description
 * - 合并 Draft 和 Canonical 数据
 * - 生成大纲视图所需的 ViewModel 格式
 * - 支持临时章节（tempId）和已保存章节（chapterId）
 */

import { mergeDraftToOutlineView } from '@/domain/chapter';
import type { OutlineChapterViewModel } from '@/types/report';
import { createSelector } from '@reduxjs/toolkit';
import { selectCanonicalChaptersEnriched, selectCanonicalChaptersEnrichedMap } from './chaptersCanonical';
import { selectDraftTree } from './draftTreeSelectors';

/**
 * 选择大纲视图章节列表
 *
 * @description
 * - 统一使用 mergeDraftToOutlineView 处理
 * - 如果存在 Draft Tree，合并 Draft 和 Canonical 生成大纲视图
 * - 否则直接从 Canonical 生成大纲视图
 * - 支持临时章节（只有 tempId）和已保存章节（有 chapterId）
 */
export const selectOutlineViewChapters = createSelector(
  [selectDraftTree, selectCanonicalChaptersEnrichedMap, selectCanonicalChaptersEnriched],
  (draftTree, canonicalMap, canonicalChapters): OutlineChapterViewModel[] => {
    return mergeDraftToOutlineView(draftTree, canonicalMap, canonicalChapters);
  }
);
