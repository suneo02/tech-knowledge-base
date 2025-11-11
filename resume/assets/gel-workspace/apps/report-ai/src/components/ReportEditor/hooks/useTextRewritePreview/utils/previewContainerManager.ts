/**
 * 悬浮预览容器管理工具
 *
 * 负责创建、管理和清理悬浮预览容器
 */

import { EditorFacade } from '@/domain/reportEditor';
import { createRoot } from 'react-dom/client';
import { createContainer, deferredCleanup, isEditorReady, safeRemoveElement } from '../../utils/editorDomUtils';
import type { PreviewInstance } from '../types';
import { calculatePreviewPosition } from './calculatePreviewPosition';

/**
 * 预览容器样式配置
 */
const PREVIEW_CONTAINER_STYLES = {
  backgroundColor: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  padding: '16px',
  overflow: 'auto',
};

/**
 * 创建预览容器
 *
 * @param editorFacade 编辑器引用
 * @param correlationId 关联 ID
 * @returns 预览容器实例，如果创建失败则返回 null
 */
export function createPreviewContainer(
  editorFacade: EditorFacade | null,
  correlationId: string
): PreviewInstance | null {
  if (!isEditorReady(editorFacade)) {
    return null;
  }

  // 计算位置
  const position = calculatePreviewPosition(editorFacade);
  if (!position) {
    return null;
  }

  try {
    // 使用统一的容器创建工具
    const container = createContainer('text-rewrite-preview-container', {
      ...position,
      ...PREVIEW_CONTAINER_STYLES,
    });

    // 添加到 body
    document.body.appendChild(container);

    // 创建 React Root
    const root = createRoot(container);

    const instance: PreviewInstance = {
      container,
      root,
      correlationId,
    };

    return instance;
  } catch (error) {
    return null;
  }
}

/**
 * 清理预览容器
 *
 * @param instance 预览容器实例
 */
export function cleanupPreviewContainer(instance: PreviewInstance | null): void {
  if (!instance) {
    return;
  }

  const { container, root } = instance;
  const element = container as HTMLElement;

  if (element.dataset.previewUnmounting === 'true') {
    return;
  }
  element.dataset.previewUnmounting = 'true';

  const performCleanup = () => {
    try {
      root.unmount();
    } catch (error) {
      // Silent cleanup
    } finally {
      safeRemoveElement(element);
      delete element.dataset.previewUnmounting;
    }
  };

  // 使用统一的延迟清理工具
  deferredCleanup(performCleanup);
}

/**
 * 检查预览容器实例是否有效
 *
 * @param instance 预览容器实例
 * @param correlationId 期望的关联 ID
 * @returns 是否有效
 */
export function isPreviewInstanceValid(instance: PreviewInstance | null, correlationId: string): boolean {
  return Boolean(instance && instance.correlationId === correlationId && instance.container.parentNode);
}
