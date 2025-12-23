import { EditorFacade } from '../editor';
import {
  getContentNodesAfterHeading,
  HEADING_SELECTOR,
  HEADING_TAG_NAMES,
  RP_DATA_ATTRIBUTES,
} from '../foundation';

/**
 * 章节 DOM 查找结果
 */
export interface ChapterDOMResult {
  /** 章节标题元素（h1-h6） */
  headingElement: Element | null;
  /** 章节内容范围（从标题到下一个标题之间的所有节点） */
  contentNodes: Node[];
  /** 是否找到章节 */
  found: boolean;
}

/**
 * 查找章节对应的标题元素
 *
 * @param editor EditorFacade 实例
 * @param chapterId 章节 ID
 * @returns 标题元素或 null
 */
export const findChapterHeading = (editor: EditorFacade, chapterId: string | number): Element | null => {
  // 为每个标题类型都添加属性选择器
  // 不能直接拼接 HEADING_SELECTOR，因为 'h1, h2[attr]' 会导致只有 h2 带属性限制
  const selector = HEADING_TAG_NAMES
    .map(tag => `${tag}[${RP_DATA_ATTRIBUTES.CHAPTER_ID}="${chapterId}"]`)
    .join(', ');
  return editor.querySelector(selector);
};

/**
 * 获取章节内容范围的所有节点
 *
 * 从当前标题到下一个标题之间的所有节点
 *
 * @param headingElement 章节标题元素
 * @returns 内容节点数组
 * @deprecated 请使用 foundation/chapterStructure.ts 中的 getContentNodesAfterHeading
 */
export const getChapterContentNodes = getContentNodesAfterHeading;

/**
 * 根据章节 ID 查找章节 DOM 结构（包含标题元素和内容节点）
 *
 * 新的章节结构（无容器）：
 * ```html
 * <h1 data-chapter-id="xxx">标题</h1>  <!-- headingElement -->
 * <p>内容段落1</p>                    <!-- contentNodes[0] -->
 * <p>内容段落2</p>                    <!-- contentNodes[1] -->
 * <h2 data-chapter-id="yyy">下一章节</h2>
 * ```
 *
 * @param editor EditorFacade 实例
 * @param chapterId 章节 ID
 * @returns 章节 DOM 查找结果
 */
export const findChapterDOMById = (editor: EditorFacade, chapterId: string | number): ChapterDOMResult => {
  const headingElement = findChapterHeading(editor, chapterId);

  if (!headingElement) {
    return {
      headingElement: null,
      contentNodes: [],
      found: false,
    };
  }

  const contentNodes = getChapterContentNodes(headingElement);

  return {
    headingElement,
    contentNodes,
    found: true,
  };
};

/**
 * @deprecated 请使用 findChapterDOMById 以明确表示通过 ID 查找
 */
export const findChapterDOM = findChapterDOMById;
