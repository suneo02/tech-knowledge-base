/**
 * 大纲编辑器 Hooks 统一导出
 *
 * @description 基于 Context 的 Hook 架构
 * - useOutline: 主 Hook，推荐使用，提供完整功能，需要在 OutlineStoreProvider 内使用
 * - useThoughtGeneration: AI 思路生成，专注核心业务逻辑
 * - useOutlineKeyboard: 键盘交互，快捷键处理
 *
 * 注意：导航状态管理已直接集成到 context 中，通过 selector 直接访问
 */

// ===== 主 Hook (推荐使用) =====
export { useOutlineOperations } from './useOutline';

// ===== 核心功能 Hooks =====
export { useThoughtGeneration } from './useThoughtGeneration';

// ===== 辅助功能 Hooks =====
// useOutlineKeyboard 已移除，键盘事件处理已集成到 useOutlineItemHeaderKeyboard 中

// ===== 组件专用 Hooks =====
export { useOutlineItemHeaderKeyboard } from './useOutlineItemHeaderKeyboard';
export { useOutlineItemHeaderState } from './useOutlineItemHeaderState';
