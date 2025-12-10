/**
 * 生成工具类
 *
 * 提供生成流程中常用的工具方法，避免代码重复
 * 采用静态类设计，提供更好的组织和封装
 *
 * @see {@link ../../../../docs/RPDetail/ContentManagement/full-generation-flow.md | 全文生成流程}
 * @see {@link ../../../../docs/RPDetail/ContentManagement/multi-chapter-sequential-aigc-flow.md | 多章节顺序生成流程}
 */

import { isLastReportChapter, isReportChapterGenerationFinished } from '@/domain/chat/rpContentAIMessages';
import { AppDispatch } from '@/store/type';
import { RPContentSendInput } from '@/types/chat/RPContent';
import { ChatPresetQuestion } from 'gel-api';
import { rpContentSlice } from '../../slice';
import type { ReportContentState } from '../../types';

/**
 * 生成工具类 - 提供章节生成流程中的常用工具方法
 */
export class ChapterHookGenUtils {
  /**
   * 检查是否应该发送请求（幂等控制）
   */
  static shouldSendRequest(
    chapterId: string,
    latestRequestedOperations: ReportContentState['hydration']['latestRequestedOperations']
  ): { should: boolean; correlationId?: string } {
    const latest = latestRequestedOperations[chapterId];
    if (!latest || latest.requested) {
      return { should: false };
    }
    return { should: true, correlationId: latest.correlationId };
  }

  /**
   * 发送生成请求并标记已发送
   */
  static sendGenerationRequest(
    chapterId: string,
    correlationId: string,
    sendMessage: (message: RPContentSendInput) => void,
    dispatch: AppDispatch
  ): void {
    dispatch(
      rpContentSlice.actions.markChapterOperationRequested({
        chapterId,
        correlationId,
      })
    );
    sendMessage({
      content: ChatPresetQuestion.GENERATE_FULL_TEXT,
      chapterId,
    });
  }

  /**
   * 检查章节是否完成
   */
  static isChapterFinished(chapterId: string, parsedMessages: ReportContentState['parsedRPContentMessages']): boolean {
    return isReportChapterGenerationFinished(parsedMessages, chapterId);
  }

  /**
   * 检查是否为最后一章
   */
  static isLastChapter(currentIndex: number, queueLength: number): boolean {
    return isLastReportChapter(currentIndex, queueLength);
  }

  /**
   * 获取当前章节 ID
   */
  static getCurrentChapterId(queue: string[], currentIndex: number): string | null {
    if (currentIndex >= queue.length) return null;
    return queue[currentIndex] || null;
  }
}
