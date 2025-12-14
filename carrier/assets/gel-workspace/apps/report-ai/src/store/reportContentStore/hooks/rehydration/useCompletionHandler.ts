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
import { useEffect } from 'react';
import { useReportContentDispatch, useReportContentSelector } from '../../hooksRedux';
import { selectChapters, selectGlobalOperationKind } from '../../selectors';
import { selectHydration } from '../../selectors/base';
import { rpContentSlice } from '../../slice';

export const useCompletionHandler = () => {
  const dispatch = useReportContentDispatch();
  const { clearChapterMessages, parsedRPContentMsgs: parsedMessages } = useReportDetailContext();

  const chapters = useReportContentSelector(selectChapters);
  const hydration = useReportContentSelector(selectHydration);
  const globalOpKind = useReportContentSelector(selectGlobalOperationKind);

  // ========== 职责 1: 检测章节完成 ==========
  useEffect(() => {
    if (!parsedMessages || parsedMessages.length === 0) return;
    if (!chapters || chapters.length === 0) return;

    // 只检查最近消息，避免全量扫描
    const tail = parsedMessages.slice(-6);

    for (const msg of tail) {
      const isFinish =
        msg.message.role === 'aiReportContent' && msg.message.chapterId && msg.message.status === 'finish';

      if (!isFinish) continue;

      const chapterId = String(msg.message.chapterId);

      // 仅针对单章节重生成：全文生成在 useFullDocGeneration 中自行处理完成逻辑（其进度依赖 generationQueue）
      if (globalOpKind !== 'chapter_regeneration') {
        continue;
      }

      // 通过 activeOperations 查询当前 pending 的 correlationId，保证与注水任务对齐
      const operations = Object.values(hydration?.activeOperations || {}).filter(
        (op) => op.chapterId === chapterId && op.status === 'pending'
      );

      if (operations.length === 0) continue;

      // 使用最新的操作
      const latest = operations.sort((a, b) => b.startTime - a.startTime)[0];

      // 合并消息到章节
      dispatch(
        rpContentSlice.actions.processSingleChapterCompletion({
          chapterId,
          messages: parsedMessages,
          correlationId: latest.correlationId,
          extractRefData: true,
          overwriteExisting: true,
        })
      );

      // 清理该章节的流式消息，确保渲染切换到 chapter.content
      clearChapterMessages(chapterId);

      // 触发注水任务（在消息清理后，确保使用 chapter.content）
      dispatch(
        rpContentSlice.actions.setHydrationTask({
          type: 'chapter-rehydrate',
          chapterIds: [chapterId],
          correlationIds: [latest.correlationId],
        })
      );
    }
  }, [parsedMessages, chapters, hydration?.activeOperations, dispatch, globalOpKind]);
};
