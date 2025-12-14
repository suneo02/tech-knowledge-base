import { RPContentRefChapterIdentifier } from '@/types/chat/RPContent';
import { RPFileUnified } from '@/types/file';
import { DPUItem, RAGItem } from 'gel-api';

export type DPUItemWithChapters = DPUItem & RPContentRefChapterIdentifier;

export type RAGItemWithChapters = RAGItem & RPContentRefChapterIdentifier;

/**
 * 引用资料项（简化版）
 *
 * 只包含类型和数据，移除未使用的衍生字段：
 * - referenceCount: UI 中未显示
 * - priority: 仅用于排序，不需要存储
 * - chapter: 章节信息已在 data.chapterId 中
 */
export type RPReferenceItem =
  | {
      type: 'dpu';
      data: DPUItemWithChapters;
    }
  | {
      type: 'rag';
      data: RAGItemWithChapters;
    }
  | {
      type: 'file';
      data: RPFileUnified;
    };

/**
 * 引用资料类型字面量
 */
export type RPReferenceType = RPReferenceItem['type'];
