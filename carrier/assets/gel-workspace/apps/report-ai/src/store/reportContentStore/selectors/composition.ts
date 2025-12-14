/**
 * 章节内容合成相关选择器
 *
 * 将 Canonical 层的章节数据合成为渲染所需的内容
 * 按照三层架构：直接从 RPDetailChapter 派生渲染数据，避免中间类型
 *
 * 注意：流式预览和状态映射函数已移至 domain 层
 * @see {@link ../../../domain/reportEditor/chapter/composition.ts}
 */

import { renderChapter, renderContentFromChapter, renderFullDocument } from '@/domain/reportEditor';
import { RPChapterEnriched } from '@/types';
import { createSelector } from '@reduxjs/toolkit';
import type { RPDetailChapter } from 'gel-api';
import { selectChapters, selectReportName } from './base';
import { selectCanonicalChaptersEnriched, selectReferenceOrdinalMap } from './chaptersCanonical';

/**
 * 选择器：章节 Canonical HTML 内容映射
 * 返回 chapterId -> canonical html 的映射，用于编辑器内容注入
 *
 * ⚠️ 注意：此选择器用于初始化和全量注水，使用 Canonical 层
 * - 使用 Canonical 层的 chapters、levelMap、pathMap 保持一致性
 * - 不应该用于实时反映用户的编辑状态
 * - 用户的编辑状态由编辑器 DOM 维护，不需要重新注水
 */
export const selectCanonicalChapterHtmlMap = createSelector(
  [selectCanonicalChaptersEnriched, selectReferenceOrdinalMap],
  (chapters, referenceOrdinalMap): Record<string, string> => {
    const htmlMap: Record<string, string> = {};

    const traverseChapters = (chapterList: RPChapterEnriched[]) => {
      chapterList.forEach((chapter) => {
        const chapterId = String(chapter.chapterId);
        htmlMap[chapterId] = renderChapter({
          chapter,
          referenceOrdinalMap,
        });
        if (chapter.children?.length) {
          traverseChapters(chapter.children);
        }
      });
    };

    traverseChapters(chapters);
    return htmlMap;
  }
);

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
  [selectChapters, selectReferenceOrdinalMap],
  (chapters, referenceOrdinalMap): Record<string, string> => {
    const contentMap: Record<string, string> = {};

    const traverseChapters = (chapterList: RPDetailChapter[]) => {
      chapterList.forEach((chapter) => {
        const chapterId = String(chapter.chapterId);
        // 直接使用 chapter.content，不依赖 messages
        contentMap[chapterId] = renderContentFromChapter(chapter, undefined, referenceOrdinalMap);

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
  [selectCanonicalChapterHtmlMap, selectReportName, selectChapters],
  (htmlMap, reportName, chapters): string => {
    return renderFullDocument(chapters, htmlMap, reportName);
  }
);
