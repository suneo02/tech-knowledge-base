/**
 * useCompletionHandler - 完成检测与收尾（重构后）
 *
 * 监听消息流，检测章节完成 → 触发 processSingleChapterCompletion。
 *
 * @see {@link ./HYDRATION.md | Hydration 运行手册 - 完成处理}
 * @see {@link ../README.md | Hooks 架构说明}
 *
 * @since 3.0 (移除 needsRehydration 依赖)
 */

import { useReportDetailContext } from '@/context';
import { isReportChapterGenerationFinished } from '@/domain/chat/rpContentAIMessages';
import { useEffect } from 'react';
import { useRPDetailDispatch, useRPDetailSelector } from '../../hooksRedux';
import { selectGlobalOp } from '../../selectors';
import { rpDetailActions } from '../../slice';

export const useCompletionHandler = () => {
  const dispatch = useRPDetailDispatch();
  const { clearChapterMessages, rpContentAgentMsgs: agentMessages } = useReportDetailContext();

  const globalOp = useRPDetailSelector(selectGlobalOp);

  // ========== 职责 1: 检测章节完成 ==========
  useEffect(() => {
    // 仅针对单章节重生成：全文生成在 useFullDocGeneration 中自行处理完成逻辑（其进度依赖 generationQueue）
    if (globalOp.kind !== 'chapter_regeneration') {
      return;
    }

    // 从 globalOp.data 中获取章节信息
    if (!globalOp.data || globalOp.data.type !== 'chapter_regeneration') {
      return;
    }

    const { chapterId, correlationId } = globalOp.data;

    // 使用 domain 层的工具函数检查章节是否完成
    const isFinished = isReportChapterGenerationFinished(agentMessages, chapterId);

    if (!isFinished) return;

    // 合并消息到章节（使用 agent 消息，包含 entity 和 traces）
    dispatch(
      rpDetailActions.processSingleChapterCompletion({
        chapterId,
        messages: agentMessages,
        correlationId,
        extractRefData: true,
        overwriteExisting: true,
      })
    );

    // 清理该章节的流式消息，确保渲染切换到 chapter.content
    clearChapterMessages(chapterId);

    // 触发注水任务（在消息清理后，确保使用 chapter.content）
    dispatch(
      rpDetailActions.setHydrationTask({
        type: 'chapter-rehydrate',
        chapterIds: [chapterId],
        correlationIds: [correlationId],
      })
    );
  }, [agentMessages, globalOp, dispatch, clearChapterMessages]);
};
