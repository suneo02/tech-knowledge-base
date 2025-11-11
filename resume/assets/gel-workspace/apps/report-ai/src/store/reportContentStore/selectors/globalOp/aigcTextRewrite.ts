/**
 * 文本改写 Selectors
 *
 * 从 globalOperation 读取文本改写状态
 * 使用 domain 层的工具函数避免重复逻辑
 *
 * @see apps/report-ai/docs/specs/text-ai-rewrite-implementation/spec-design-v1.md
 */

import { getTextRewritePreviewContent, isTextRewriteCompleted } from '@/domain/chat/rpContentAIMessages';
import { isTextRewriteOp } from '@/domain/globalOperation';
import type { TextRewriteOperationData } from '@/types/editor';
import { createSelector } from '@reduxjs/toolkit';
import { selectParsedRPContentMessages } from '../base';
import { selectGlobalOp } from './base';

/**
 * 是否正在改写
 */
export const selectIsTextRewriting = createSelector(selectGlobalOp, (op) => op.kind === 'text_rewrite');

/**
 * 获取文本改写操作数据
 */
export const selectTextRewriteData = createSelector(selectGlobalOp, (op): TextRewriteOperationData | null => {
  return isTextRewriteOp(op) ? op.data : null;
});

/**
 * 获取选区快照
 */
export const selectTextRewriteSnapshot = createSelector(selectTextRewriteData, (data) => data?.snapshot || null);

/**
 * 获取关联 ID
 */
export const selectTextRewriteCorrelationId = createSelector(
  selectTextRewriteData,
  (data) => data?.correlationId || null
);

/**
 * 获取章节 ID
 */
export const selectTextRewriteChapterId = createSelector(selectTextRewriteData, (data) => data?.chapterId || null);

/**
 * 获取任务类型
 */
export const selectTextRewriteTaskType = createSelector(selectTextRewriteData, (data) => data?.taskType || null);

/**
 * 获取错误信息
 */
export const selectTextRewriteError = createSelector(selectGlobalOp, (op) => {
  return op.kind === 'error' && op.data?.type === 'text_rewrite' ? op.error || null : null;
});

/**
 * 获取开始时间
 */
export const selectTextRewriteStartedAt = createSelector(selectGlobalOp, (op) => {
  return op.kind === 'text_rewrite' ? op.startedAt : null;
});

/**
 * 获取改写是否已完成
 */
export const selectTextRewriteIsCompleted = createSelector(
  [selectGlobalOp, selectParsedRPContentMessages, selectTextRewriteCorrelationId],
  (op, messages, correlationId) => {
    return op.kind === 'text_rewrite' ? isTextRewriteCompleted(messages, correlationId) : false;
  }
);

/**
 * 获取预览内容
 *
 * 使用 domain 层的 getTextRewritePreviewContent 函数来获取最新内容
 */
export const selectTextRewritePreviewContent = createSelector(
  [selectParsedRPContentMessages, selectTextRewriteCorrelationId],
  (messages, correlationId) => {
    return getTextRewritePreviewContent(messages, correlationId);
  }
);
