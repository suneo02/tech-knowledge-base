/**
 * 章节结构工具
 *
 * 职责：
 * - 提供章节层级解析、验证等基础功能
 * - 统一章节结构相关的常量和类型
 * - 避免重复实现
 *
 * 设计原则：
 * - 纯函数设计，无副作用
 * - 单一数据源，避免魔法数字
 * - 类型安全，提供完整的类型定义
 */

/**
 * 标题选择器：匹配所有层级的标题元素
 */
export const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6';

/**
 * 支持的标题层级范围
 */
export const HEADING_LEVELS = {
  MIN: 1,
  MAX: 6,
} as const;

/**
 * 标题标签名称映射
 */
export const HEADING_TAG_NAMES = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

/**
 * 标题层级类型
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * 获取标题元素的层级（1-6）
 *
 * 用途：
 * - 章节 ID 同步时识别标题层级
 * - 章节编号计算时确定层级关系
 * - DOM 验证时检查标题有效性
 *
 * @param heading - 标题元素
 * @returns 标题层级数字（1-6），如果不是有效标题则返回 0
 *
 * @example
 * ```typescript
 * const h2 = document.querySelector('h2');
 * const level = getHeadingLevel(h2); // 返回 2
 *
 * const div = document.querySelector('div');
 * const level = getHeadingLevel(div); // 返回 0（无效标题）
 * ```
 */
export const getHeadingLevel = (heading: Element): number => {
  const tagName = heading.tagName.toLowerCase();
  const match = tagName.match(/^h([1-6])$/);
  return match ? parseInt(match[1], 10) : 0;
};

/**
 * 从标题元素中提取纯文本（移除序号等装饰节点）
 *
 * @description
 * 移除标题中的章节序号标记（data-gel-external="chapter-number"），
 * 返回纯文本标题内容。这是标题解析的标准方法。
 *
 * @param headingElement - 标题元素
 * @param ordinalSelector - 序号选择器（默认为 [data-gel-external="chapter-number"]）
 * @returns 纯文本标题
 *
 * @example
 * ```typescript
 * const h1 = document.querySelector('h1');
 * // <h1><span data-gel-external="chapter-number">1 </span>章节标题</h1>
 * const title = extractHeadingText(h1);
 * // 返回 "章节标题"（序号已移除）
 * ```
 */
export const extractHeadingText = (
  headingElement: Element,
  ordinalSelector: string = '[data-gel-external="chapter-number"]'
): string => {
  const headingClone = headingElement.cloneNode(true) as Element;
  headingClone.querySelectorAll(ordinalSelector).forEach((node) => node.remove());
  return headingClone.textContent?.trim() ?? '';
};

/**
 * 获取从标题元素到下一个标题之间的所有节点
 *
 * @description
 * 从当前标题的 nextSibling 开始收集,直到遇到任何 h1-h6 标题元素为止。
 * 这是章节内容边界识别的核心逻辑,被多处复用。
 *
 * ⚠️ **重要假设**：此函数假设标题元素（h1-h6）与内容节点是平级的（siblings）。
 * 如果标题被嵌套在容器中（如 div、section 等），可能导致内容收集不完整。
 *
 * @see {@link ../../../docs/issues/heading-nesting-assumption.md | Issue: 标题嵌套假设问题}
 *
 * @param headingElement - 标题元素
 * @returns 内容节点数组
 *
 * @example
 * ```typescript
 * const h1 = document.querySelector('h1');
 * const contentNodes = getContentNodesAfterHeading(h1);
 * // 返回 h1 和下一个标题之间的所有节点
 * ```
 */
export const getContentNodesAfterHeading = (headingElement: Element): Node[] => {
  const nodes: Node[] = [];
  let nextNode = headingElement.nextSibling;

  while (nextNode) {
    // 如果遇到任何标题元素，停止收集
    if (nextNode.nodeType === Node.ELEMENT_NODE) {
      const element = nextNode as Element;
      const level = getHeadingLevel(element);

      // 如果是标题元素（h1-h6），停止收集
      if (level > 0) {
        break;
      }
    }

    nodes.push(nextNode);
    nextNode = nextNode.nextSibling;
  }

  return nodes;
};

/**
 * 获取从标题元素到下一个标题之间的 HTML 内容
 *
 * @description
 * 与 getContentNodesAfterHeading 类似，但返回 HTML 字符串而非节点数组。
 * 用于需要序列化内容的场景（如解析、保存）。
 *
 * ⚠️ **重要假设**：此函数假设标题元素（h1-h6）与内容节点是平级的（siblings）。
 * 如果标题被嵌套在容器中（如 div、section 等），可能导致内容收集不完整。
 *
 * @see {@link ../../../docs/issues/heading-nesting-assumption.md | Issue: 标题嵌套假设问题}
 *
 * @param headingElement - 标题元素
 * @returns HTML 内容字符串
 */
export const getContentHtmlAfterHeading = (headingElement: Element): string => {
  const contentParts: string[] = [];
  let nextNode = headingElement.nextSibling;

  while (nextNode) {
    // 如果遇到任何标题元素，停止收集
    if (nextNode.nodeType === Node.ELEMENT_NODE) {
      const element = nextNode as Element;
      const level = getHeadingLevel(element);

      if (level > 0) {
        break;
      }
    }

    // 收集节点的 HTML
    if (nextNode.nodeType === Node.ELEMENT_NODE) {
      contentParts.push((nextNode as Element).outerHTML);
    } else if (nextNode.nodeType === Node.TEXT_NODE) {
      const text = nextNode.textContent || '';
      if (text.trim()) {
        contentParts.push(text);
      }
    }

    nextNode = nextNode.nextSibling;
  }

  return contentParts.join('').trim();
};
