/**
 * Draft Tree Reducers
 *
 * @description 管理草稿树状态的 Redux reducers
 * @note 使用树结构存储，与 Canonical 对齐
 */

import { convertDocumentChaptersToDraft } from '@/domain/chapter';
import { DocumentChapterNode } from '@/domain/reportEditor';
import { PayloadAction } from '@reduxjs/toolkit';
import { ReportContentState } from '../types';

/**
 * 导出所有 reducers
 */
export const draftTreeReducers = {
  /**
   * 处理编辑器内容变更
   *
   * @description 基于编辑器内容创建/更新 Draft 状态
   */
  handleEditorContentChange: (
    state: ReportContentState,
    action: PayloadAction<{
      currentDocHash: string;
      timestamp: number;
      chapterTree?: DocumentChapterNode[];
    }>
  ) => {
    const { timestamp, chapterTree } = action.payload;

    if (!chapterTree) return;
    // 如果没有草稿状态，创建一个
    if (!state.documentDraft) {
      state.documentDraft = {
        draftTree: [],
        documentStatus: 'unsaved',
      };
    }

    // 更新最后同步时间
    state.documentDraft.lastSyncAt = timestamp;

    // 如果检测到章节变更，更新草稿树
    if (chapterTree && chapterTree.length > 0) {
      state.documentDraft.draftTree = convertDocumentChaptersToDraft(chapterTree);
    }

    // 设置为未保存状态
    state.documentDraft.documentStatus = 'unsaved';
  },

  /**
   * 保存开始
   *
   * 标记当前文档进入保存中状态。
   */
  startDocumentSave: (state: ReportContentState) => {
    if (!state.documentDraft) {
      state.documentDraft = {
        draftTree: [],
        documentStatus: 'saving',
      };
      return;
    }

    state.documentDraft.documentStatus = 'saving';
  },

  /**
   * 保存成功
   *
   * @description 请求完成后将服务器确认的内容写回 Canonical；
   * Draft 层根据 `snapshotTimestamp` 与 `lastSyncAt` 做竞态判断：
   *   - 若保存时刻之后没有新的编辑（`lastSyncAt <= snapshotTimestamp`），说明所有改动已持久化，可清空草稿；
   *   - 若期间出现新的编辑（`lastSyncAt > snapshotTimestamp`），继续保持 `unsaved` 以等待下一轮保存。
   */
  completeDocumentSave: (state: ReportContentState, action: PayloadAction<{ snapshotTimestamp: number }>) => {
    const { snapshotTimestamp } = action.payload;
    if (!state.documentDraft) {
      return;
    }

    const latestSync = state.documentDraft.lastSyncAt ?? 0;
    if (latestSync > snapshotTimestamp) {
      // 新的编辑出现在保存快照之后，仍需保持未保存状态。
      state.documentDraft.documentStatus = 'unsaved';
      return;
    }

    state.documentDraft = null;
  },

  /**
   * 处理保存错误
   */
  handleSaveError: (state: ReportContentState) => {
    if (state.documentDraft) {
      state.documentDraft.documentStatus = 'error';
      // 可以在这里添加错误信息到状态中
    }
  },
};
