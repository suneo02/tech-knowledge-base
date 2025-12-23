/**
 * TinyMCE Editor Facade
 *
 * 职责：
 * - 包装所有 TinyMCE editor 实例的访问
 * - 提供统一的调试和追踪能力
 * - 不包含业务逻辑，仅作为访问代理
 *
 * 使用场景：
 * - 开发环境下监控 editor 操作
 * - 统一的错误处理和日志记录
 * - 方便后续调试和性能分析
 */

import type { Editor as TinyMCEEditor } from 'tinymce';

/** 对外暴露的原始编辑器类型别名（仅用于 Facade 绑定） */
export type EditorFacadeSource = TinyMCEEditor;

/**
 * Editor Facade 配置
 */
export interface EditorFacadeConfig {
  /** 是否启用调试日志 */
  enableDebugLog?: boolean;
  /** 是否启用性能追踪 */
  enablePerformanceTracking?: boolean;
  /** 自定义日志前缀 */
  logPrefix?: string;
}

/**
 * Editor 操作类型
 */
export type EditorOperationType =
  | 'dom.query'
  | 'dom.select'
  | 'dom.create'
  | 'dom.add'
  | 'dom.remove'
  | 'dom.get'
  | 'dom.setHTML'
  | 'content.get'
  | 'content.set'
  | 'body.get'
  | 'event.on'
  | 'event.off'
  | 'mode.set'
  | 'selection.get'
  | 'selection.set'
  | 'state.check'
  | 'other';

/**
 * Editor 操作日志
 */
export interface EditorOperationLog {
  /** 操作类型 */
  type: EditorOperationType;
  /** 操作描述 */
  description: string;
  /** 时间戳 */
  timestamp: number;
  /** 额外数据 */
  data?: Record<string, unknown>;
}

/**
 * TinyMCE Editor Facade
 *
 * 提供统一的 editor 实例访问接口，支持调试和追踪
 */
export class EditorFacade {
  private editor: TinyMCEEditor;
  private config: Required<EditorFacadeConfig>;
  private operationLogs: EditorOperationLog[] = [];

  constructor(editor: TinyMCEEditor, config: EditorFacadeConfig = {}) {
    this.editor = editor;
    this.config = {
      enableDebugLog: config.enableDebugLog ?? false,
      enablePerformanceTracking: config.enablePerformanceTracking ?? false,
      logPrefix: config.logPrefix ?? '[EditorFacade]',
    };
  }

  /**
   * DOM 操作 - querySelector
   */
  querySelector(selector: string): Element | null {
    return this.trackOperation('dom.query', `querySelector: ${selector}`, () => {
      return this.editor.dom.doc.querySelector(selector);
    });
  }

  /**
   * DOM 操作 - select (返回数组)
   */
  select(...args: Parameters<TinyMCEEditor['dom']['select']>): ReturnType<TinyMCEEditor['dom']['select']> {
    return this.trackOperation('dom.select', `select: ${args[0]}`, () => {
      return this.editor.dom.select(...args);
    });
  }

  /**
   * DOM 操作 - create element
   */
  createElement<K extends keyof HTMLElementTagNameMap>(
    ...args: Parameters<TinyMCEEditor['dom']['create']>
  ): ReturnType<TinyMCEEditor['dom']['create']> {
    return this.trackOperation('dom.create', `createElement: ${args[0]}`, () => {
      return this.editor.dom.create(...args);
    });
  }

  /**
   * DOM 操作 - setHTML
   */
  setHTML(...args: Parameters<TinyMCEEditor['dom']['setHTML']>): ReturnType<TinyMCEEditor['dom']['setHTML']> {
    this.trackOperation('dom.setHTML', 'setHTML', () => {
      this.editor.dom.setHTML(...args);
    });
  }

  /**
   * 获取编辑器 DOM 文档
   */
  getDocument(): TinyMCEEditor['dom']['doc'] {
    this.log('state.check', 'getDocument');
    return this.editor.dom.doc;
  }

  /**
   * 获取编辑器 body 元素
   */
  getBody(...args: Parameters<TinyMCEEditor['getBody']>): ReturnType<TinyMCEEditor['getBody']> {
    return this.trackOperation('body.get', 'getBody', () => {
      return this.editor.getBody(...args);
    });
  }

  /**
   * 获取编辑器内容
   */
  getContent(...args: Parameters<TinyMCEEditor['getContent']>): ReturnType<TinyMCEEditor['getContent']> {
    return this.trackOperation('content.get', 'getContent', () => {
      return this.editor.getContent(...args);
    });
  }

