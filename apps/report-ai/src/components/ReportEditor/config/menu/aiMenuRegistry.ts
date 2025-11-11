/**
 * AI 菜单注册模块
 *
 * 负责注册 AI 改写功能的菜单按钮和快捷键，用于 Quick Toolbar。
 *
 * 核心功能：
 * - 注册 AI 改写菜单按钮（MenuButton），显示在 Quick Toolbar
 * - 注册 AI 功能快捷键（Ctrl+1~7）
 * - 处理选区校验和 AI 操作回调
 *
 * 技术实现：
 * - 使用 TinyMCE 的 `addMenuButton` API 注册带下拉菜单的按钮
 * - 使用 `fetch` 回调动态生成菜单项，支持分组和分隔符
 * - 通过 EditorFacade 统一访问编辑器 API
 *
 * @see ../../../../docs/RPDetail/RPEditor/QuickToolbar.md Quick Toolbar 设计文档
 * @see ./constants.ts AI_MENU_SECTIONS 菜单配置
 * @see ./types.ts AIMenuRegistryOptions 注册选项类型
 */

import { AI_TASK_DISPLAY_NAMES } from '@/domain/chat';
import { EditorFacade, getSelectionChapterId, getSelectionSnapshot } from '@/domain/reportEditor';
import { REPORT_SVG_ICON_MAP } from '../svgUtils';
import { AI_MENU_SECTIONS, AI_SHORTCUTS } from './constants';
import type { AIMenuItemConfig, AIMenuRegistryOptions } from './types';

/**
 * 注册 AI 功能图标
 *
 * 将所有 AI 功能的 SVG 图标注册到 TinyMCE，供菜单按钮使用。
 *
 * @param facade - 编辑器门面实例
 *
 * @example
 * ```ts
 * registerIcons(facade);
 * // 注册后可在菜单中使用：icon: 'ai-polish'
 * ```
 */
const registerIcons = (facade: EditorFacade): void => {
  Object.entries(REPORT_SVG_ICON_MAP).forEach(([name, svg]) => {
    facade.addIcon(name, svg);
  });
};

/**
 * 处理 AI 操作
 *
 * 统一处理 AI 菜单项的点击事件，包括选区校验、数据解析和回调触发。
 *
 * 处理流程：
 * 1. 校验选区：如果菜单项需要选区，检查是否有选中文本
 * 2. 解析选区：获取选区快照和章节 ID
 * 3. 触发回调：将解析后的数据传递给外部回调
 *
 * @param facade - 编辑器门面实例
 * @param item - AI 菜单项配置
 * @param options - 注册选项，包含 onAIAction 回调
 *
 * @example
 * ```ts
 * handleAIAction(facade, {
 *   name: 'ai_polish',
 *   action: 'polish',
 *   requiresSelection: true,
 *   warning: '请先选中需要完善表达的文本'
 * }, options);
 * ```
 */
const handleAIAction = (facade: EditorFacade, item: AIMenuItemConfig, options: AIMenuRegistryOptions): void => {
  // 1. 校验选区（如果需要）
  if (item.requiresSelection) {
    const text = facade.getSelectedContent({ format: 'text' });
    if (!text.trim()) {
      facade.showNotification({
        text: item.warning || '请先选中文本',
        type: 'warning',
        timeout: 3000,
      });
      return;
    }
  }

  // 2. 解析选区数据
  const snapshot = getSelectionSnapshot(facade);
  if (!snapshot) {
    facade.showNotification({
      text: '无法获取选区信息，请重新选择文本',
      type: 'warning',
      timeout: 3000,
    });
    return;
  }

  const chapterId = getSelectionChapterId(facade);

  // 3. 触发外部回调
  options.onAIAction({
    actionType: item.action,
    snapshot,
    chapterId,
  });
};

/**
 * 注册 AI 改写菜单按钮
 *
 * 在 Quick Toolbar 中注册 "AI 改写" 菜单按钮，点击后展开下拉菜单。
 *
 * 菜单结构：
 * - 文本优化：润色、翻译
 * - 内容控制：缩写、扩写、续写
 * - 内容分析：摘要、关键点
 *
 * 技术实现：
 * - 使用 `addMenuButton` 注册菜单按钮（Quick Toolbar 专用）
 * - 使用 `fetch` 回调动态生成菜单项，支持分组标题和分隔符
 * - 每个菜单项的 `onAction` 直接调用 `handleAIAction`
 *
 * @param options - 注册选项，包含 facade 和 onAIAction 回调
 *
 * @see https://www.tiny.cloud/docs/tinymce/latest/custom-toolbarbuttons/#menubutton MenuButton 官方文档
 *
 * @example
 * ```ts
 * registerAIRemoteMenu({
 *   facade: editorFacade,
 *   onAIAction: (data) => {
 *     console.log('AI 操作:', data.actionType);
 *   }
 * });
 * ```
 */
