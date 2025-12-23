// 带章节信息的引用数据类型
export type { DPUItemWithChapters, RAGItemWithChapters } from './type';

// 导出引用资料处理工具函数
export { buildSortedReferencesFromChapters } from './referenceProcessor';

// 导出引用资料工具函数
export { getFileReferenceId, getReferenceIdentifier } from './referenceUtils';

// 导出类型安全的引用资料映射表
export { ReferenceMap } from './ReferenceMap';

export type { RPReferenceItem, RPReferenceType } from './type';
