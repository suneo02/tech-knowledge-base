/**
 * AIGC Reducers 统一导出
 *
 * 将所有 AIGC 相关的 reducers 合并导出
 */

import { chapterOperationReducers } from './chapterOperation';
import { chapterRegenerationReducers } from './chapterRegeneration';
import { fullGenerationReducers, multiChapterGenerationReducers } from './generation';
import { textRewriteReducers } from './textRewrite';

/**
 * 所有 AIGC 相关的 reducers
 */
export const aigcReducers = {
  // 章节操作编排（启动、请求管理）
  ...chapterOperationReducers,

  // 全文生成
  ...fullGenerationReducers,

  // 多章节顺序生成
  ...multiChapterGenerationReducers,

  // 单章节重生成
  ...chapterRegenerationReducers,

  // 文本改写
  ...textRewriteReducers,
};

// 导出类型
export type { StartTextRewritePayload } from './textRewrite';
