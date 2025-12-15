/**
 * 章节渲染状态（轻量级派生数据）
 *
 * @description 从选择器层派生的章节渲染状态，不再使用中间类型
 * 直接通过 selectChapterHtmlMap 和 selectChapterStatusMap 获取
 * @since 1.1.0
 */
export type ChapterGenerationStatus = 'idle' | 'pending' | 'receiving' | 'finish';
