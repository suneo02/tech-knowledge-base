/**
 * 文本改写预览相关类型定义
 */

import type { SelectionSnapshot } from '@/types/editor';
import { SelectionUserDecision } from '@/types/editor/selection-types';
import { createRoot } from 'react-dom/client';
import { TextRewriteState } from '../../types';

/**
 * Hook 配置选项
 */
export interface UseTextRewritePreviewOptions {
  /** 文本改写状态（从外部传入） */
  rewriteState: TextRewriteState;
  /** 用户决策回调（应用或取消） */
  onUserDecision?: (decision: SelectionUserDecision, content: string, snapshot: SelectionSnapshot) => void;
}

/**
 * Hook 返回值
 */
export interface UseTextRewritePreviewReturn {
  /** 清理预览组件 */
  cleanup: () => void;
}

/**
 * 预览容器实例
 */
export interface PreviewInstance {
  container: HTMLElement;
  root: ReturnType<typeof createRoot>; // React Root
  correlationId: string;
}

/**
 * 预览容器配置
 */
export interface PreviewContainerConfig {
  /** 容器宽度 */
  width: number;
  /** 容器最大高度 */
  maxHeight: number;
  /** 与选区的间距 */
  padding: number;
  /** 最小显示空间 */
  minSpace: number;
  /** z-index 值 */
  zIndex: number;
}
