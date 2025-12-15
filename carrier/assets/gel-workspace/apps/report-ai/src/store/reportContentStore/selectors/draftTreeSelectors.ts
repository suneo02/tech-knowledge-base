/**
 * Draft Tree Selectors
 *
 * @description 用于查询草稿树的 Redux selectors
 * @note 使用树结构存储，与 Canonical 对齐
 */

import { createSelector } from '@reduxjs/toolkit';
import { ReportContentState } from '../types';

import { DocumentDraftState } from '@/types';

/**
 * 选择文档草稿状态
 */
export const selectDocumentDraft = (state: { reportContent: ReportContentState }): DocumentDraftState | null =>
  state.reportContent.documentDraft;

/**
 * 选择草稿树
 */
export const selectDraftTree = createSelector([selectDocumentDraft], (documentDraft) => documentDraft?.draftTree || []);

/**
 * 检查是否有草稿状态
 */
export const selectHasDraftState = createSelector([selectDocumentDraft], (documentDraft) => documentDraft !== null);

/**
 * 检查是否有未保存的变更
 */
export const selectHasDirtyChanges = createSelector([selectDraftTree], (draftTree) => draftTree.length > 0);

/**
 * 选择文档状态
 */
export const selectDocumentStatus = createSelector(
  [selectDocumentDraft],
  (documentDraft) => documentDraft?.documentStatus || 'saved'
);

/**
 * 检查是否正在保存
 */
export const selectIsSaving = createSelector([selectDocumentStatus], (status) => status === 'saving');

/**
 * 检查是否应该清空草稿状态
 */
export const selectShouldClearDraftState = createSelector([selectDraftTree], (draftTree) => draftTree.length > 0);

/**
 * 选择文档状态摘要
 */
export const selectDocumentStatusSummary = createSelector(
  [selectDocumentDraft, selectHasDirtyChanges, selectDocumentStatus],
  (documentDraft, hasDirty, status) => ({
    hasDocumentDraft: !!documentDraft,
    hasDirtyChanges: hasDirty,
    documentStatus: status,
    canSave: hasDirty && status !== 'saving',
    canClear: !hasDirty,
  })
);
