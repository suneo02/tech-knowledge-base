import { removeExternalRenderingNodes } from '@/domain/reportEditor/editor';
import { ReportEditorRef } from '@/types/editor';
import { isDev } from '@/utils';
import { Editor } from '@tinymce/tinymce-react';
import { Spin } from '@wind/wind-ui';
import cn from 'classnames';
import { GELService, generatePrefixUrl } from 'gel-util/link';
import path from 'path-browserify';
import { forwardRef, useEffect, useMemo, useRef } from 'react';
import { bindEditorRuntime, createStaticEditorInit } from './config/editorConfig';
import { useExternalComponentRenderer, useReportEditorRef, useTextRewritePreview } from './hooks';
import styles from './styles/index.module.less';
import { ReportEditorProps } from './types';

export type { ReportEditorProps } from './types';

export const ReportEditor = forwardRef<ReportEditorRef, ReportEditorProps>(
  (
    {
      onAIInvoke,
      onContentChange,
      onEditorReady,
      onStopGenerating,
      onReferenceClick,
      onAIGCButtonClick,
      aigcButtonDisabled = false,
      initialValue,
      mode = 'edit',
      placeholder = '加载中...',
      className,
      style,
      readonly,
      loading,
      textRewriteState,
      onTextRewriteDecision,
    },
    ref
  ) => {
    // 使用 imperative handle hook
    const { editorFacadeRef, attachEditor, requestDomSync } = useReportEditorRef(
      { mode, autoNumberingDebug: false },
      ref
    );

    // 文本改写预览 Hook（使用传入的状态，保持组件的纯粹性）
    useTextRewritePreview(editorFacadeRef.current, {
      rewriteState: textRewriteState,
      onUserDecision: onTextRewriteDecision,
    });

    // 始终引用最新的 onContentChange，避免 TinyMCE 监听器捕获旧闭包
    const onContentChangeRef = useRef<typeof onContentChange>(onContentChange);
    useEffect(() => {
      onContentChangeRef.current = onContentChange;
    }, [onContentChange]);

    const editorConfig = useMemo(() => createStaticEditorInit({ placeholder }), [placeholder]);

    // 使用外部组件渲染器 hook - 直接传入 ref
    const { renderComponents, initializeHoverDetection } = useExternalComponentRenderer(editorFacadeRef, {
      onStop: onStopGenerating,
      onAIGCButtonClick,
      aigcButtonDisabled,
    });

    // 根据 readonly 切换编辑器模式（design/readonly）
    useEffect(() => {
      if (!editorFacadeRef.current) return;
      if (mode !== 'edit') return;
      try {
        // TinyMCE 模式切换
        editorFacadeRef.current.setMode(readonly ? 'readonly' : 'design');
      } catch (e) {
        // ignore
      }
    }, [readonly, mode, editorFacadeRef]);

    return (
      <div
        className={cn(styles['report-editor-wrapper'], className, {
          [styles['report-editor-wrapper--preview']]: mode === 'preview',
          [styles['report-editor-wrapper--loading']]: loading,
        })}
        style={style}
      >
        {loading ? (
          <Spin spinning={loading} />
        ) : (
          <Editor
            tinymceScriptSrc={path.join(
              '/',
              generatePrefixUrl({
                service: GELService.ReportAI,
                isDev,
              }),
              'tinymce/tinymce.min.js'
            )}
            initialValue={initialValue}
            onInit={(_evt, ed) => {
              // 创建 facade 并绑定到 ref
              attachEditor(ed);

              const facade = editorFacadeRef.current;
              if (!facade) {
                console.error('[ReportEditor] Failed to create editor facade');
                return;
              }

              // 监听内容设置完成事件
              facade.on('ContentSet', () => {
                renderComponents();
                requestDomSync();
              });

              // 初始化章节悬停检测
              console.log('[ReportEditor] Initializing chapter hover detection');
              initializeHoverDetection();

              facade.setContent(initialValue || '', { format: 'html' });
              requestDomSync();

              // 只在编辑模式下绑定运行期行为
              if (mode === 'edit') {
                bindEditorRuntime(facade, {
                  onAIAction: (data) => {
                    // 直接调用 AI 操作，由父组件处理状态管理
                    if (onAIInvoke) {
                      onAIInvoke(data);
                    }
                  },
                  onContentChange: (fullHtml) => {
                    requestDomSync();
                    // 移除溯源标记和外部渲染节点，返回用于保存/diff的纯净报告内容
                    // onContentChange 用于 diff 和 save，需要传递纯净的内容
                    const cleanHtml = removeExternalRenderingNodes(fullHtml);
                    onContentChangeRef.current?.(cleanHtml);
                  },
                  onReferenceClick: onReferenceClick,
                });
              }

              // 预览模式设置为只读
              if (mode === 'preview') {
                facade.setMode('readonly');
              }

              // 通知外部编辑器已就绪
              onEditorReady?.();

              // 旧的外部覆盖依赖的实时位置更新已移除
            }}
            init={editorConfig}
          />
        )}
      </div>
    );
  }
);

ReportEditor.displayName = 'ReportEditor';
