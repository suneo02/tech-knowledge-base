/**
 * 多章节顺序生成 Hook
 *
 * 负责多章节顺序生成的控制逻辑
 * 基于 useGenerationBase 统一生成流程
 *
 * @see {@link ../../../docs/specs/multi-chapter-sequential-aigc/spec-core-v1.md | 多章节顺序 AIGC 实现方案}
 * @see {@link ../../../docs/RPDetail/ContentManagement/multi-chapter-sequential-aigc-flow.md | 多章节顺序 AIGC 场景}
 */

import { useCallback, useEffect } from 'react';
import { useRPDetailDispatch, useRPDetailSelector } from '../hooksRedux';

import {
  selectCanonicalChaptersEnriched,
  selectIsGlobalBusy,
  selectIsMultiChapterGenerating,
  selectLatestRequestedOperations,
  selectLeafChapterMap,
  selectLeafChapterOrderMap,
  selectMultiChapterFailedChapters,
  selectMultiChapterGenerationProgress,
  selectMultiChapterGenerationQueue,
} from '../selectors';

import { useReportDetailContext } from '@/context';
import { findChapterById } from '@/domain/chapter';
import { getLeafNodes } from 'gel-util/common';
import { rpDetailActions } from '../slice';
import { ChapterHookGenUtils } from './utils/generationUtils';

export interface UseMultiChapterGenerationParams {
  /** 生成开始回调 */
  onGenerationStart?: () => void;
  /** 单章节完成回调 */
  onChapterComplete?: (chapterId: string, success: boolean) => void;
}

export interface UseMultiChapterGenerationReturn {
  // 操作方法（包含业务逻辑）
  startGeneration: (chapterIds: string[]) => void;

  // 状态查询
  isGenerating: boolean;
  progress: ReturnType<typeof selectMultiChapterGenerationProgress>;
  failedChapters: string[];
}

/**
 * 多章节顺序生成控制器 Hook
 *
 * 职责：
 * - 队列初始化：展开父章节、过滤重复与锁定、按树顺序排序
 * - 失败处理：记录失败章节
 *
 * 复用策略：
 * - 核心生成逻辑：使用 GenerationOrchestrator 静态方法
 * - 队列管理：复用统一的顺序调度逻辑
 * - 完成检测：复用 GenerationOrchestrator.isChapterFinished
 */
