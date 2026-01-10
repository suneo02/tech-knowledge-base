import { findChapterById, findChapterPathById } from '@/domain/chapter';
import { mergeMessagesToChapter } from '@/domain/chat/rpContentAIMessages';
import { RPContentAgentMsg } from '@/types';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { setTreeNodeByPath } from 'gel-util/common';
import { ReportContentState } from '../types';

export interface ProcessSingleChapterCompletionParams {
  /** 目标章节ID */
  chapterId: string;
  /** Agent 消息列表（原始消息，包含 entity 和 traces） */
  messages: MessageInfo<RPContentAgentMsg>[];
  /** 关联ID（可选） */
  correlationId?: string;
}

/**
 * 处理单个章节完成的统一逻辑
 *
 * 整合消息合并、状态更新、重注水触发的完整流程
 * 用于替代重复的单章节处理逻辑
 */
export const processSingleChapterCompletion = (
  state: ReportContentState,
  params: ProcessSingleChapterCompletionParams
): void => {
  const { chapterId, messages, correlationId } = params;

  // 查找目标章节
  const chapter = findChapterById(state.chapters, chapterId);
  if (!chapter) {
    console.warn(`[chapterProcessing] Chapter ${chapterId} not found for completion processing`);
    return;
  }

  // 使用工具函数合并单个章节的消息
  const success = mergeMessagesToChapter(chapter, messages);

  if (success) {
    // 查找章节路径并更新（chapter 已经被原地修改）
    const path = findChapterPathById(state.chapters, chapterId);
    if (path) {
      state.chapters = setTreeNodeByPath(state.chapters, path, chapter);
    }

    // 更新章节状态的 epoch
    if (!state.chapterStates[chapterId]) {
      state.chapterStates[chapterId] = { chapterId };
    }
    state.chapterStates[chapterId].epoch = Date.now();
    state.chapterStates[chapterId].lastModified = Date.now();

    // 注意：注水任务不在此处触发，而是在消息清理后由调用方手动触发
    // 这样可以确保注水时使用的是 chapter.content 而非流式消息
    // @see {@link ../../../docs/issues/chapter-rendering-missing-source-data.md | 章节渲染缺失溯源数据问题}

    if (correlationId) {
      const operation = state.hydration.activeOperations[correlationId];
      if (operation) {
        operation.status = 'completed';
      } else {
        console.warn('[chapterProcessing] Active operation not found for correlationId:', correlationId);
      }
    }

    // 清理幂等记录，允许后续再次触发请求
    const latestRequest = state.hydration.latestRequestedOperations[chapterId];
    if (!correlationId || (latestRequest && latestRequest.correlationId === correlationId)) {
      delete state.hydration.latestRequestedOperations[chapterId];
    }

    // 如果是单章节重生成，结束 globalOperation
    const { kind, data } = state.globalOp;
    if (
      kind === 'chapter_regeneration' &&
      data?.type === 'chapter_regeneration' &&
      data.chapterId === chapterId &&
      data.correlationId === correlationId
    ) {
      // 解锁章节
      if (state.chapterStates[chapterId]) {
        state.chapterStates[chapterId].locked = false;
      }

      // 完成操作，回到 idle
      state.globalOp = {
        kind: 'idle',
        startedAt: null,
        operationId: undefined,
        data: null,
        error: null,
      };
    }
  } else {
    console.warn(`[chapterProcessing] Failed to process chapter ${chapterId} completion`);
  }
};
