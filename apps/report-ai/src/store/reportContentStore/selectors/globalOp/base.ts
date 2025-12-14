/**
 * GlobalOperation 选择器
 *
 * 统一读取全局互斥操作的状态
 * 使用 domain 层的工具函数避免重复逻辑
 */

import { isChapterAIGCOp, isGlobalBusy, shouldEditorBeReadonly } from '@/domain/globalOperation';
import { createSelector } from '@reduxjs/toolkit';
import { selectReportContent } from '../base';

// ==================== 基础选择器 ====================

/**
 * 选择整个 GlobalOperation 状态
 */
export const selectGlobalOp = createSelector(selectReportContent, (state) => state.globalOp);

/**
 * 选择当前操作类型
 */
export const selectGlobalOperationKind = createSelector(selectGlobalOp, (op) => op.kind);

// ==================== 派生选择器 ====================

/**
 * 是否处于全局忙碌状态（排除 idle/error）
 */
export const selectIsGlobalBusy = createSelector(selectGlobalOperationKind, isGlobalBusy);

/**
 * 是否服务器加载中
 */
export const selectIsServerLoading = createSelector(selectGlobalOperationKind, (kind) => kind === 'server_loading');

/**
 * 是否在任意 AIGC 生成操作中（全文/多章节/单章节）
 */
export const selectIsChapterAIGCOp = createSelector(selectGlobalOp, isChapterAIGCOp);

/**
 * 是否为全文生成操作
 */
export const selectIsFullDocGen = createSelector(selectGlobalOperationKind, (kind) => kind === 'full_generation');

/**
 * 编辑器是否应处于只读状态
 */
export const selectShouldEditorBeReadonly = createSelector(selectGlobalOperationKind, shouldEditorBeReadonly);
