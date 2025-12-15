/**
 * Quick Toolbar 配置模块统一导出
 *
 * 提供 Quick Toolbar 按钮注册和配置的统一接口。
 *
 * @see ../../../../docs/RPDetail/RPEditor/QuickToolbar.md Quick Toolbar 设计文档
 */

// 类型定义
export type { AIMenuItemConfig, AIMenuRegistryOptions, ShortcutConfig } from './types';

// 常量配置
export { AI_MENU_SECTIONS, AI_SHORTCUTS, QUICK_TOOLBAR_BUTTONS } from './constants';

// AI 菜单注册
export { registerAIMenus, registerAIRemoteMenu, registerShortcuts } from './aiMenuRegistry';

// Quick Toolbar 按钮注册
export { registerQuickToolbar, registerQuickToolbarRuntime } from './quickToolbarRegistry';