export const useMultiChapterGeneration = (
  params?: UseMultiChapterGenerationParams
): UseMultiChapterGenerationReturn => {
  const { onGenerationStart, onChapterComplete } = params || {};
  const { sendRPContentMsg, rpContentAgentMsgs, setMsgs, clearChapterMessages } = useReportDetailContext();

  const dispatch = useRPDetailDispatch();

  // 从 Redux 获取状态
  const chapters = useRPDetailSelector(selectCanonicalChaptersEnriched);
  const leafChapterMap = useRPDetailSelector(selectLeafChapterMap);
  const leafChapterOrderMap = useRPDetailSelector(selectLeafChapterOrderMap);
  const isGenerating = useRPDetailSelector(selectIsMultiChapterGenerating);
  const isGlobalBusy = useRPDetailSelector(selectIsGlobalBusy);
  const progress = useRPDetailSelector(selectMultiChapterGenerationProgress);
  const generationQueue = useRPDetailSelector(selectMultiChapterGenerationQueue);
  const failedChapters = useRPDetailSelector(selectMultiChapterFailedChapters);
  const latestRequestedOperations = useRPDetailSelector(selectLatestRequestedOperations);

  /**
   * 开始多章节生成
   */
  const startGeneration = useCallback(
    (chapterIds: string[]) => {
      if (isGlobalBusy) {
        console.warn('[MultiChapterGeneration] Generation already in progress');
        return;
      }

      try {
        // 🔑 关键：先清空 Context 中的历史消息，避免 ChatSync 重新同步回来
        // 这样可以防止 useCompletionHandler 重复检测到历史完成消息
        setMsgs([]);
        // 1. 展开父章节为叶子节点
        const allLeafIds: string[] = [];
        chapterIds.forEach((id) => {
          const chapter = findChapterById(chapters, id);
          if (chapter) {
            const leafNodes = getLeafNodes([chapter]);
            leafNodes.forEach((leaf) => allLeafIds.push(String(leaf.chapterId)));
          }
        });

        // 2. 过滤重复
        const uniqueIds = Array.from(new Set(allLeafIds));

        if (uniqueIds.length === 0) {
          console.warn('[MultiChapterGeneration] No valid chapters to generate');
          return;
        }

        // 3. 按照章节在树中的顺序排序
        const sortedIds = uniqueIds.sort((a, b) => {
          const orderA = leafChapterOrderMap.get(a) ?? Infinity;
          const orderB = leafChapterOrderMap.get(b) ?? Infinity;
          return orderA - orderB;
        });

        // 4. 批量锁定章节并初始化队列
        dispatch(
          rpDetailActions.startChapterOperation({
            mode: 'batch',
            chapterIds: sortedIds,
          })
        );

        dispatch(
          rpDetailActions.startMultiChapterGeneration({
            chapterIds: sortedIds,
          })
        );

        onGenerationStart?.();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to start generation';
        console.error('[MultiChapterGeneration] Start failed:', errorMessage);
      }
    },
    [chapters, dispatch, isGlobalBusy, leafChapterOrderMap, onGenerationStart]
  );

  /**
   * 根据当前生成索引触发下一章节请求
   * 使用 GenerationOrchestrator 的幂等控制逻辑
   */
  useEffect(() => {
    if (!isGenerating || progress.currentIndex >= generationQueue.length) {
      return;
    }

    const currentChapterId = ChapterHookGenUtils.getCurrentChapterId(generationQueue, progress.currentIndex);
    if (!currentChapterId) return;

    // 验证章节存在性
    if (!leafChapterMap.has(currentChapterId)) {
      console.error('[MultiChapterGeneration] Chapter not found:', currentChapterId);
      dispatch(rpDetailActions.markMultiChapterFailed({ chapterId: currentChapterId }));
      dispatch(rpDetailActions.progressMultiChapterToNext());
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
  }, [
    isGenerating,
    progress.currentIndex,
    generationQueue,
    sendRPContentMsg,
    dispatch,
    latestRequestedOperations,
    leafChapterMap,
  ]);

  /**
   * 监听流式消息，确认当前章节的生成是否结束
   * 使用 GenerationOrchestrator 处理完成逻辑
   */
  useEffect(() => {
    if (!isGenerating) return;

    const currentChapterId = ChapterHookGenUtils.getCurrentChapterId(generationQueue, progress.currentIndex);
    if (!currentChapterId) return;

    const isCurrentChapterFinished = ChapterHookGenUtils.isChapterFinished(currentChapterId, rpContentAgentMsgs);

    if (isCurrentChapterFinished) {
      const isLast = ChapterHookGenUtils.isLastChapter(progress.currentIndex, generationQueue.length);
      const latest = latestRequestedOperations[currentChapterId];
      const correlationId = latest?.correlationId;

      if (!correlationId) {
        console.warn('[MultiChapterGeneration] Missing correlationId for chapter completion', { currentChapterId });
        dispatch(rpDetailActions.markMultiChapterFailed({ chapterId: currentChapterId }));
        onChapterComplete?.(currentChapterId, false);
      } else {
        // 合并消息到章节
        dispatch(
          rpDetailActions.processSingleChapterCompletion({
            chapterId: currentChapterId,
            messages: rpContentAgentMsgs,
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

        onChapterComplete?.(currentChapterId, true);
      }

      // 推进到下一章节
      dispatch(rpDetailActions.progressMultiChapterToNext());

      // 若为最后一章，触发完成
      if (isLast) {
        dispatch(
          rpDetailActions.completeMultiChapterGeneration({
            success: !!correlationId && failedChapters.length === 0,
          })
        );
      }
    }
  }, [
    rpContentAgentMsgs,
    isGenerating,
    progress.currentIndex,
    generationQueue,
    dispatch,
    latestRequestedOperations,
    failedChapters.length,
    onChapterComplete,
  ]);

  return {
    startGeneration,
    isGenerating,
    progress,
    failedChapters,
  };
};
