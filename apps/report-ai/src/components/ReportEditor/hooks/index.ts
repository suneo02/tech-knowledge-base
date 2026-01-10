/**
 * 报告编辑器 Hooks 统一导出
 *
 * @description 提供报告编辑器相关的所有自定义 Hooks
 * @since 1.0.0
 */

// ===== Hooks 导出 =====
export { useExternalComponentRenderer } from './useExternalComponentRenderer';
export { useReportEditorRef } from './useReportEditorRef';
export { useTextRewritePreview } from './useTextRewritePreview/hook';

// ===== 工具函数导出 =====
export { getChapterBottomPosition, getEditorFrameOffset } from './chapterPositionUtils';

// ===== 类型定义导出 =====
export type { ChapterBottomPosition } from './chapterPositionUtils';
export type { UseExternalComponentRendererOptions } from './useExternalComponentRenderer';
export type { UseReportEditorRefReturn } from './useReportEditorRef';