  /**
   * 设置编辑器内容
   */
  setContent(...args: Parameters<TinyMCEEditor['setContent']>): ReturnType<TinyMCEEditor['setContent']> {
    return this.trackOperation('content.set', 'setContent', () => {
      return this.editor.setContent(...args);
    });
  }

  /**
   * 切换编辑器模式
   */
  setMode(
    ...args: Parameters<NonNullable<TinyMCEEditor['mode']>['set']>
  ): ReturnType<NonNullable<TinyMCEEditor['mode']>['set']> {
    return this.trackOperation('mode.set', `setMode: ${args[0]}`, () => {
      return this.editor.mode?.set(...args);
    });
  }

  /**
   * 获取当前编辑器模式
   */
  getMode(
    ...args: Parameters<NonNullable<TinyMCEEditor['mode']>['get']>
  ): ReturnType<NonNullable<TinyMCEEditor['mode']>['get']> {
    return this.trackOperation('state.check', 'getMode', () => {
      return this.editor.mode?.get(...args);
    });
  }

  /**
   * 检查编辑器是否已销毁
   */
  isDestroyed(): TinyMCEEditor['destroyed'] {
    this.log('state.check', 'isDestroyed');
    return this.editor.destroyed;
  }

  /**
   * 检查编辑器是否就绪
   */
  isReady(): boolean {
    this.log('state.check', 'isReady');
    return Boolean(this.editor && this.editor.dom && this.editor.dom.doc && !this.editor.destroyed);
  }

  /**
   * 触发编辑器事件
   */
  fire(...args: Parameters<TinyMCEEditor['fire']>): ReturnType<TinyMCEEditor['fire']> {
    this.log('other', `fire event: ${args[0]}`, { args });
    return this.editor.fire(...args);
  }

  /**
   * 在事务中执行操作（支持撤销/重做）
   */
  transact(
    ...args: Parameters<TinyMCEEditor['undoManager']['transact']>
  ): ReturnType<TinyMCEEditor['undoManager']['transact']> {
    return this.trackOperation('other', 'transact', () => {
      return this.editor.undoManager.transact(...args);
    });
  }

  /**
   * 在不记录撤销记录的情况下执行操作
   */
  ignore<T>(callback: () => T): T {
    return this.trackOperation('other', 'undoManager.ignore', () => {
      let callbackResult: T | undefined;
      this.editor.undoManager.ignore(() => {
        callbackResult = callback();
      });
      return callbackResult as T;
    });
  }

  /**
   * 执行编辑器命令
   */
  execCommand(...args: Parameters<TinyMCEEditor['execCommand']>): ReturnType<TinyMCEEditor['execCommand']> {
    this.log('other', `execCommand: ${args[0]}`, { args });
    return this.editor.execCommand(...args);
  }

  /**
   * 插入内容
   */
  insertContent(...args: Parameters<TinyMCEEditor['insertContent']>): ReturnType<TinyMCEEditor['insertContent']> {
    this.log('content.set', 'insertContent');
    return this.editor.insertContent(...args);
  }

  /**
   * 获取选中内容
   */
  getSelectedContent(
    ...args: Parameters<TinyMCEEditor['selection']['getContent']>
  ): ReturnType<TinyMCEEditor['selection']['getContent']> {
    return this.trackOperation('content.get', 'getSelectedContent', () => {
      return this.editor.selection.getContent(...args);
    });
  }

  /**
   * 获取当前选区的锚定节点
   */
  getSelectionNode(
    ...args: Parameters<TinyMCEEditor['selection']['getNode']>
  ): ReturnType<TinyMCEEditor['selection']['getNode']> {
    return this.trackOperation('selection.get', 'getSelectionNode', () => {
      return this.editor.selection.getNode(...args);
    });
  }

  /**
   * 设置选中内容
   */
  setSelectedContent(
    ...args: Parameters<TinyMCEEditor['selection']['setContent']>
  ): ReturnType<TinyMCEEditor['selection']['setContent']> {
    this.log('content.set', 'setSelectedContent');
    return this.editor.selection.setContent(...args);
  }

  /**
   * 获取选区书签
   *
   * 用于保存选区位置，以便后续恢复
   *
   * @param type - 书签类型（2 表示使用 ID 书签）
   * @param normalized - 是否规范化书签
   * @returns 书签对象
   */
  getSelectionBookmark(
    ...args: Parameters<TinyMCEEditor['selection']['getBookmark']>
  ): ReturnType<TinyMCEEditor['selection']['getBookmark']> {
    return this.trackOperation('selection.get', 'getSelectionBookmark', () => {
      return this.editor.selection.getBookmark(...args);
    });
  }

