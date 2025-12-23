/**
 * 文档保存 Hook - 单飞保存流程
 *
 * @description
 * 实现文档级保存（单飞保存流程）：
 * - 单飞约束：同一时间只有一个保存请求在途
 * - 构建保存快照（以 Document 为准，补充 Canonical 元数据）
 * - 保存成功后更新 Canonical 与 baselineDocHash
 * - 保存失败保留 Draft 状态，支持重试
 *
 * 核心设计：
 * - Document 为主：编辑器解析出的章节树是用户编辑的真实状态
 * - Canonical 为辅：仅用于补充未编辑的元数据字段（引用、生成状态等）
 * - 保存后 Document 成为新的 Canonical
 *
 * @see {@link ../../../docs/RPDetail/ContentManagement/data-layer-guide.md | 数据与状态管理 - 保存流程}
 * @see {@link ./README.md | Hooks 架构说明}
 */

import {
  applyIdMapToChapters,
  convertDocumentChaptersToSaveFormat,
  mergeSavedChaptersWithCanonical,
} from '@/domain/chapter';
import { createSaveReport } from '@/domain/report/saveTransport';
import { parseDocumentChapterTree } from '@/domain/reportEditor';
import { useSaveController } from '@/hooks/useSaveController';
import { ReportEditorRef } from '@/types/editor';
import { message } from '@wind/wind-ui';
import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { useReportContentDispatch, useReportContentSelector } from '../hooksRedux';
import { selectCanonicalChapterMap, selectReportId } from '../selectors';
import { selectDocumentDraft } from '../selectors/draftTreeSelectors';
import { rpContentSlice } from '../slice';

export interface UseReportContentPersistenceOptions {
  /** 获取当前编辑器 HTML 内容 */
  getEditorContent: () => string;
  autoSave?: {
    debounceMs?: number;
    minIntervalMs?: number;
  };
  editorRef?: MutableRefObject<ReportEditorRef | null>;
}

export interface ReportContentPersistenceState {
  saving: boolean;
  hasUnsaved: boolean;
  lastSavedAt?: number;
  lastError: string | null;
  saveNow: () => Promise<void>;
  saveImmediately: () => Promise<void>;
  retry: () => Promise<void>;
}

// convertDocumentChaptersToSaveFormat 已移至 @/domain/chapter/merge.ts
// applyIdMapToChapters 已移至 @/domain/chapter/idMapping.ts
// mergeSavedChaptersWithCanonical 已移至 @/domain/chapter/merge.ts
// 使用通用的 domain 层函数，支持递归处理树形结构

