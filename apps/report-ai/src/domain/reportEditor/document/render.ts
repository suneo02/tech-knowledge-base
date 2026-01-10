import { ReportReferenceOrdinalMap } from '@/domain/reportReference';
import { RPChapterEnriched } from '@/types';
import { traverseTree } from 'gel-util/common';
import { renderChapter } from '../chapter';
import { RP_DATA_ATTRIBUTES, RP_DATA_VALUES } from '../foundation';
import { ReportComposerOptions } from '../types';

const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * 生成报告标题HTML（纯函数）
 */
export const renderReportTitle = (reportName: string): string => {
  if (!reportName) return '';

  const safeName = escapeHtml(reportName);
  return `<div ${RP_DATA_ATTRIBUTES.REPORT_TITLE}="${RP_DATA_VALUES.REPORT_TITLE_TRUE}" data-mce-noneditable="true" contenteditable="false" role="heading" aria-level="1">${safeName}</div>`;
};

/**
 * 生成完整HTML（纯函数）
 */
export const renderFullDocument = (
  chapters: RPChapterEnriched[],
  reportName: string | undefined,
  referenceOrdinalMap: ReportReferenceOrdinalMap,
  options?: Pick<ReportComposerOptions, 'includeReportTitle' | 'sectionSeparator'>
): string => {
  const { includeReportTitle = true, sectionSeparator = '\n' } = options || {};

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

  // 生成报告标题
  const reportTitle = includeReportTitle && reportName ? renderReportTitle(reportName) : '';

  // 生成章节HTML
  const sectionsHtmlArr: string[] = [];

  traverseTree(chapters, (chapter) => {
    const chapterId = String(chapter.chapterId);
    const html = htmlMap[chapterId];
    if (html) {
      sectionsHtmlArr.push(html);
    } else {
      console.error(`[generateFullHTML] Chapter ${chapterId} not found in htmlMap`);
    }
  });

  const sectionsHtml = sectionsHtmlArr.join(sectionSeparator);

  return reportTitle ? `${reportTitle}${sectionSeparator}${sectionsHtml}` : sectionsHtml;
};
