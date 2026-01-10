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

import { useReportDetailContext } from '@/context';
import { createChapterAIMessageStatusMap, createChapterStreamPreviewMap } from '@/domain/reportEditor/chapter';
import { SectionDeduper } from '@/domain/reportEditor/editor';
import { ReportEditorRef } from '@/types/editor';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { useRPDetailSelector } from '../../hooksRedux';
import { selectCanonicalChaptersEnriched, selectIsChapterAIGCOp, selectReferenceOrdinalMap } from '../../selectors';

export interface UseStreamingPreviewOptions {
  editorRef: RefObject<ReportEditorRef> | null;
  enableStreaming?: boolean;
}

export const useChapterStreamPreview = (options: UseStreamingPreviewOptions) => {
  const { editorRef, enableStreaming = true } = options;

  const { rpContentAgentMsgs } = useReportDetailContext();

  const isChapterAigc = useRPDetailSelector(selectIsChapterAIGCOp);
  const chapters = useRPDetailSelector(selectCanonicalChaptersEnriched);
  const referenceOrdinalMap = useRPDetailSelector(selectReferenceOrdinalMap);

  // 使用函数生成内容映射和状态映射
  const contentMap = createChapterStreamPreviewMap(chapters, rpContentAgentMsgs, referenceOrdinalMap);
  const statusMap = createChapterAIMessageStatusMap(chapters, rpContentAgentMsgs);

  // 去重器（跨渲染周期缓存）
  const deduperRef = useRef(new SectionDeduper());

  // 流式增量渲染
  useEffect(() => {
    if (!enableStreaming) return;
    if (!isChapterAigc) return;
    if (!editorRef?.current) return;
    if (!contentMap || Object.keys(contentMap).length === 0) return;
    if (!rpContentAgentMsgs || rpContentAgentMsgs.length === 0) return;

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

    // 注意：外部组件（Loading 指示器、AIGC 按钮）的渲染已经通过 props 和内部状态自动驱动
    // statusMap 变化会自动触发 loadingChapters 更新，进而触发外部组件重新渲染
    // 因此这里不需要手动调用 renderExternalComponents
  }, [enableStreaming, isChapterAigc, rpContentAgentMsgs, contentMap, statusMap, editorRef]);

  // 生成结束后重置去重缓存
  useEffect(() => {
    if (!isChapterAigc) {
      deduperRef.current = new SectionDeduper();
    }
  }, [isChapterAigc]);
};
