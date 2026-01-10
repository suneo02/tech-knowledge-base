/**
 * 全文生成控制器 Hook - 集中管理副作用
 *
 * 此 Hook 负责监听 Redux 状态变化并触发副作用（发送请求、处理完成等）
 * 应该只在 RPDetailRTKScope 内部挂载一次，避免重复监听
 *
 * @see {@link ../../../docs/issues/full-doc-generation-duplicate-requests.md | 全文生成重复请求问题}
 * @see {@link ./useFullDocGeneration.ts | 全文生成操作 Hook}
 */

import { useReportDetailContext } from '@/context';
import { useEffect } from 'react';
import { useRPDetailDispatch, useRPDetailSelector } from '../hooksRedux';
import {
  selectFullDocGenData,
  selectFullDocGenError,
  selectIsFullDocGen,
  selectLatestRequestedOperations,
  selectLeafChapterMap,
} from '../selectors';
import { rpDetailActions } from '../slice';
import { ChapterHookGenUtils } from './utils/generationUtils';

/**
 * 全文生成控制器 Hook
 *
 * 负责监听全文生成状态并触发副作用：
 * 1. 监听队列进度，发送章节生成请求
 * 2. 监听流式消息，处理章节完成逻辑
 *
 * ⚠️ 重要：此 Hook 应该只在应用中挂载一次（通过 RPDetailRTKScope）
 * 多次挂载会导致重复请求和状态不一致
 */
export const useFullDocGenerationController = (): void => {
  const dispatch = useRPDetailDispatch();
  const { rpContentAgentMsgs: agentMessages, sendRPContentMsg, clearChapterMessages } = useReportDetailContext();
  // 从 Redux 获取状态
  const leafChapterMap = useRPDetailSelector(selectLeafChapterMap);
  const isFullGenOp = useRPDetailSelector(selectIsFullDocGen);
  const error = useRPDetailSelector(selectFullDocGenError);
  const fullGenData = useRPDetailSelector(selectFullDocGenData);
  const latestRequestedOperations = useRPDetailSelector(selectLatestRequestedOperations);

  /**
   * Effect 1: 根据当前生成索引触发下一章节请求
   * 使用 GenerationOrchestrator 的幂等控制逻辑
   */
  useEffect(() => {
    if (!isFullGenOp || fullGenData.currentIndex >= fullGenData.queue.length) {
      return;
    }

    const currentChapterId = ChapterHookGenUtils.getCurrentChapterId(fullGenData.queue, fullGenData.currentIndex);
    if (!currentChapterId) return;

    // 验证章节存在性
    if (!leafChapterMap.has(currentChapterId)) {
      dispatch(rpDetailActions.setFullDocumentGenerationError(`Chapter not found: ${currentChapterId}`));
      return;
    }

    // 检查是否应该发送请求
    const { should, correlationId } = ChapterHookGenUtils.shouldSendRequest(
      currentChapterId,
      latestRequestedOperations
    );

    if (!should || !correlationId) {
      return;
    }

    // 发送生成请求
    ChapterHookGenUtils.sendGenerationRequest(currentChapterId, correlationId, sendRPContentMsg, dispatch);
  }, [isFullGenOp, fullGenData, leafChapterMap, sendRPContentMsg, dispatch, latestRequestedOperations]);

  /**
   * Effect 2: 监听流式消息，确认当前章节的生成是否结束
   * 使用 GenerationOrchestrator 处理完成逻辑
   */
  useEffect(() => {
    if (!isFullGenOp) return;

    const currentChapterId = ChapterHookGenUtils.getCurrentChapterId(fullGenData.queue, fullGenData.currentIndex);
    if (!currentChapterId) return;

    const isCurrentChapterFinished = ChapterHookGenUtils.isChapterFinished(currentChapterId, agentMessages);

    if (isCurrentChapterFinished) {
      const isLast = ChapterHookGenUtils.isLastChapter(fullGenData.currentIndex, fullGenData.queue.length);
      const latest = latestRequestedOperations[currentChapterId];
      const correlationId = latest?.correlationId;

      if (!correlationId) {
        console.warn('[FullDocGeneration] Missing correlationId for chapter completion', { currentChapterId });
        return;
      }

      // 合并消息到章节（使用 agent 消息，包含 entity 和 traces）
      dispatch(
        rpDetailActions.processSingleChapterCompletion({
          chapterId: currentChapterId,
          messages: agentMessages,
          correlationId,
          extractRefData: true,
          overwriteExisting: true,
        })
      );

      // 清理该章节的流式消息，确保渲染切换到 chapter.content
      clearChapterMessages(currentChapterId);

      // 触发注水任务（在消息清理后，确保使用 chapter.content）
      dispatch(
        rpDetailActions.setHydrationTask({
          type: 'chapter-rehydrate',
          chapterIds: [currentChapterId],
          correlationIds: [correlationId],
        })
      );

      // 推进到下一章节
      dispatch(rpDetailActions.progressToNextChapter());

      // 若为最后一章，触发完成
      if (isLast) {
        dispatch(rpDetailActions.completeFullDocumentGeneration({ success: !error }));
      }
    }
  }, [agentMessages, isFullGenOp, fullGenData, dispatch, error, latestRequestedOperations]);
};
