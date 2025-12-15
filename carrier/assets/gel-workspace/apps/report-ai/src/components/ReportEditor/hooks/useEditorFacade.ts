/**
 * useEditorFacade Hook
 *
 * 职责：
 * - 管理 TinyMCE 原生实例与 EditorFacade 的绑定生命周期
 * - 根据环境自动配置调试与性能跟踪选项
 * - 对外仅暴露 Facade 引用，避免业务侧接触原始 editor
 */

import { createEditorFacade, EditorFacade, EditorFacadeSource } from '@/domain/reportEditor/editor';
import { useCallback, useEffect, useRef } from 'react';

export interface UseEditorFacadeOptions {
  /** 是否启用调试日志（默认在开发环境启用） */
  enableDebugLog?: boolean;
  /** 是否启用性能追踪（默认在开发环境启用） */
  enablePerformanceTracking?: boolean;
  /** Facade 日志前缀 */
  logPrefix?: string;
}

export interface UseEditorFacadeReturn {
  /** Facade 引用，提供给下游 Hook / 组件使用 */
  facadeRef: React.MutableRefObject<EditorFacade | null>;
  /** 当前 Facade 实例（便捷访问） */
  getFacade: () => EditorFacade | null;
  /** 绑定原生编辑器实例 */
  attachEditor: (editor: EditorFacadeSource | null) => void;
  /** 主动释放 Facade 与原生实例的绑定 */
  detachEditor: () => void;
}

/**
 * 创建并管理 EditorFacade
 *
 * @param options Facade 配置选项
 */
export const useEditorFacade = (options: UseEditorFacadeOptions = {}): UseEditorFacadeReturn => {
  const facadeRef = useRef<EditorFacade | null>(null);
  const editorInstanceRef = useRef<EditorFacadeSource | null>(null);

  const resolvedConfig = {
    enableDebugLog: options.enableDebugLog,
    enablePerformanceTracking: options.enablePerformanceTracking,
    logPrefix: options.logPrefix ?? '[ReportEditor]',
  };

  const rebuildFacade = useCallback(() => {
    const editor = editorInstanceRef.current;
    if (!editor) {
      facadeRef.current = null;
      return;
    }
    facadeRef.current = createEditorFacade(editor, resolvedConfig);
  }, [resolvedConfig.enableDebugLog, resolvedConfig.enablePerformanceTracking, resolvedConfig.logPrefix]);

  const attachEditor = useCallback(
    (editor: EditorFacadeSource | null) => {
      if (editor === editorInstanceRef.current) {
        return;
      }
      editorInstanceRef.current = editor;
      rebuildFacade();
    },
    [rebuildFacade]
  );

  const detachEditor = useCallback(() => {
    editorInstanceRef.current = null;
    facadeRef.current = null;
  }, []);

  const getFacade = useCallback(() => facadeRef.current, []);

  // 当配置变化时，重新创建 Facade
  useEffect(() => {
    if (!editorInstanceRef.current) return;
    rebuildFacade();
  }, [rebuildFacade]);

  return {
    facadeRef,
    getFacade,
    attachEditor,
    detachEditor,
  };
};
