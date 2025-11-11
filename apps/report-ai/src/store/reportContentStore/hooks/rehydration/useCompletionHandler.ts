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

import { useEffect } from 'react';
import { useReportContentDispatch, useReportContentSelector } from '../../hooksRedux';
import { selectChapters, selectGlobalOperationKind } from '../../selectors';
import { selectHydration, selectParsedRPContentMessages } from '../../selectors/base';
import { rpContentSlice } from '../../slice';

export const useCompletionHandler = () => {
  const dispatch = useReportContentDispatch();

  const chapters = useReportContentSelector(selectChapters);
  const hydration = useReportContentSelector(selectHydration);
  const parsedMessages = useReportContentSelector(selectParsedRPContentMessages);
  const globalOpKind = useReportContentSelector(selectGlobalOperationKind);

  // ========== 职责 1: 检测章节完成 ==========
  useEffect(() => {
    if (!parsedMessages || parsedMessages.length === 0) return;
    if (!chapters || chapters.length === 0) return;

    // 只检查最近消息，避免全量扫描
    const tail = parsedMessages.slice(-6);

    for (const msg of tail) {
      const isFinish =
        msg.message.role === 'aiReportContent' &&
        msg.message.chapterId &&
        (msg.message.status === 'finish' || msg.message.status === 'stream_finish');

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

      // 合并消息并标记待注水（由 useScenarioHydration 消费）
      dispatch(
        rpContentSlice.actions.processSingleChapterCompletion({
          chapterId,
          correlationId: latest.correlationId,
          extractRefData: true,
          overwriteExisting: true,
        })
      );
    }
  }, [parsedMessages, chapters, hydration?.activeOperations, dispatch, globalOpKind]);
};
