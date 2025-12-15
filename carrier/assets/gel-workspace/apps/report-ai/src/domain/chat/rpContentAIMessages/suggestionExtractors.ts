import { RPContentSuggestionMessage } from '@/types';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { DPUItem, RAGItem, RPFileTraced } from 'gel-api';

/**
 * 从建议消息中提取引用表格数据
 */
export function extractDPUFromSuggestionMessages(
  suggestionMessages: MessageInfo<RPContentSuggestionMessage> | undefined
): DPUItem[];
export function extractDPUFromSuggestionMessages(
  suggestionMessages: MessageInfo<RPContentSuggestionMessage>[] | undefined
): DPUItem[][];
export function extractDPUFromSuggestionMessages(
  suggestionMessages: MessageInfo<RPContentSuggestionMessage> | MessageInfo<RPContentSuggestionMessage>[] | undefined
): DPUItem[] | DPUItem[][] {
  try {
    if (!suggestionMessages) return [];
    if (!Array.isArray(suggestionMessages)) {
      return suggestionMessages.message.content.dpuList || [];
    }
    return suggestionMessages.map((msg) => msg.message.content.dpuList || []);
  } catch (error) {
    console.error('extractDPUFromSuggestionMessages error', error);
    return Array.isArray(suggestionMessages) ? [] : [];
  }
}

/**
 * 从建议消息中提取引用建议数据
 */
export function extractRAGFromSuggestionMessages(
  suggestionMessages: MessageInfo<RPContentSuggestionMessage> | undefined
): RAGItem[];
export function extractRAGFromSuggestionMessages(
  suggestionMessages: MessageInfo<RPContentSuggestionMessage>[] | undefined
): RAGItem[][];
export function extractRAGFromSuggestionMessages(
  suggestionMessages: MessageInfo<RPContentSuggestionMessage> | MessageInfo<RPContentSuggestionMessage>[] | undefined
): RAGItem[] | RAGItem[][] {
  try {
    if (!suggestionMessages) return [];
    if (!Array.isArray(suggestionMessages)) {
      return suggestionMessages.message.content.ragList || [];
    }
    return suggestionMessages.map((msg) => msg.message.content.ragList || []);
  } catch (error) {
    console.error('extractRAGFromSuggestionMessages error', error);
    return Array.isArray(suggestionMessages) ? [] : [];
  }
}

/**
 * 从建议消息中提取引用文件数据
 */
export function extractRefFilesFromSuggestionMessages(
  suggestionMessages: MessageInfo<RPContentSuggestionMessage> | undefined
): RPFileTraced[];
export function extractRefFilesFromSuggestionMessages(
  suggestionMessages: MessageInfo<RPContentSuggestionMessage>[] | undefined
): RPFileTraced[][];
export function extractRefFilesFromSuggestionMessages(
  suggestionMessages: MessageInfo<RPContentSuggestionMessage> | MessageInfo<RPContentSuggestionMessage>[] | undefined
): RPFileTraced[] | RPFileTraced[][] {
  try {
    if (!suggestionMessages) return [];
    if (!Array.isArray(suggestionMessages)) {
      return suggestionMessages.message.content.files || [];
    }
    return suggestionMessages.map((msg) => msg.message.content.files || []);
  } catch (error) {
    console.error('extractRefFilesFromSuggestionMessages error', error);
    return Array.isArray(suggestionMessages) ? [] : [];
  }
}
