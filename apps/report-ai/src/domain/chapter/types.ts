import { RPChapterPayloadTempIdIdentifier, RPDetailChapter } from 'gel-api';
import { TreeNodeMap } from 'gel-util/common';

/**
 * 章节节点的最小结构约束
 */
export interface ChapterLike<T = any> {
  chapterId: string | number;
  children?: T[];
}

/**
 * 支持临时章节的章节节点约束
 * - chapterId 可选（临时章节没有 chapterId）
 * - tempId 必须存在（作为临时标识）
 */
export interface ChapterLikeWithTempId<T = any> extends RPChapterPayloadTempIdIdentifier {
  chapterId?: string | number;
  children?: T[];
}

export type ChapterNode<T extends ChapterLike<T>> = T & { children?: T['children'] };

export type ChapterMap = TreeNodeMap<RPDetailChapter>;
