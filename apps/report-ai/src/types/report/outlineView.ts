import type {
  RPChapter,
  RPChapterIdIdentifier,
  RPChapterPayloadTempIdIdentifier,
  RPFileTraced,
  WithDPUList,
  WithRAGList,
} from 'gel-api';

/**
 * 左侧大纲视图章节节点的视图模型
 *
 * 设计原则：
 * - 支持临时章节（只有 tempId）和已保存章节（有 chapterId）
 * - chapterId 和 tempId 至少有一个存在
 */
export interface OutlineChapterViewModel
  extends Partial<WithDPUList>,
    Partial<WithRAGList>,
    Pick<RPChapter, 'title' | 'writingThought'>,
    RPChapterPayloadTempIdIdentifier,
    Partial<RPChapterIdIdentifier> {
  /** 子章节列表 */
  children?: OutlineChapterViewModel[];
  /** 附件引用数据 */
  refFiles?: RPFileTraced[];
}
