import { CHAPTER_ORDINAL_SELECTOR } from './render';

/**
 * 查找章节序号节点
 */
export const findChapterOrdinalNode = (rootElement: Element): HTMLElement | null => {
  if (!rootElement) return null;

  if (rootElement.matches(CHAPTER_ORDINAL_SELECTOR)) {
    return rootElement as HTMLElement;
  }

  for (const child of rootElement.children) {
    if (child.matches(CHAPTER_ORDINAL_SELECTOR)) {
      return child as HTMLElement;
    }
  }

  return null;
};
