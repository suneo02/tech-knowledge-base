/**
 * Sender组件相关Hooks统一导出
 */

// 聊天文件管理器 - Facade模式统一入口
export { useChatFileManager } from './useChatFileManager';
export type { UseChatFileManagerResult } from './useChatFileManager';

// 聊天文件集合 - 专门处理文件上传状态
export { useChatFileCollection } from './useChatFileCollection';
export type { UseChatFileCollectionResult } from './useChatFileCollection';

// 文件引用管理器 - 专门处理文件引用
export { useFileReferenceManager } from './useFileReferenceManager';
export type { UseFileReferenceManagerResult } from './useFileReferenceManager';

// 文件建议
export { useFileSuggestion } from './useFileSuggestion';
export type { FileSuggestionItem, UseFileSuggestionConfig, UseFileSuggestionResult } from './useFileSuggestion';

// 消息发送
export { useSendMessage } from './useSendMessage';
export type { UseSendMessageConfig, UseSendMessageResult } from './useSendMessage';

// 文件引用解析器
export { useFileReferenceParser } from './useFileReferenceParser';
