/**
 * Quick Toolbar 按钮注册模块
 *
 * 负责注册 Quick Toolbar 的标题样式按钮（H1/H2/H3）。
 *
 * @see ../../../../docs/RPDetail/RPEditor/QuickToolbar.md Quick Toolbar 设计文档
 */

import { EditorFacade } from '@/domain/reportEditor';

/**
 * 注册标题样式按钮
 *
 * 为 Quick Toolbar 注册 H1/H2/H3 标题按钮，支持状态高亮。
 *
 * 技术实现：
 * - 使用 `addToggleMenuItem` 注册切换按钮
 * - 通过 `onSetup` 监听 NodeChange 事件，实时更新按钮状态
 * - 当光标在对应标题元素时，按钮显示为激活状态
 *
 * @param facade - 编辑器门面实例
 *
 * @example
 * ```ts
 * registerHeadingButtons(facade);
 * // Quick Toolbar 中显示 H1/H2/H3 按钮
 * ```
 */
const registerHeadingButtons = (facade: EditorFacade): void => {
  // 注册 H1 切换按钮（带选中状态）
  facade.addToggleMenuItem('h1', {
    text: '标题 1',
    icon: 'h1',
    onAction: () => {
      facade.execCommand('FormatBlock', false, 'h1');
    },
    onSetup: (api) => {
      const updateState = () => {
        const formatName = facade.isFormatActive('h1');
        api.setActive(formatName);
      };
      updateState();
      const handler = () => updateState();
      facade.on('NodeChange', handler);
      return () => facade.off('NodeChange', handler);
    },
  });

  // 注册 H2 切换按钮（带选中状态）
  facade.addToggleMenuItem('h2', {
    text: '标题 2',
    icon: 'h2',
    onAction: () => {
      facade.execCommand('FormatBlock', false, 'h2');
    },
    onSetup: (api) => {
      const updateState = () => {
        const formatName = facade.isFormatActive('h2');
        api.setActive(formatName);
      };
      updateState();
      const handler = () => updateState();
      facade.on('NodeChange', handler);
      return () => facade.off('NodeChange', handler);
    },
  });

  // 注册 H3 切换按钮（带选中状态）
  facade.addToggleMenuItem('h3', {
    text: '标题 3',
    icon: 'h3',
    onAction: () => {
      facade.execCommand('FormatBlock', false, 'h3');
    },
    onSetup: (api) => {
      const updateState = () => {
        const formatName = facade.isFormatActive('h3');
        api.setActive(formatName);
      };
      updateState();
      const handler = () => updateState();
      facade.on('NodeChange', handler);
      return () => facade.off('NodeChange', handler);
    },
  });
};

/**
 * 注册 Quick Toolbar 按钮（setup 阶段）
 *
 * 在编辑器 setup 阶段调用，无需 facade。
 * 实际按钮注册在 registerQuickToolbarRuntime 中完成。
 */
export const registerQuickToolbar = (): void => {
  // 标题按钮需要在运行时绑定，因为需要 facade
  // 这里只是占位，实际注册在 registerQuickToolbarRuntime 中
};

/**
 * 注册 Quick Toolbar 运行时行为
 *
 * 在编辑器初始化后调用，注册所有 Quick Toolbar 按钮。
 *
 * @param facade - 编辑器门面实例
 *
 * @example
 * ```ts
 * registerQuickToolbarRuntime(facade);
 * ```
 */
export const registerQuickToolbarRuntime = (facade: EditorFacade): void => {
  // 注册标题按钮
  registerHeadingButtons(facade);
};
