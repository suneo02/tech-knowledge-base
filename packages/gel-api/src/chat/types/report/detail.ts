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
  contentType?: 'md' | 'html'
  files?: RPFileTraced[]
  refData?: DPUItem[]
  refSuggest?: RAGItem[]
  traceContent?: ChatTraceItem[]
  children?: RPDetailChapter[]
}

/**
 * 保存时的 chapter 结构
 */

export interface RPChapterSavePayload
  extends Partial<Pick<RPChapter, 'keywords' | 'writingThought'>>,
    Pick<RPChapter, 'title'>,
    RPChapterPayloadTempIdentifier,
    RPChapterPayloadTempIdIdentifier,
    Partial<RPChapterIdIdentifier>,
    Partial<Pick<RPDetailChapter, 'content' | 'contentType'>> {
  children?: RPChapterSavePayload[]
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