  /**
   * 恢复选区书签
   *
   * 从之前保存的书签恢复选区位置
   *
   * @param bookmark - 书签对象
   */
  moveToBookmark(
    ...args: Parameters<TinyMCEEditor['selection']['moveToBookmark']>
  ): ReturnType<TinyMCEEditor['selection']['moveToBookmark']> {
    this.log('selection.set', 'moveToBookmark');
    this.editor.selection.moveToBookmark(...args);
  }

  /**
   * 获取当前选区
   *
   * 返回当前编辑器的选区对象，用于位置计算等操作
   *
   * @returns Selection 对象，如果无法获取则返回 null
   */
  getSelection(): Selection | null {
    return this.trackOperation('selection.get', 'getSelection', () => {
      try {
        const document = this.getDocument();
        return document?.defaultView?.getSelection() || null;
      } catch (error) {
        console.error('[EditorFacade] Error getting selection:', error);
        return null;
      }
    });
  }

  /**
   * 通过 ID 查找节点
   */
  getElementById(...args: Parameters<TinyMCEEditor['dom']['get']>): ReturnType<TinyMCEEditor['dom']['get']> {
    return this.trackOperation('dom.get', `getElementById: ${args[0]}`, () => {
      return this.editor.dom.get(...args);
    });
  }

  /**
   * 在容器内追加节点
   */
  appendElement(...args: Parameters<TinyMCEEditor['dom']['add']>): ReturnType<TinyMCEEditor['dom']['add']> {
    return this.trackOperation('dom.add', `appendElement: <${args[1]}>`, () => {
      return this.editor.dom.add(...args);
    });
  }

  /**
   * 移除节点
   */
  removeElement(...args: Parameters<TinyMCEEditor['dom']['remove']>): ReturnType<TinyMCEEditor['dom']['remove']> {
    return this.trackOperation('dom.remove', 'removeElement', () => {
      return this.editor.dom.remove(...args);
    });
  }

  /**
   * 绑定事件
   */
  on(...args: Parameters<TinyMCEEditor['on']>): ReturnType<TinyMCEEditor['on']> {
    return this.trackOperation('event.on', `on:${args[0]}`, () => {
      return this.editor.on(...args);
    });
  }

  /**
   * 解绑事件
   */
  off(...args: Parameters<TinyMCEEditor['off']>): ReturnType<TinyMCEEditor['off']> {
    return this.trackOperation('event.off', `off:${args[0]}`, () => {
      return this.editor.off(...args);
    });
  }

  /**
   * 聚焦编辑器
   */
  focus(...args: Parameters<TinyMCEEditor['focus']>): ReturnType<TinyMCEEditor['focus']> {
    this.log('other', 'focus');
    return this.editor.focus(...args);
  }

  /**
   * 检查编辑器是否聚焦
   */
  hasFocus(...args: Parameters<TinyMCEEditor['hasFocus']>): ReturnType<TinyMCEEditor['hasFocus']> {
    this.log('state.check', 'hasFocus');
    return this.editor.hasFocus(...args);
  }

  /**
   * 撤销
   */
  undo(...args: Parameters<TinyMCEEditor['undoManager']['undo']>): ReturnType<TinyMCEEditor['undoManager']['undo']> {
    this.log('other', 'undo');
    return this.editor.undoManager.undo(...args);
  }

  /**
   * 重做
   */
  redo(...args: Parameters<TinyMCEEditor['undoManager']['redo']>): ReturnType<TinyMCEEditor['undoManager']['redo']> {
    this.log('other', 'redo');
    return this.editor.undoManager.redo(...args);
  }

  /**
   * 检查是否可以撤销
   */
  hasUndo(
    ...args: Parameters<TinyMCEEditor['undoManager']['hasUndo']>
  ): ReturnType<TinyMCEEditor['undoManager']['hasUndo']> {
    this.log('state.check', 'hasUndo');
    return this.editor.undoManager.hasUndo(...args);
  }

  /**
   * 检查是否可以重做
   */
  hasRedo(
    ...args: Parameters<TinyMCEEditor['undoManager']['hasRedo']>
  ): ReturnType<TinyMCEEditor['undoManager']['hasRedo']> {
    this.log('state.check', 'hasRedo');
    return this.editor.undoManager.hasRedo(...args);
  }

  /**
   * 显示通知消息
   */
  showNotification(
    ...args: Parameters<TinyMCEEditor['notificationManager']['open']>
  ): ReturnType<TinyMCEEditor['notificationManager']['open']> {
    this.log('other', 'showNotification', { args });
    return this.editor.notificationManager.open(...args);
  }

