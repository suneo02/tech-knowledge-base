/**
 * 章节内容合成相关选择器
 *
 * 将 Canonical 层的章节数据合成为渲染所需的内容
 * 按照三层架构：直接从 RPDetailChapter 派生渲染数据，避免中间类型
 *
 * 注意：流式预览和状态映射函数已移至 domain 层
 * @see {@link ../../../domain/reportEditor/chapter/composition.ts}
 */

import { renderContentFromChapter, renderFullDocument } from '@/domain/reportEditor';
import { createSelector } from '@reduxjs/toolkit';
import type { RPDetailChapter } from 'gel-api';
import { selectReportName } from './base';
import { selectCanonicalChaptersEnriched, selectReferenceOrdinalMap } from './chaptersCanonical';

// 注意：createChapterStreamPreviewMap 已移至 domain 层
// 请从 @/domain/reportEditor/chapter 导入

/**
 * 选择器：章节注水内容映射
 * 返回 chapterId -> contentHtml 的映射，用于注水到编辑器
 *
 * ⚠️ 注意：此选择器不依赖 messages，直接使用 chapter.content
 * - 确保注水时使用包含完整溯源数据的内容（DPU、RAG、files）
 * - 用于章节完成后的注水操作
 *
 * @see {@link ../../../docs/issues/chapter-rendering-missing-source-data.md | 章节渲染缺失溯源数据问题}
 */
export const selectChapterContentMap = createSelector(
  [selectCanonicalChaptersEnriched, selectReferenceOrdinalMap],
  (chapters, referenceOrdinalMap): Record<string, string> => {
    const contentMap: Record<string, string> = {};

    const traverseChapters = (chapterList: RPDetailChapter[]) => {
      chapterList.forEach((chapter) => {
        const chapterId = String(chapter.chapterId);
        // 直接使用 chapter.content，不依赖 messages
        contentMap[chapterId] = renderContentFromChapter(chapter, referenceOrdinalMap);

        if (chapter.children?.length) {
          traverseChapters(chapter.children);
        }
      });
    };

    traverseChapters(chapters);
    return contentMap;
  }
);

// 注意：createChapterAIMessageStatusMap 已移至 domain 层
// 请从 @/domain/reportEditor/chapter 导入

/**
 * 选择器：完整 Canonical HTML 文档
 * 按大纲顺序拼接所有章节内容，用于全量注水
 */
export const selectCanonicalDocHtml = createSelector(
  [selectReportName, selectCanonicalChaptersEnriched, selectReferenceOrdinalMap],
  (reportName, chapters, referenceOrdinalMap): string => {
    return renderFullDocument(chapters, reportName, referenceOrdinalMap);
  }
);
