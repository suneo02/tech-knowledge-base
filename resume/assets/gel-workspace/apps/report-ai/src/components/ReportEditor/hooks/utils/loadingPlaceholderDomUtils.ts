/**
 * 加载占位符 DOM 操作工具函数
 *
 * @description 为报告编辑器中的加载占位符提供 DOM 操作和管理的业务逻辑支撑
 * 专注于容器查找、挂载点管理、元素创建等核心业务逻辑
 */

import type { EditorFacade } from '@/domain/reportEditor/editor';
import { RP_DATA_ATTRIBUTES, RP_SELECTORS } from '@/domain/reportEditor/foundation';
import { Root } from 'react-dom/client';

/**
 * 加载占位符容器查找
 */

/**
 * 查找报告中所有的加载占位符容器
 */
export const findLoadingPlaceholderContainers = (editor: EditorFacade): Element[] => {
  return editor.select(RP_SELECTORS.LOADING_CONTAINERS) ?? [];
};

/**
 * 从加载容器中提取章节 ID
 */
export const extractChapterIdFromContainer = (container: Element): string | null => {
  const sectionNode = container.closest(RP_SELECTORS.CHAPTER_ID_ATTRIBUTE) as HTMLElement | null;
  return sectionNode?.getAttribute(RP_DATA_ATTRIBUTES.CHAPTER_ID) ?? null;
};

/**
 * 加载占位符挂载点管理
 */

/**
 * 生成加载占位符的挂载点 ID
 */
export const generateLoadingMountId = (sectionId: string): string => {
  return `loading-${sectionId}`;
};

/**
 * 清理容器中的现有内容，为加载占位符做准备
 */
export const clearContainerForLoading = (editor: EditorFacade, container: HTMLElement): void => {
  try {
    editor.setHTML(container, '');
  } catch {
    // 静默处理清理失败的情况
  }
};

/**
 * 创建加载占位符的挂载点元素
 */
export const createLoadingPlaceholderMount = (
  editor: EditorFacade,
  container: HTMLElement,
  sectionId: string
): HTMLElement | null => {
  const mountId = generateLoadingMountId(sectionId);

  // 清空容器原有内容
  clearContainerForLoading(editor, container);

  // 创建挂载点元素
  const mount = editor.appendElement(container, 'div', {
    id: mountId,
    [RP_DATA_ATTRIBUTES.PLACEHOLDER]: 'loading',
    [RP_DATA_ATTRIBUTES.CHAPTER_ID]: sectionId,
    contenteditable: 'false',
  }) as HTMLElement;

  return mount;
};

/**
 * 清理容器内除挂载点外的其他节点
 */
export const cleanupContainerExceptMount = (editor: EditorFacade, container: HTMLElement, mount: HTMLElement): void => {
  const children = Array.from(container.childNodes);
  children.forEach((node) => {
    if (node !== mount) {
      try {
        editor.removeElement(node as unknown as string);
      } catch {
        // 静默处理移除失败的情况
      }
    }
  });
};

/**
 * 确保加载占位符的挂载点存在
 * 如果不存在则创建，如果存在则清理周围内容
 */
export const ensureLoadingPlaceholderMount = (
  editor: EditorFacade,
  container: HTMLElement,
  sectionId: string
): HTMLElement | null => {
  const mountId = generateLoadingMountId(sectionId);
  let mount = editor.getElementById(mountId) as HTMLElement | null;

  if (!mount) {
    // 创建新的挂载点
    mount = createLoadingPlaceholderMount(editor, container, sectionId);
  } else {
    // 清理容器内除挂载点外的其他节点
    cleanupContainerExceptMount(editor, container, mount);
  }

  return mount;
};

/**
 * React Root 管理
 *
 * @note getOrCreateLoadingRoot 已移至 useLoadingPlaceholders hook 内部
 * 保持 hook 的封装性，避免外部直接操作 Root Map
 */

/**
 * 检查加载占位符的挂载点是否还存在
 */
export const isLoadingMountExists = (editor: EditorFacade, sectionId: string): boolean => {
  const mountId = generateLoadingMountId(sectionId);
  return !!editor.getElementById(mountId);
};

/**
 * 清理孤立的加载占位符 React Root
 */
export const cleanupOrphanLoadingPlaceholders = (editor: EditorFacade, loadingRoots: Map<string, Root>): string[] => {
  const removedSectionIds: string[] = [];

  loadingRoots.forEach((root, sectionId) => {
    if (!isLoadingMountExists(editor, sectionId)) {
      root.unmount();
      loadingRoots.delete(sectionId);
      removedSectionIds.push(sectionId);
    }
  });

  return removedSectionIds;
};
