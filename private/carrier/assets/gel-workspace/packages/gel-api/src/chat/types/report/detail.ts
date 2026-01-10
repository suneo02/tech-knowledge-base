import { ChatTraceItem } from '@/chat/base'
import { DPUItem } from '../dpu'
import { WithEntities } from '../entity'
import { RAGItem } from '../rag'
import { RPFileTraced } from './file'
import { RPChapter, RPChapterIdIdentifier } from './outline'

/**
 * 报告详情章节
 *
 * @description 报告详情章节，包含章节内容、提示、表格、 gelData 等
 * @since 1.0.0
 */
export interface RPDetailChapter extends Omit<RPChapter, 'children'>, Partial<WithEntities> {
  /**
   * 章节内容 ai 生成 富文本 格式 或者 md 格式
   */
  content?: string
  /**
   * 章节内容类型
   */
  contentType?: 'markdown' | 'html'
  files?: RPFileTraced[]
  refData?: DPUItem[]
  refSuggest?: RAGItem[]
  traceContent?: ChatTraceItem[]
  children?: RPDetailChapter[]
}

/**
 * 保存章节时的 temp 标识
 */
export interface RPChapterPayloadTempIdentifier {
  isTemporary?: boolean
}

/**
 * 保存章节时的 temp Id 标识
 */
export interface RPChapterPayloadTempIdIdentifier {
  tempId?: string
}

/**
 * 临时章节 Payload（新增章节，未保存）
 *
 * @description
 * 用于表示用户新增但尚未保存到服务器的章节。
 * 使用临时 ID（tempId）作为唯一标识，保存成功后会被替换为持久 ID。
 */
export interface RPChapterSavePayloadTemp
  extends Partial<Pick<RPChapter, 'keywords' | 'writingThought'>>,
    Pick<RPChapter, 'title'>,
    Partial<Pick<RPDetailChapter, 'content' | 'contentType'>> {
  /** 临时章节 ID */
  tempId: string
  /** 判别字段：标识为临时章节 */
  isTemporary: true
  /** 子章节 */
  children?: RPChapterSavePayload[]
}

/**
 * 持久章节 Payload（已保存章节）
 *
 * @description
 * 用于表示已保存到服务器的章节。
 * 使用持久 ID（chapterId）作为唯一标识。
 */
export interface RPChapterSavePayloadPersisted
  extends Partial<Pick<RPChapter, 'keywords' | 'writingThought'>>,
    Pick<RPChapter, 'title'>,
    RPChapterIdIdentifier,
    Partial<Pick<RPDetailChapter, 'content' | 'contentType'>> {
  /** 判别字段：标识为持久章节（可选，默认为 false） */
  isTemporary?: false
  /** 子章节 */
  children?: RPChapterSavePayload[]
}

/**
 * 保存时的 chapter 结构（判别联合类型）
 *
 * @description
 * 使用判别联合类型区分临时章节和持久章节。
 * TypeScript 会根据 isTemporary 字段自动进行类型收窄。
 *
 * @example
 * ```typescript
 * function processChapter(chapter: RPChapterSavePayload) {
 *   if (chapter.isTemporary) {
 *     // TypeScript 自动推断为 RPChapterSavePayloadTemp
 *     console.log(chapter.tempId);
 *   } else {
 *     // TypeScript 自动推断为 RPChapterSavePayloadPersisted
 *     console.log(chapter.chapterId);
 *   }
 * }
 * ```
 */
export type RPChapterSavePayload = RPChapterSavePayloadTemp | RPChapterSavePayloadPersisted
