import { findChapterDOMById } from '@/domain/reportEditor/chapter/query';
import type { EditorFacade } from '@/domain/reportEditor/editor';

/**
 * 章节底部位置信息
 */
export interface ChapterBottomPosition {
  /** 章节标题的左边距（用于对齐） */
  left: number;
  /** 章节标题的宽度 */
  width: number;
  /** 章节内容的底部位置（绝对坐标） */
  bottom: number;
  /** 是否找到章节 */
  found: boolean;
}

/**
 * 获取编辑器 iframe 的偏移量
 *
 * @param editor EditorFacade 实例
 * @returns iframe 的偏移量
 */
export const getEditorFrameOffset = (editor: EditorFacade): { top: number; left: number } => {
  const editorBody = editor.getBody();
  if (!editorBody) return { top: 0, left: 0 };

  const iframe = editorBody.ownerDocument?.defaultView?.frameElement as HTMLIFrameElement | null;
  if (!iframe) return { top: 0, left: 0 };

  const rect = iframe.getBoundingClientRect();
  return { top: rect.top, left: rect.left };
};

/**
 * 获取章节底部位置
 *
 * @description
 * 使用 domain 层的 findChapterDOMById 查找章节结构，
 * 计算章节内容的底部位置（最后一个内容元素的 bottom）
 *
 * @param editor EditorFacade 实例
 * @param chapterId 章节 ID
 * @param frameOffset 编辑器 iframe 的偏移量
 * @returns 章节底部位置信息
 */
export const getChapterBottomPosition = (
  editor: EditorFacade,
  chapterId: string,
  frameOffset: { top: number; left: number }
): ChapterBottomPosition => {
  const chapterDOM = findChapterDOMById(editor, chapterId);

  if (!chapterDOM.found || !chapterDOM.headingElement) {
    return {
      left: 0,
      width: 0,
      bottom: 0,
      found: false,
    };
  }

  const headingElement = chapterDOM.headingElement as HTMLElement;
  const headingRect = headingElement.getBoundingClientRect();

  // 找到章节的最后一个内容元素
  let lastContentElement: HTMLElement = headingElement;
  const contentNodes = chapterDOM.contentNodes;

  // 从后往前遍历，找到最后一个元素节点
  for (let i = contentNodes.length - 1; i >= 0; i--) {
    const node = contentNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE) {
      lastContentElement = node as HTMLElement;
      break;
    }
  }

  const lastRect = lastContentElement.getBoundingClientRect();

  return {
    left: frameOffset.left + headingRect.left,
    width: headingRect.width,
    bottom: frameOffset.top + lastRect.bottom,
    found: true,
  };
};
