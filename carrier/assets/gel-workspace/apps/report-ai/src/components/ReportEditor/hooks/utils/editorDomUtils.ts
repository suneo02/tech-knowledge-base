/**
 * 编辑器 DOM 操作统一工具函数
 *
 * @description 为报告编辑器提供统一的 DOM 操作、位置计算、容器管理等核心功能
 * 避免代码重复，提供一致的 API 接口
 *
 * @note 优先复用 domain 层的工具方法（EditorFacade、foundation 等）
 */

import type { EditorFacade } from '@/domain/reportEditor';
import type { CSSProperties } from 'react';

/**
 * ==================== 编辑器状态检查 ====================
 */

/**
 * 检查编辑器是否已初始化并可用
 *
 * @note 复用 EditorFacade.isReady() 方法
 */
export const isEditorReady = (editor: EditorFacade | null): editor is EditorFacade => {
  return Boolean(editor?.isReady?.());
};

/**
 * 获取编辑器内容区域（body）
 *
 * @note 复用 EditorFacade.getBody() 方法
 */
export const getEditorBody = (editor: EditorFacade | null): HTMLElement | null => {
  return editor?.getBody() ?? null;
};

/**
 * ==================== 文档上下文获取 ====================
 */

/**
 * 编辑器文档上下文
 */
export interface EditorDocumentContext {
  /** 编辑器所在的 document */
  document: Document | null;
  /** 编辑器所在的 window */
  window: Window | null;
  /** 编辑器的 iframe 元素（如果在 iframe 中） */
  frameElement: HTMLElement | null;
}

/**
 * 获取编辑器的文档上下文
 * 包括 document、window、frameElement
 *
 * @note 基于 EditorFacade.getDocument() 和 EditorFacade.getBody() 实现
 */
export const getEditorDocumentContext = (editor: EditorFacade | null): EditorDocumentContext => {
  if (!isEditorReady(editor)) {
    return { document: null, window: null, frameElement: null };
  }

  const doc = editor.getDocument();
  const win = doc?.defaultView ?? null;
  const frame = win?.frameElement as HTMLElement | null;

  return {
    document: doc,
    window: win,
    frameElement: frame,
  };
};

/**
 * ==================== iframe 位置偏移计算 ====================
 */

/**
 * iframe 偏移量
 */
export interface FrameOffset {
  top: number;
  left: number;
}

/**
 * 获取 iframe 的位置偏移
 * 如果不在 iframe 中，返回 { top: 0, left: 0 }
 */
export const getFrameOffset = (frameElement: HTMLElement | null): FrameOffset => {
  if (!frameElement) {
    return { top: 0, left: 0 };
  }

  const rect = frameElement.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
  };
};

/**
 * 从编辑器获取 iframe 偏移
 */
export const getEditorFrameOffset = (editor: EditorFacade | null): FrameOffset => {
  const { frameElement } = getEditorDocumentContext(editor);
  return getFrameOffset(frameElement);
};

/**
 * ==================== 元素位置计算 ====================
 */

/**
 * 矩形位置信息
 */
export interface RectPosition {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * 获取元素相对于视口的绝对位置
 * 自动处理 iframe 偏移
 */
export const getElementViewportPosition = (element: HTMLElement, frameOffset?: FrameOffset): RectPosition => {
  const rect = element.getBoundingClientRect();
  const offset = frameOffset ?? getFrameOffset(element.ownerDocument?.defaultView?.frameElement as HTMLElement | null);

  return {
    top: offset.top + rect.top,
    left: offset.left + rect.left,
    right: offset.left + rect.right,
    bottom: offset.top + rect.bottom,
    width: rect.width,
    height: rect.height,
  };
};

/**
 * 计算元素的垂直中心点位置
 */
export const getElementVerticalCenter = (element: HTMLElement, frameOffset?: FrameOffset): number => {
  const pos = getElementViewportPosition(element, frameOffset);
  return pos.top + pos.height / 2;
};

/**
 * 计算元素的水平中心点位置
 */
export const getElementHorizontalCenter = (element: HTMLElement, frameOffset?: FrameOffset): number => {
  const pos = getElementViewportPosition(element, frameOffset);
  return pos.left + pos.width / 2;
};

/**
 * ==================== 视口信息 ====================
 */

/**
 * 视口尺寸
 */
export interface ViewportSize {
  width: number;
  height: number;
}

/**
 * 获取视口尺寸
 */
export const getViewportSize = (): ViewportSize => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * 响应式断点判断
 */
export const getResponsiveBreakpoint = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width <= 480) return 'mobile';
  if (width <= 768) return 'tablet';
  return 'desktop';
};

/**
 * ==================== 容器创建和管理 ====================
 */

/**
 * 容器样式配置
 */
export type ContainerStyleConfig = CSSProperties;

/**
 * 创建 DOM 容器元素
 */
export const createContainer = (className: string, styles?: ContainerStyleConfig, id?: string): HTMLElement => {
  const container = document.createElement('div');
  container.className = className;
  if (id) {
    container.id = id;
  }

  if (styles) {
    applyStylesToElement(container, styles);
  }

  return container;
};

/**
 * 应用样式到元素
 */
export const applyStylesToElement = (element: HTMLElement, styles: CSSProperties): void => {
  Object.entries(styles).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      (element.style as any)[key] = String(value);
    }
  });
};

/**
 * 创建全局覆盖容器（用于固定定位的浮层）
 */
export const createGlobalOverlayContainer = (id: string, className: string, zIndex: number = 10000): HTMLElement => {
  return createContainer(
    className,
    {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex,
      pointerEvents: 'none',
    },
    id
  );
};

/**
 * ==================== 元素查找 ====================
 */

/**
 * 通过鼠标位置查找元素
 */
export const findElementByPosition = (doc: Document, x: number, y: number): Element | null => {
  return doc.elementFromPoint(x, y);
};

/**
 * 向上查找符合条件的父元素
 */
export const findParentElement = (
  element: Element | null,
  predicate: (el: Element) => boolean,
  maxDepth: number = 10
): Element | null => {
  if (!element) return null;

  let current: Element | null = element;
  let depth = 0;

  while (current && depth <= maxDepth) {
    if (predicate(current)) {
      return current;
    }
    current = current.parentElement;
    depth++;
  }

  return null;
};

/**
 * ==================== 元素清理 ====================
 */

/**
 * 安全移除元素
 */
export const safeRemoveElement = (element: HTMLElement | null): void => {
  if (!element) return;

  try {
    if (element.isConnected) {
      element.remove();
    } else if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  } catch (error) {
    // 静默处理移除失败
  }
};

/**
 * 延迟清理元素（使用微任务）
 */
export const deferredCleanup = (cleanup: () => void): void => {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(cleanup);
  } else {
    Promise.resolve().then(cleanup);
  }
};

/**
 * ==================== 工具函数 ====================
 */

/**
 * 生成唯一 ID
 */
export const generateUniqueId = (prefix: string = 'element'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * 检查元素是否在视口内
 */
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  const viewport = getViewportSize();

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= viewport.height && rect.right <= viewport.width;
};
