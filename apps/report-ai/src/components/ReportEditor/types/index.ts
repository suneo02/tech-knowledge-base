// ===== 统一类型导出 =====

import { RPReferenceType } from '@/domain/chat/ref';
import type { AIInvokeFunction, SelectionSnapshot } from '@/types/editor';
import { SelectionUserDecision } from '@/types/editor/selection-types';
import type { ChapterLoadingOverlayState } from '../hooks/useChapterLoadingOverlay';

/**
 * 文本改写状态
 */
export interface TextRewriteState {
  /** 是否正在改写 */
  isRewriting: boolean;
  /** 关联 ID */
  correlationId: string | null;
  /** 选区快照 */
  snapshot: SelectionSnapshot | null;
  /** 当前预览内容 */
  previewContent: string;
  /** 是否已完成 */
  isCompleted: boolean;
}

/**
 * 报告编辑器组件属性
 *
 * @description 定义报告编辑器组件的所有配置选项和回调函数
 * @since 1.0.0
 */
export interface ReportEditorProps {
  /** 初始内容值 */
  initialValue?: string;
  /** 是否只读（由全局操作派生），优先于 isGenerating 控制可编辑性 */
  readonly?: boolean;
  /** 是否正在加载，用于显示加载状态 */
  loading?: boolean;
  /** 编辑器初始化完成回调 */
  onEditorReady?: () => void;
  /** 编辑器内容变化回调（返回完整HTML） */
  onContentChange?: (fullHtml: string) => void;
  /** AI 操作调用回调，用于执行 AI 相关操作 */
  onAIInvoke?: AIInvokeFunction;
  /** 停止生成内容的回调 */
  onStopGenerating?: (sectionId: string) => void;
  /** 引用标记点击回调，用于打开对应的引用资料预览
   * @param referenceInfo.pageNumber - PDF 页码（仅 file 类型，同一文件不同引用位置可能有不同页码）
   */
  onReferenceClick?: (referenceInfo: { refId: string; refType: RPReferenceType; pageNumber?: number }) => void;
  /** AIGC 按钮点击回调，用于处理章节的 AI 生成相关操作 */
  onAIGCButtonClick?: (chapterId: string) => void;
  /** AIGC 按钮是否禁用 */
  aigcButtonDisabled?: boolean;
  /** 文本改写状态（可选，如果不提供则不使用文本改写功能） */
  textRewriteState: TextRewriteState;
  /** 文本改写用户决策回调（应用或取消） */
  onTextRewriteDecision?: (decision: SelectionUserDecision, content: string, snapshot: SelectionSnapshot) => void;
  /** 编辑器模式，支持编辑和预览两种模式 */
  mode?: 'edit' | 'preview';
  /** 占位符文本，当编辑器为空时显示 */
  placeholder?: string;
  /** 自定义 CSS 类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: React.CSSProperties;
  /** 章节 Loading 外部状态（由业务层输入） */
  aigcLoadingChapters?: ChapterLoadingOverlayState[];
}
