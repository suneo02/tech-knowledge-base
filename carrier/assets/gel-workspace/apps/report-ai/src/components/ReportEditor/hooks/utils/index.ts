/**
 * 编辑器 DOM 工具统一导出
 *
 * @description 提供编辑器相关的所有 DOM 操作、位置计算、容器管理等工具函数
 *
 * @note 设计原则：
 * 1. 优先复用 @/domain/reportEditor 中的工具方法（EditorFacade、foundation 等）
 * 2. 本层专注于 UI 相关的 DOM 操作（位置计算、容器管理、iframe 处理等）
 * 3. 避免重复实现 domain 层已有的功能
 *
 * @see {@link ../../../../domain/reportEditor/README.md} - domain 层文档
 * @see {@link ./DOMAIN_INTEGRATION.md} - domain 层集成指南
 */

// 基础 DOM 操作工具
export * from './editorDomUtils';

// 位置计算工具
export * from './positionCalculator';

// 通用工具
export * from './chapterLeafUtils';
export * from './externalComponentConfig';
export * from './externalComponentRenderer';
export * from './rafThrottle';
export * from './reactInstanceManager';

// 业务特定工具（保持向后兼容）
export * from './aigcButtonDomUtils';
export * from './chapterHoverDomUtils';
