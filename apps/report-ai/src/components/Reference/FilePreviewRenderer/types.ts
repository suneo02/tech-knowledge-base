import { RPChapterEnriched } from '@/types';
import { RPFileUnified } from '@/types/file';

/**
 * 文件预览渲染器属性接口
 */
export interface FilePreviewRendererProps {
  /** 文件数据 */
  file: RPFileUnified;
  /** PDF 初始页码（从 1 开始，仅用于 PDF 文件） */
  initialPage?: number;
  /** 章节ID到章节对象的映射（用于显示章节名称） */
  chapterMap?: Map<string, RPChapterEnriched>;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 文件加载完成回调 */
  onLoad?: () => void;
  /** 文件加载失败回调 */
  onError?: (error: Error) => void;
}

/**
 * PDF预览组件属性
 */
export interface PDFPreviewWrapperProps {
  /** 文件URL */
  url: string;
  /** 文件名 */
  fileName: string;
  /** PDF 初始页码（从 1 开始） */
  initialPage?: number;
  /** 文件数据（用于获取 trace 信息） */
  file?: RPFileUnified;
  /** 章节ID到章节对象的映射（用于显示章节名称） */
  chapterMap?: Map<string, RPChapterEnriched>;
  /** 加载完成回调 */
  onLoad?: () => void;
  /** 加载失败回调 */
  onError?: (error: Error) => void;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
}

/**
 * 文本预览组件属性
 */
export interface TextPreviewProps {
  /** 文本内容URL */
  url: string;
  /** 文件名 */
  fileName: string;
  /** 加载完成回调 */
  onLoad?: () => void;
  /** 加载失败回调 */
  onError?: (error: Error) => void;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
}

/**
 * 章节跳转项
 */
export interface ChapterJumpItem {
  /** 章节ID */
  chapterId: string;
  /** 章节名称 */
  chapterName: string;
  /** 起始页码（从 1 开始） */
  startPage: number;
}

/**
 * QuickJumper 组件属性
 */
export interface QuickJumperProps {
  /** 章节列表 */
  chapters: ChapterJumpItem[];
  /** 章节点击回调 */
  onChapterClick: (page: number) => void;
}
