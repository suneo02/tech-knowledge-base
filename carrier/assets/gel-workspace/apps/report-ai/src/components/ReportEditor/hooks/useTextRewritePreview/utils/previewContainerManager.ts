/**
 * 悬浮预览容器管理工具
 *
 * @description
 * 使用统一的 createExternalComponentRenderer 管理预览容器。
 * 与其他外部组件（Loading Overlay、AIGC Button）保持一致的架构。
 *
 * @see apps/report-ai/src/components/ReportEditor/hooks/utils/externalComponentRenderer.ts
 */

import { EditorFacade } from '@/domain/reportEditor';
import { ExternalComponentRenderer, isEditorReady } from '../../utils';
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
 * @description
 * 使用统一的 createExternalComponentRenderer 创建容器。
 * 与 Loading Overlay 和 AIGC Button 保持一致的实现方式。
 *
 * @param editorFacade 编辑器引用
 * @param correlationId 关联 ID
 * @param renderer 外部组件渲染器
 * @returns 预览容器实例，如果创建失败则返回 null
 */
export function createPreviewContainer(
  editorFacade: EditorFacade | null,
  correlationId: string,
  renderer: ExternalComponentRenderer<string>
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
    // 使用统一的渲染器创建实例
    const instance = renderer.getOrCreateInstance(correlationId, {
      className: 'text-rewrite-preview-container',
      styles: {
        ...position,
        ...PREVIEW_CONTAINER_STYLES,
      },
    });

    // 显示实例
    renderer.showInstance(correlationId);

    const previewInstance: PreviewInstance = {
      container: instance.container,
      root: instance.root,
      correlationId,
    };

    return previewInstance;
  } catch (error) {
    console.error('[TextRewritePreview] Failed to create preview container:', error);
    return null;
  }
}

/**
 * 清理预览容器
 *
 * @description
 * 使用统一的渲染器清理容器。
 *
 * @param correlationId 关联 ID
 * @param renderer 外部组件渲染器
 */
export function cleanupPreviewContainer(
  correlationId: string | null,
  renderer: ExternalComponentRenderer<string>
): void {
  if (!correlationId) {
    return;
  }

  try {
    renderer.deleteInstance(correlationId);
  } catch (error) {
    console.error('[TextRewritePreview] Failed to cleanup preview container:', error);
  }
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