  /**
   * 检查格式是否匹配
   */
  isFormatActive(
    ...args: Parameters<TinyMCEEditor['formatter']['match']>
  ): ReturnType<TinyMCEEditor['formatter']['match']> {
    this.log('state.check', `isFormatActive: ${args[0]}`);
    return this.editor.formatter.match(...args);
  }

  /**
   * 注册快捷键
   */
  addShortcut(...args: Parameters<TinyMCEEditor['addShortcut']>): ReturnType<TinyMCEEditor['addShortcut']> {
    this.log('other', `addShortcut: ${args[0]}`, { desc: args[1] });
    return this.editor.addShortcut(...args);
  }

  /**
   * 注册菜单项
   */
  addMenuItem(
    ...args: Parameters<TinyMCEEditor['ui']['registry']['addMenuItem']>
  ): ReturnType<TinyMCEEditor['ui']['registry']['addMenuItem']> {
    this.log('other', `addMenuItem: ${args[0]}`);
    return this.editor.ui.registry.addMenuItem(...args);
  }

  /**
   * 注册切换菜单项
   */
  addToggleMenuItem(
    ...args: Parameters<TinyMCEEditor['ui']['registry']['addToggleMenuItem']>
  ): ReturnType<TinyMCEEditor['ui']['registry']['addToggleMenuItem']> {
    this.log('other', `addToggleMenuItem: ${args[0]}`);
    return this.editor.ui.registry.addToggleMenuItem(...args);
  }

  /**
   * 注册嵌套菜单项
   */
  addNestedMenuItem(
    ...args: Parameters<TinyMCEEditor['ui']['registry']['addNestedMenuItem']>
  ): ReturnType<TinyMCEEditor['ui']['registry']['addNestedMenuItem']> {
    this.log('other', `addNestedMenuItem: ${args[0]}`);
    return this.editor.ui.registry.addNestedMenuItem(...args);
  }

  /**
   * 注册菜单按钮（用于 Quick Toolbar）
   */
  addMenuButton(
    ...args: Parameters<TinyMCEEditor['ui']['registry']['addMenuButton']>
  ): ReturnType<TinyMCEEditor['ui']['registry']['addMenuButton']> {
    this.log('other', `addMenuButton: ${args[0]}`);
    return this.editor.ui.registry.addMenuButton(...args);
  }

  /**
   * 注册图标
   */
  addIcon(
    ...args: Parameters<TinyMCEEditor['ui']['registry']['addIcon']>
  ): ReturnType<TinyMCEEditor['ui']['registry']['addIcon']> {
    this.log('other', `addIcon: ${args[0]}`);
    return this.editor.ui.registry.addIcon(...args);
  }

  /**
   * 获取操作日志
   */
  getOperationLogs(): EditorOperationLog[] {
    return [...this.operationLogs];
  }

  /**
   * 清空操作日志
   */
  clearOperationLogs(): void {
    this.operationLogs = [];
  }

  /**
   * 记录操作日志
   */
  private log(type: EditorOperationType, description: string, data?: Record<string, unknown>): void {
    const log: EditorOperationLog = {
      type,
      description,
      timestamp: Date.now(),
      data,
    };

    this.operationLogs.push(log);

    if (this.config.enableDebugLog) {
      console.trace(`${this.config.logPrefix} [${type}] ${description}`, data || '');
    }
  }

  /**
   * 追踪操作执行
   */
  private trackOperation<T>(type: EditorOperationType, description: string, operation: () => T): T {
    const startTime = this.config.enablePerformanceTracking ? performance.now() : 0;

    try {
      const result = operation();

      const logData: Record<string, unknown> = {};
      if (this.config.enablePerformanceTracking) {
        const duration = performance.now() - startTime;
        logData.duration = `${duration.toFixed(2)}ms`;
      }

      const log: EditorOperationLog = {
        type,
        description,
        timestamp: Date.now(),
        data: Object.keys(logData).length > 0 ? logData : undefined,
      };

      this.operationLogs.push(log);

      if (this.config.enableDebugLog) {
        console.trace(`${this.config.logPrefix} [${type}] ${description}`, logData);
      }

      return result;
    } catch (error) {
      const errorLog: EditorOperationLog = {
        type,
        description: `${description} - ERROR`,
        timestamp: Date.now(),
        data: { error },
      };

      this.operationLogs.push(errorLog);

      if (this.config.enableDebugLog) {
        console.trace(`${this.config.logPrefix} [${type}] ${description} - ERROR`, error);
      }

      throw error;
    }
  }
}

/**
 * 创建 Editor Facade 实例
 */
export const createEditorFacade = (editor: EditorFacadeSource, config?: EditorFacadeConfig): EditorFacade => {
  return new EditorFacade(editor, config);
};
