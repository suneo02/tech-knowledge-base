/**
 * 章节内容合成相关选择器
 *
 * 将 Canonical 层的章节数据与已解析的消息合成为渲染所需的内容和状态
 * 按照三层架构：直接从 RPDetailChapter 派生渲染数据，避免中间类型
 */

import { determineChapterAIMessageStatus } from '@/domain/chapter';
import { getLatestMessageByChapterIdRole } from '@/domain/chat/rpContentAIMessages';
import { renderChapter, renderContentFromChapter, renderFullDocument } from '@/domain/reportEditor';
import { RPChapterEnriched } from '@/types';
import { ChapterGenerationStatus } from '@/types/editor';
import { createSelector } from '@reduxjs/toolkit';
import type { RPDetailChapter } from 'gel-api';
import { selectChapters, selectParsedRPContentMessages, selectReportName } from './base';
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

/**
 * 选择器：章节内容映射（仅内容，用于流式更新）
 * 返回 chapterId -> contentHtml 的映射，不包含标题和外层结构
 * 专门用于流式更新时更新 contentContainer
 */
export const selectChapterContentMap = createSelector(
  [selectChapters, selectParsedRPContentMessages, selectReferenceOrdinalMap],
  (chapters, messages, referenceOrdinalMap): Record<string, string> => {
    const contentMap: Record<string, string> = {};

    const traverseChapters = (chapterList: RPDetailChapter[]) => {
      chapterList.forEach((chapter) => {
        const chapterId = String(chapter.chapterId);
        const message = getLatestMessageByChapterIdRole(messages || [], chapterId, 'aiReportContent');
        contentMap[chapterId] = renderContentFromChapter(chapter, message, referenceOrdinalMap);

        if (chapter.children?.length) {
          traverseChapters(chapter.children);
        }
      });
    };

    traverseChapters(chapters);
    return contentMap;
  }
);

/**
 * 选择器：章节 AI 消息状态映射
 * 返回 chapterId -> status 的映射，用于UI控制
 */
export const selectChapterAIMessageStatusMap = createSelector(
  [selectChapters, selectParsedRPContentMessages],
  (chapters, messages): Record<string, ChapterGenerationStatus> => {
    const statusMap: Record<string, ChapterGenerationStatus> = {};

    const traverseChapters = (chapterList: RPDetailChapter[]) => {
      chapterList.forEach((chapter) => {
        const chapterId = String(chapter.chapterId);
        const message = getLatestMessageByChapterIdRole(messages || [], chapterId, 'aiReportContent');
        statusMap[chapterId] = determineChapterAIMessageStatus(message, chapter);

        if (chapter.children?.length) {
          traverseChapters(chapter.children);
        }
      });
    };

    traverseChapters(chapters);
    return statusMap;
  }
);

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
