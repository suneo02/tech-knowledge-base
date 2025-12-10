/**
 * 章节业务状态逻辑处理
 *
 * 职责：
 * - 确定章节的生成状态
 * - 处理状态转换逻辑
 * - 提供状态相关的工具函数
 *
 * @module chapter/states/business
 */

import { MessageParsedReportContent } from '@/types';
import { ChapterGenerationStatus } from '@/types/editor';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { RPDetailChapter } from 'gel-api';

/**
 * 确定章节关联的 AI 消息状态（纯函数）
 */
export const determineChapterAIMessageStatus = (
  message?: MessageInfo<MessageParsedReportContent>,
  chapter?: RPDetailChapter
): ChapterGenerationStatus => {
  if (!message) {
    if (chapter?.content && String(chapter.content).trim() !== '') {
      return 'finish';
    }
    return 'idle';
  }

  if (message.message.status === 'pending') {
    return 'pending';
  } else if (message.message.status === 'receiving') {
    return 'receiving';
  } else {
    return 'finish';
  }
};

/**
 * 检查章节的 AI 消息是否正在生成中
 */
export const isChapterAIMessageGenerating = (status: ChapterGenerationStatus): boolean => {
  return status === 'pending' || status === 'receiving';
};

/**
 * 检查章节的 AI 消息是否已完成
 */
export const isChapterAIMessageFinished = (status: ChapterGenerationStatus): boolean => {
  return status === 'finish';
};

/**
 * 获取章节 AI 消息状态的显示文本
 */
export const getChapterAIMessageStatusDisplayText = (status: ChapterGenerationStatus): string => {
  switch (status) {
    case 'idle':
      return '未开始';
    case 'pending':
      return '等待中';
    case 'receiving':
      return '生成中';
    case 'finish':
      return '已完成';
    default:
      return '未知状态';
  }
};
