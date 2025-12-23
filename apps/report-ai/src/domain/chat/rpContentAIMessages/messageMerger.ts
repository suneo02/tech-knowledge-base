/**
 * 消息合并工具
 *
 * 负责将 AI 生成完成后的 parsedRPContentMessages 合并到章节的 Canonical Layer
 * 实现"流式显示 → 消息合并 → 闸门注水"数据流的关键环节
 */

import type { ReportBusinessStats, ReportOperationResult } from '@/domain/shared';
import { MessageParsedReportContent } from '@/types';
import type { MessageInfo } from '@ant-design/x/es/use-x-chat';
import console from 'console';
import type { RPDetailChapter, RPFileTraced, WithDPUList, WithRAGList } from 'gel-api';
import { getLatestMessageByChapterIdRole } from './messageFilter';
import {
  extractDPUFromSuggestionMessages,
  extractRAGFromSuggestionMessages,
  extractRefFilesFromSuggestionMessages,
} from './suggestionExtractors';

/**
 * 消息合并统计信息（扩展基础统计）
 */
export interface MessageMergeStats extends ReportBusinessStats {
  /** 成功合并的章节数量 */
  successCount: number;
  /** 失败的章节数量 */
  failureCount: number;
}

/**
 * 消息合并结果（使用共享操作结果类型）
 */
export interface MessageMergeResult extends ReportOperationResult<RPDetailChapter[]> {
  /** 更新的章节列表 */
  updatedChapters: RPDetailChapter[];
  /** 合并详情 */
  mergeDetails: ChapterMergeDetail[];
  /** 合并统计信息 */
  stats: MessageMergeStats;
}

/**
 * 章节合并详情
 */
export interface ChapterMergeDetail {
  chapterId: string;
  success: boolean;
  /** 合并前的内容长度 */
  beforeLength: number;
  /** 合并后的内容长度 */
  afterLength: number;
  /** 是否提取了引用数据 */
  hasRefData: boolean;
  /** 错误信息（如果失败） */
  error?: string;
}

/**
 * 引用数据提取结果
 */
export interface RefDataExtractResult extends Partial<WithDPUList>, Partial<WithRAGList> {
  /** 引用文件数据 */
  refFiles?: RPFileTraced[];
}

/**
 * 将 AI 生成完成后的消息合并到章节的 aigcContent
 *
 * @param chapters 章节列表
 * @param messages AI 生成的消息列表
 * @param options 合并选项
 * @returns 合并结果
 */
export const mergeMessagesToChapters = (
  chapters: RPDetailChapter[],
  messages: MessageInfo<MessageParsedReportContent>[],
  options: {
    /** 是否提取引用数据 */
    extractRefData?: boolean;
    /** 是否覆盖现有内容 */
    overwriteExisting?: boolean;
  } = {}
): MessageMergeResult => {
  const { extractRefData = true, overwriteExisting = true } = options;

  const updatedChapters: RPDetailChapter[] = [...chapters];
  const mergeDetails: ChapterMergeDetail[] = [];
  let successCount = 0;
  let failureCount = 0;

  for (const chapter of updatedChapters) {
    const chapterId = String(chapter.chapterId);

    try {
      const beforeLength = chapter.content?.length || 0;

      // 查找该章节的最新 AI 生成消息
      const latestAIContentMessage = getLatestMessageByChapterIdRole(messages, chapterId, 'aiReportContent');
      // 查找 该章节的 最新 suggestion 消息
      const latestSuggestionMessage = getLatestMessageByChapterIdRole(messages, chapterId, 'suggestion');

      if (!latestAIContentMessage) {
        continue;
      }

      // 检查消息是否已完成
      if (latestAIContentMessage.message.status !== 'finish') {
        continue;
      }

      // 提取消息内容作为 aigcContent
      const messageContent = latestAIContentMessage.message.content || '';

      // 决定是否更新内容
      const shouldUpdate = overwriteExisting || !chapter.content;

      if (shouldUpdate) {
        // 更新章节内容
        chapter.content = messageContent;
        chapter.contentType = 'md'; // AI 生成的内容通常是 Markdown 格式

        // 提取引用数据
        if (extractRefData) {
          // 更新引用数据
          chapter.refData = extractDPUFromSuggestionMessages(latestSuggestionMessage);
          chapter.refSuggest = extractRAGFromSuggestionMessages(latestSuggestionMessage);
          chapter.files = extractRefFilesFromSuggestionMessages(latestSuggestionMessage);
        }

        const afterLength = messageContent.length;

        mergeDetails.push({
          chapterId,
          success: true,
          beforeLength,
          afterLength,
          hasRefData: !!(chapter.refData || chapter.refSuggest || chapter.files),
        });

        successCount++;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      mergeDetails.push({
        chapterId,
        success: false,
        beforeLength: chapter.content?.length || 0,
        afterLength: 0,
        hasRefData: false,
        error: errorMessage,
      });

      failureCount++;

      console.error(`[messageMerger] Failed to merge chapter ${chapterId}:`, error);
    }
  }

  return {
    success: failureCount === 0,
    data: updatedChapters,
    error: failureCount > 0 ? `${failureCount} 个章节合并失败` : undefined,
    updatedChapters,
    mergeDetails,
    stats: {
      totalCount: chapters.length,
      maxDepth: 0, // 这里可以根据实际需要计算
      levelCounts: {},
      successCount,
      failureCount,
    },
  };
};

/**
 * 检查章节是否需要合并消息
 *
 * @param chapter 章节数据
 * @param messages 消息列表
 * @returns 是否需要合并
 */
export const shouldMergeChapter = (
  chapter: RPDetailChapter,
  messages: MessageInfo<MessageParsedReportContent>[]
): boolean => {
  const chapterId = String(chapter.chapterId);
  const latestMessage = getLatestMessageByChapterIdRole(messages, chapterId, 'aiReportContent');

  if (!latestMessage) {
    return false;
  }

  // 只有完成的消息才需要合并
  return latestMessage.message.status === 'finish';
};

/**
 * 批量检查哪些章节需要合并
 *
 * @param chapters 章节列表
 * @param messages 消息列表
 * @returns 需要合并的章节 ID 列表
 */
export const getChaptersNeedingMerge = (
  chapters: RPDetailChapter[],
  messages: MessageInfo<MessageParsedReportContent>[]
): string[] => {
  return chapters
    .filter((chapter) => shouldMergeChapter(chapter, messages))
    .map((chapter) => String(chapter.chapterId));
};
