/**
 * useStreamingPreview
 *
 * 全文生成期间的流式增量预览与生成结束后的去重缓存重置。
 *
 * 注意：这是预览功能，不修改 Canonical，只更新编辑器视图。
 *
 * @see {@link ./HYDRATION.md | Hydration 运行手册 - 流式预览}
 * @see {@link ../README.md | Hooks 架构说明}
 * @see apps/report-ai/docs/RPDetail/RPEditor/rendering-and-presentation-guide.md - 流式更新策略
 *
 * 原名：useStreamingGenerationHydration
 */

import { SectionDeduper } from '@/domain/reportEditor/editor';
import { ReportEditorRef } from '@/types/editor';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { useReportContentSelector } from '../../hooksRedux';
import { selectChapterAIMessageStatusMap, selectChapterContentMap, selectIsChapterAIGCOp } from '../../selectors';
import { selectParsedRPContentMessages } from '../../selectors/base';

export interface UseStreamingPreviewOptions {
  editorRef: RefObject<ReportEditorRef> | null;
  enableStreaming?: boolean;
}

export const useChapterStreamPreview = (options: UseStreamingPreviewOptions) => {
  const { editorRef, enableStreaming = true } = options;

  const isChapterAigc = useReportContentSelector(selectIsChapterAIGCOp);
  const contentMap = useReportContentSelector(selectChapterContentMap);
  const statusMap = useReportContentSelector(selectChapterAIMessageStatusMap);
  const parsedMessages = useReportContentSelector(selectParsedRPContentMessages);

  // 去重器（跨渲染周期缓存）
  const deduperRef = useRef(new SectionDeduper());

  // 流式增量渲染
  useEffect(() => {
    if (!enableStreaming) return;
    if (!isChapterAigc) return;
    if (!editorRef?.current) return;
    if (!contentMap || Object.keys(contentMap).length === 0) return;
    if (!parsedMessages || parsedMessages.length === 0) return;

    const editorRef_current = editorRef.current;
    if (!editorRef_current.isEditorReady()) return;

    const activeChapterIds = Object.keys(statusMap).filter((chapterId) => {
      const status = statusMap[chapterId];
      const content = contentMap[chapterId] || '';
      if (deduperRef.current.shouldSkip(chapterId, content, status)) return false;
      return status === 'receiving' || status === 'pending' || status === 'finish';
    });

    if (activeChapterIds.length === 0) return;

    let successCount = 0;
    let failureCount = 0;

    for (const chapterId of activeChapterIds) {
      const content = contentMap[chapterId] || '';
      const status = statusMap[chapterId] || 'not_started';

      const result = editorRef_current.updateStreamingSection(chapterId, content, status, {
        useTransaction: true,
        fireEvents: false,
        shouldSkip: (id, html, stat) => deduperRef.current.shouldSkip(id, html, stat),
        onRendered: (id, html, stat) => deduperRef.current.markRendered(id, html, stat),
      });

      if (result.success) successCount++;
      else {
        failureCount++;
      }
    }
  }, [enableStreaming, isChapterAigc, parsedMessages, contentMap, statusMap, editorRef]);

  // 生成结束后重置去重缓存
  useEffect(() => {
    if (!isChapterAigc) {
      deduperRef.current = new SectionDeduper();
    }
  }, [isChapterAigc]);
};
