// 从独立文件导出类型，避免循环引用
export type { ApplyIdMapResult, ReportEditorRef } from './editor-ref-types';

export type { AIActionData, AIInvokeFunction, AITaskType, TextRewriteOperationData } from './ai-action-types';

export type { SelectionContent, SelectionSnapshot, SerializedBookmark } from './selection-types';
export { type ChapterGenerationStatus } from './state';