export function useReportContentPersistence(
  options: UseReportContentPersistenceOptions
): ReportContentPersistenceState {
  const { getEditorContent, autoSave, editorRef: editorRefRef } = options;
  const dispatch = useReportContentDispatch();
  const reportId = useReportContentSelector(selectReportId);
  const canoicalChapterMap = useReportContentSelector(selectCanonicalChapterMap);
  const documentDraft = useReportContentSelector(selectDocumentDraft);

  const saveReport = useMemo(() => createSaveReport(), []);

  const controller = useSaveController({
    onSavingChange: (saving) => {
      if (saving) {
        dispatch(rpContentSlice.actions.startDocumentSave());
      }
    },
    onError: (errorMessage) => {
      if (errorMessage) {
        message.error(errorMessage);
      }
      dispatch(rpContentSlice.actions.handleSaveError());
    },
    autoSave: {
      debounceMs: autoSave?.debounceMs ?? 2000,
      minIntervalMs: autoSave?.minIntervalMs ?? 4000,
    },
  });

  /**
   * 根据当前编辑器内容构造一次保存所需的快照
   *
   * 核心逻辑：
   * 1. 从 TinyMCE 解析出 Document 章节树（用户编辑的真实状态）
   * 2. 从 Canonical 中提取元数据映射表（引用、生成状态等）
   * 3. 将 Document 章节转换为保存格式，补充 Canonical 元数据
   * 4. 使用 Draft 层的 `lastSyncAt` 记录触发此次保存的编辑时间
   *
   * 设计原则：
   * - 以 Document 为准：编辑器是用户编辑的真实状态
   * - Canonical 为辅：仅用于补充未编辑的元数据字段
   * - 保存后 Document 会成为新的 Canonical
   */
  const buildSnapshot = useCallback(() => {
    if (!reportId) {
      throw new Error('缺少报告 ID，无法保存');
    }

    const editorHtml = getEditorContent();
    if (!editorHtml) {
      throw new Error('编辑器内容为空，无法保存');
    }

    // 1. 解析编辑器 HTML，得到 Document 章节树
    const parsed = parseDocumentChapterTree(editorHtml);
    if (parsed.warnings.length > 0) {
      console.warn('[useReportContentPersistence] Document parse warnings', parsed.warnings);
    }

    // 2. 将 Document 章节转换为保存格式（补充 Canonical 元数据）
    const chaptersToSave = convertDocumentChaptersToSaveFormat(parsed.chapters, canoicalChapterMap);

    // 3. 记录快照时间戳
    const snapshotTimestamp = documentDraft?.lastSyncAt ?? Date.now();

    return { mergedChapters: chaptersToSave, snapshotTimestamp };
  }, [documentDraft?.lastSyncAt, getEditorContent, reportId]);

  const performSave = useCallback(async () => {
    if (!reportId) {
      throw new Error('缺少报告 ID，无法保存');
    }

    const { mergedChapters, snapshotTimestamp } = buildSnapshot();
    // 触发网络请求前构造快照，保证提交与本地检查基于同一份数据。
    const response = await saveReport({
      reportId,
      chapters: mergedChapters,
    });
    if (!response.success) {
      throw new Error(response.error || '保存失败');
    }

    // 保存成功后：
    // 1. 应用 ID 映射（如果有新增章节）
    // 2. 合并保存后的章节与 Canonical 章节（补充元数据）
    // 3. 将合并后的章节树写回 Canonical，成为新的事实来源
    // 4. 通知 Draft Reducer 使用 snapshotTimestamp 判断是否还存在未保存改动
    const idMap = response.idMap && Object.keys(response.idMap).length > 0 ? response.idMap : undefined;

    // 步骤 1：应用 ID 映射（临时 ID → 持久化 ID）
    const chaptersWithRealIds = idMap ? applyIdMapToChapters(mergedChapters, idMap) : mergedChapters;

    // 步骤 2：合并元数据（补充 DPU、RAG、实体等未保存的字段）
    const chaptersForSnapshot = mergeSavedChaptersWithCanonical(chaptersWithRealIds, canoicalChapterMap);

    // 步骤 3：更新编辑器 DOM（如果有 ID 映射）
    if (idMap) {
      editorRefRef?.current?.applyIdMap(idMap);
    }

    // 步骤 4：更新 Canonical 和 Draft 状态
    dispatch(rpContentSlice.actions.applyDocumentSnapshot({ chapters: chaptersForSnapshot }));
    dispatch(rpContentSlice.actions.completeDocumentSave({ snapshotTimestamp }));
  }, [buildSnapshot, dispatch, editorRefRef, reportId, saveReport, canoicalChapterMap]);

  const saveNow = useCallback(async () => {
    await controller.requestManualSave(performSave);
  }, [controller, performSave]);

  const saveImmediately = useCallback(async () => {
    await controller.requestImmediateSave(performSave);
  }, [controller, performSave]);

  const scheduleAutoSave = useCallback(async () => {
    await controller.requestAutoSave(performSave);
  }, [controller, performSave]);

  const lastScheduledRef = useRef<number | null>(null);

  // 当 Draft 层标记为 `unsaved` 且记录了新的同步时间时，尝试进行自动保存。
  // lastSyncAt 由草稿 reducer 维护，代表最近一次编辑信号；
  // 若保存过程中用户继续编辑（lastSyncAt 更新），Reducer 会再次触发本 effect。
  useEffect(() => {
    if (!documentDraft) return;
    if (documentDraft.documentStatus !== 'unsaved') return;
    if (!documentDraft.lastSyncAt) return;
    if (!reportId) return;
    if (controller.saving) return;

    if (lastScheduledRef.current === documentDraft.lastSyncAt) {
      return;
    }

    lastScheduledRef.current = documentDraft.lastSyncAt;
    scheduleAutoSave().catch((error) => {
      console.warn('[useReportContentPersistence] auto save failed:', error);
    });
  }, [controller.saving, documentDraft, reportId, scheduleAutoSave]);

  const retry = useCallback(async () => {
    await saveImmediately();
  }, [saveImmediately]);

  return {
    saving: controller.saving,
    hasUnsaved: controller.hasUnsaved,
    lastSavedAt: controller.lastSavedAt,
    lastError: controller.lastError,
    saveNow,
    saveImmediately,
    retry,
  };
}
