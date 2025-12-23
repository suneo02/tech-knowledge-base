// 常量导出
export { SOURCE_MARKER_CONSTANTS } from './convertSourceMarkersToHtml'
export { VALID_CHAT_SUGGEST_SOURCE_TYPES } from './filterTracesByValidSource'
export { SOURCE_MARKER_FORMAT, SOURCE_MARKER_PATTERN } from './sourceMarkerUtils'

// 类型导出
export type { ConvertSourceMarkersOptions, SourceMarkerHtmlGenerator } from './convertSourceMarkersToHtml'
export type { FormatAIAnswerParams } from './formatAIAnswer'
export type { EntityRecognition } from './insertEntityMarkdownLinks'
export type { InsertPoint, SourceMarker, SourcePosition } from './sourceMarkerUtils'

// 函数导出（新命名）
export { appendModelTypeInfo } from './appendModelTypeInfo'
export { convertNerLinksToHtml } from './convertNerLinksToHtml'
export { convertSourceMarkersToHtml } from './convertSourceMarkersToHtml'
export { filterTracesByValidSource } from './filterTracesByValidSource'
export { formatAIAnswerFull, formatAIAnswerWithEntities } from './formatAIAnswer'
export { insertEntityMarkdownLinks } from './insertEntityMarkdownLinks'
export { insertTraceMarkers } from './insertTraceMarkers'
export { stripMarkdownAndTraces } from './stripMarkdownAndTraces'

// 工具函数导出
export {
  batchInsert,
  buildSourceMarker,
  formatPositions,
  normalizePositions,
  parsePositions,
} from './sourceMarkerUtils'
