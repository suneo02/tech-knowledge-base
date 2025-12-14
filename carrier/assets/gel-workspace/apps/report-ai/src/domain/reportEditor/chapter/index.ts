// 章节渲染
export {
  assembleChapterHtml,
  createChapterTitleHtml,
  generateLoadingHTML,
  renderChapter,
  renderContentFromChapter,
  renderContentFromMessage,
  type AssembleChapterHtmlOptions,
  type RenderChapterOptions,
} from './render';

// 章节内容合成
export { createChapterAIMessageStatusMap, createChapterStreamPreviewMap } from './composition';

// 章节片段解析
export { parseChapterContent, type ParsedChapterContent } from './parse';

// 章节操作
export { applyStreamingUpdate, setChapterContent } from './ops';

// 章节查询
export { findChapterDOM, findChapterDOMById, type ChapterDOMResult } from './query';
