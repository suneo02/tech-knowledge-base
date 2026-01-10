import { findChapterById } from '@/domain/chapter';
import { generateCorrelationId } from '@/domain/chat/correlation';
import { GlobalOperationKind } from '@/types/report';
import { PayloadAction } from '@reduxjs/toolkit';
import { ReportContentState } from '../../types';
import { ChapterOperationHelper, ChapterRequestHelper, ChapterStateHelper } from './shared';

type ChapterOperationMode = 'single' | 'batch';

interface StartChapterOperationPayload {
  /** single → 单章生成 / batch → 全文生成 */
  mode: ChapterOperationMode;
  /** 需要处理的章节 ID 列表 */
  chapterIds: string[];
}

interface MarkChapterOperationRequestedPayload {
  chapterId: string;
  correlationId: string;
}

interface ClearChapterOperationRequestPayload {
  chapterId: string;
  correlationId?: string;
}

const resolveGlobalOperationKind = (mode: ChapterOperationMode): GlobalOperationKind => {
  // batch 由全文生成触发，其余默认当作单章重生成处理
  return mode === 'batch' ? 'full_generation' : 'chapter_regeneration';
};

/**
 * 章节操作编排 Reducers
 *
 * @description 提供章节 AIGC 操作的统一启动与请求状态管理
 */
export const chapterOperationReducers = {
  /**
   * 启动章节操作
   *
   * @description
   * - 清理消息
   * - 锁定章节 & 清空内容
   * - 创建 correlationId 并登记 activeOperations/latestRequestedOperations
   * - 设置 GlobalOperation
   * - 单章节场景初始化 chapterRegenerationData
   */
  startChapterOperation: (state: ReportContentState, action: PayloadAction<StartChapterOperationPayload>) => {
    const { mode, chapterIds } = action.payload;

    if (!chapterIds || chapterIds.length === 0) {
      return;
    }

    // 注意：消息清理已移至 Context 层，此处不再需要清空

    const now = Date.now();
    const correlationByChapter: Record<string, string> = {};

    chapterIds.forEach((chapterId) => {
      const chapter = findChapterById(state.chapters, chapterId);
      if (!chapter) {
        return;
      }

      // 清理旧的请求记录和操作
      ChapterRequestHelper.clear(state, chapterId);
      ChapterOperationHelper.removeOld(state, chapterId);

      // 锁定章节
      ChapterStateHelper.lock(state, chapterId);

      // 清空章节内容及数据，提供视觉反馈并避免旧内容干扰
      chapter.content = '';
      chapter.refData = undefined;
      chapter.refSuggest = undefined;
      chapter.files = undefined;
      chapter.entities = undefined;
      chapter.traceContent = undefined;

      // 生成 correlationId 并创建操作记录
      const correlationId = generateCorrelationId();
      correlationByChapter[chapterId] = correlationId;

      ChapterOperationHelper.create(state, chapterId, correlationId, now);
      ChapterRequestHelper.init(state, chapterId, correlationId);
    });

    // 若提供的章节均未命中（例如叶子节点缺失），直接退出以避免后续操作引用空 ID
    if (Object.keys(correlationByChapter).length === 0) {
      return;
    }

    const globalOperationKind = resolveGlobalOperationKind(mode);

    // 设置 GlobalOperation
    if (mode === 'single') {
      const targetChapterId = chapterIds[0];
      const correlationId = correlationByChapter[targetChapterId];

      state.globalOp = {
        kind: 'chapter_regeneration',
        startedAt: now,
        operationId: correlationId,
        data: {
          type: 'chapter_regeneration',
          chapterId: targetChapterId,
          correlationId: correlationId,
        },
        error: null,
      };
    } else {
      // 批量生成
      state.globalOp = {
        kind: globalOperationKind,
        startedAt: now,
        operationId: undefined,
        data: null,
        error: null,
      };

      // 批量生成：清空 Draft，保持视觉一致
      state.documentDraft = null;
    }
  },

  /**
   * 标记章节请求已发送，避免重复触发
   */
  markChapterOperationRequested: (
    state: ReportContentState,
    action: PayloadAction<MarkChapterOperationRequestedPayload>
  ) => {
    const { chapterId, correlationId } = action.payload;
    ChapterRequestHelper.markRequested(state, chapterId, correlationId);
  },

  /**
   * 清理章节请求记录
   */
  clearChapterOperationRequest: (
    state: ReportContentState,
    action: PayloadAction<ClearChapterOperationRequestPayload>
  ) => {
    const { chapterId, correlationId } = action.payload;
    const latest = state.hydration.latestRequestedOperations[chapterId];
    if (!latest) return;
    if (!correlationId || latest.correlationId === correlationId) {
      ChapterRequestHelper.clear(state, chapterId);
    }
  },
};
