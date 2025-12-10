/**
 * 编辑器内容管理工具函数
 *
 * 提供 TinyMCE 编辑器内容操作的静态函数，支持：
 * 1. 章节级别的精确内容更新
 * 2. 全量内容设置
 * 3. 流式内容更新（增量更新）
 * 4. 事务管理（撤销/重做支持）
 * 5. 性能监控
 */

export { SectionDeduper } from '../chapter/sectionDiff';

export type { ChapterContentUpdateResult, EditorContentUpdateOptions } from './types';

// 内容清洗工具 - 移除外部渲染节点（用于保存/导出）
export { getCleanContentForExport, removeExternalRenderingNodes } from './contentSanitizer';

// Editor Facade - 统一的 editor 实例访问接口
export { createEditorFacade, EditorFacade } from './editorFacade';
export type { EditorFacadeConfig, EditorFacadeSource, EditorOperationLog, EditorOperationType } from './editorFacade';
