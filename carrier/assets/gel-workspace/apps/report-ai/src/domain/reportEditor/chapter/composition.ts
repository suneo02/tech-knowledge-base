/**
 * 章节内容合成工具函数
 *
 * 将章节数据与消息合成为渲染所需的内容和状态
 * 这些函数不依赖 Redux，可以在任何地方使用
 *
 * @see {@link ../../../docs/issues/chapter-rendering-missing-source-data.md | 章节渲染缺失溯源数据问题}
 */

import { determineChapterAIMessageStatus } from '@/domain/chapter';
import { getLatestAgentMessageByChapterId, getLatestMessageByChapterIdRole } from '@/domain/chat/rpContentAIMessages';
import { ReportReferenceOrdinalMap } from '@/domain/reportReference';
import { MessageParsedReportContent, RPContentAgentMsg } from '@/types';
import { ChapterGenerationStatus } from '@/types/editor';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import type { RPDetailChapter } from 'gel-api';
import { renderContentFromChapter } from './render';

/**
 * 生成章节流式预览内容映射
 * 返回 chapterId -> contentHtml 的映射，用于流式预览
 *
 * @param chapters 章节列表
 * @param messages 解析后的消息列表
 * @param referenceOrdinalMap 引用序号映射
 * @returns 章节内容映射
 *
 * @example
 * ```typescript
 * const contentMap = createChapterStreamPreviewMap(chapters, messages, referenceOrdinalMap);
 * await editor.updateChapterContent(chapterId, contentMap[chapterId]);
 * ```
 */
export const createChapterStreamPreviewMap = (
  chapters: RPDetailChapter[],
  messages: MessageInfo<MessageParsedReportContent>[],
  referenceOrdinalMap?: ReportReferenceOrdinalMap
): Record<string, string> => {
  const contentMap: Record<string, string> = {};

  const traverseChapters = (chapterList: RPDetailChapter[]) => {
    chapterList.forEach((chapter) => {
      const chapterId = String(chapter.chapterId);
      const message = getLatestMessageByChapterIdRole(messages || [], chapterId, 'aiReportContent');
      // 优先使用 message（流式预览），无 message 时使用 chapter.content
      contentMap[chapterId] = renderContentFromChapter(chapter, message, referenceOrdinalMap);

      if (chapter.children?.length) {
        traverseChapters(chapter.children);
      }
    });
  };

  traverseChapters(chapters);
  return contentMap;
};

/**
 * 生成章节 AI 消息状态映射
 * 返回 chapterId -> status 的映射，用于UI控制
 *
 * @param chapters 章节列表
 * @param messages Agent 消息列表（使用原始消息而非解析后的消息）
 * @returns 章节状态映射
 *
 * @example
 * ```typescript
 * const statusMap = createChapterAIMessageStatusMap(chapters, agentMessages);
 * const status = statusMap[chapterId]; // 'idle' | 'pending' | 'receiving' | 'finish'
 * ```
 */
export const createChapterAIMessageStatusMap = (
  chapters: RPDetailChapter[],
  messages: MessageInfo<RPContentAgentMsg>[]
): Record<string, ChapterGenerationStatus> => {
  const statusMap: Record<string, ChapterGenerationStatus> = {};

  const traverseChapters = (chapterList: RPDetailChapter[]) => {
    chapterList.forEach((chapter) => {
      const chapterId = String(chapter.chapterId);
      // 使用 Agent 消息而非解析后的消息来获取状态
      const message = getLatestAgentMessageByChapterId(messages || [], chapterId);
      statusMap[chapterId] = determineChapterAIMessageStatus(message, chapter);

      if (chapter.children?.length) {
        traverseChapters(chapter.children);
      }
    });
  };

  traverseChapters(chapters);
  return statusMap;
};

/**
 * 章节 Loading 状态
 *
 * @description 用于外部组件（Loading Overlay）渲染
 */
export interface ChapterLoadingState {
  chapterId: string;
  status: ChapterGenerationStatus;
}

/**
 * 选择器：正在生成的章节列表
 *
 * @description
 * 从章节状态映射中筛选出正在生成的章节（pending 或 receiving 状态）。
 * 用于驱动 Loading Overlay 的显示。
 *
 * @returns 正在生成的章节列表
 *
 * @example
 * ```typescript
 * const loadingChapters = useReportContentSelector(selectLoadingChapters);
 * // [{ chapterId: '1', status: 'pending' }, { chapterId: '2', status: 'receiving' }]
 * ```
 */
export const createChapterAIMsgLoadingStatusMap = (
  statusMap: Record<string, ChapterGenerationStatus>
): ChapterLoadingState[] => {
  return Object.entries(statusMap)
    .filter(([, status]) => status === 'pending' || status === 'receiving')
    .map(([chapterId, status]) => ({
      chapterId,
      status,
    }));
};
