/**
 * 章节类型守卫函数
 *
 * @description
 * 提供类型守卫（Type Guard）函数，用于在运行时判断章节类型，
 * 并触发 TypeScript 的类型收窄（Type Narrowing）。
 *
 * @module chapter/guards
 */

import type { RPChapterSavePayload, RPChapterSavePayloadPersisted, RPChapterSavePayloadTemp } from 'gel-api';

/**
 * 判断是否为临时章节
 *
 * @description
 * 类型守卫函数，用于判断章节是否为临时章节（新增，未保存）。
 * 使用后 TypeScript 会自动将类型收窄为 RPChapterSavePayloadTemp。
 *
 * @param chapter - 章节 Payload
 * @returns 是否为临时章节
 *
 * @example
 * ```typescript
 * if (isTempChapter(chapter)) {
 *   // TypeScript 自动推断为 RPChapterSavePayloadTemp
 *   console.log(chapter.tempId);
 * }
 * ```
 */
export function isTempChapter(chapter: RPChapterSavePayload): chapter is RPChapterSavePayloadTemp {
  return chapter.isTemporary === true && 'tempId' in chapter;
}

/**
 * 判断是否为持久章节
 *
 * @description
 * 类型守卫函数，用于判断章节是否为持久章节（已保存）。
 * 使用后 TypeScript 会自动将类型收窄为 RPChapterSavePayloadPersisted。
 *
 * @param chapter - 章节 Payload
 * @returns 是否为持久章节
 *
 * @example
 * ```typescript
 * if (isPersistedChapter(chapter)) {
 *   // TypeScript 自动推断为 RPChapterSavePayloadPersisted
 *   console.log(chapter.chapterId);
 * }
 * ```
 */
export function isPersistedChapter(chapter: RPChapterSavePayload): chapter is RPChapterSavePayloadPersisted {
  return !chapter.isTemporary && 'chapterId' in chapter;
}