export const registerAIRemoteMenu = (options: AIMenuRegistryOptions): void => {
  const { facade } = options;

  // 注册 AI 图标
  registerIcons(facade);

  // 注册 MenuButton 用于 Quick Toolbar
  facade.addMenuButton('ai_rewrite_menu', {
    text: 'AI 改写',
    icon: 'ai-polish',
    fetch: (callback) => {
      // 动态生成菜单项：分组标题 + 菜单项 + 分隔符
      const items = AI_MENU_SECTIONS.flatMap((section) => [
        // 分组标题（禁用状态，仅作为标签）
        {
          type: 'menuitem' as const,
          text: section.label,
          enabled: false,
        },
        // 分组内的菜单项
        ...section.items.map((item) => ({
          type: 'menuitem' as const,
          text: item.text,
          icon: item.icon,
          onAction: () => handleAIAction(facade, item, options),
        })),
        // 分组分隔符
        { type: 'separator' as const },
      ]);

      // 移除最后一个多余的分隔符
      const normalized = [...items];
      const last = normalized[normalized.length - 1];
      if (last && typeof last === 'object' && (last as { type: string }).type === 'separator') {
        normalized.pop();
      }

      // 通过回调返回菜单项
      callback(normalized);
    },
  });
};

/**
 * 注册 AI 菜单（主入口）
 *
 * 统一的 AI 菜单注册入口，负责注册所有 AI 相关的菜单按钮。
 * 当前只注册 AI 改写菜单按钮，后续可扩展其他 AI 功能按钮。
 *
 * @param options - 注册选项，包含 facade 和 onAIAction 回调
 *
 * @example
 * ```ts
 * registerAIMenus({
 *   facade: editorFacade,
 *   onAIAction: handleAIAction
 * });
 * ```
 */
export const registerAIMenus = (options: AIMenuRegistryOptions): void => {
  registerAIRemoteMenu(options);
};

/**
 * 注册 AI 快捷键
 *
 * 为所有 AI 功能注册键盘快捷键（Ctrl+1~7），提供快速访问入口。
 *
 * 快捷键映射：
 * - Ctrl+1: 润色
 * - Ctrl+2: 翻译
 * - Ctrl+3: 扩写
 * - Ctrl+4: 缩写
 * - Ctrl+5: 续写
 * - Ctrl+6: 摘要
 * - Ctrl+7: 关键点
 *
 * 处理流程：
 * 1. 校验选区（如果需要）
 * 2. 解析选区数据
 * 3. 触发 AI 操作回调
 *
 * @param options - 注册选项，包含 facade 和 onAIAction 回调
 *
 * @see ./constants.ts AI_SHORTCUTS 快捷键配置
 *
 * @example
 * ```ts
 * registerShortcuts({
 *   facade: editorFacade,
 *   onAIAction: handleAIAction
 * });
 * // 用户按 Ctrl+1 触发润色功能
 * ```
 */
export const registerShortcuts = (options: AIMenuRegistryOptions): void => {
  const { facade } = options;

  AI_SHORTCUTS.forEach((shortcut) => {
    const displayName = AI_TASK_DISPLAY_NAMES[shortcut.action];
    const menuItem = AI_MENU_SECTIONS.flatMap((s) => s.items).find((item) => item.action === shortcut.action);

    facade.addShortcut(shortcut.key, displayName, () => {
      // 1. 校验选区（如果需要）
      if (shortcut.requiresSelection) {
        const text = facade.getSelectedContent({ format: 'text' });
        if (!text.trim()) {
          facade.showNotification({
            text: menuItem?.warning || `请先选中需要${displayName}的文本`,
            type: 'warning',
            timeout: 3000,
          });
          return;
        }
      }

      // 2. 解析选区数据
      const snapshot = getSelectionSnapshot(facade);
      if (!snapshot) {
        facade.showNotification({
          text: '无法获取选区信息，请重新选择文本',
          type: 'warning',
          timeout: 3000,
        });
        return;
      }

      const chapterId = getSelectionChapterId(facade);

      // 3. 触发外部回调
      options.onAIAction({
        actionType: shortcut.action,
        snapshot,
        chapterId,
      });
    });
  });
};
