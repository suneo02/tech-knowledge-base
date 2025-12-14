import {
  MessageParsedReportContent,
  RPContentAgentMsg,
  RPContentAgentMsgAI,
  RPContentSubQuestionMessage,
  RPContentSuggestionMessage,
} from '@/types';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { RPChapter } from 'gel-api';
import { AIMessageReportContent } from 'gel-ui';

// 类型映射，将 role 字符串映射到对应的消息类型
export type MessageRoleType = keyof RoleToMessageMap;

type RoleToMessageMap = {
  aiReportContent: AIMessageReportContent;
  suggestion: RPContentSuggestionMessage;
  subQuestion: RPContentSubQuestionMessage;
};

/**
 * 消息筛选条件接口
 */
export interface MessageFilterOptions {
  /** 章节ID列表 */
  chapterIds?: string[];
  /** 消息角色 */
  role?: MessageRoleType;
  /** 是否只返回最新的一条消息 */
  latest?: boolean;
  /** 自定义筛选函数 */
  customFilter?: (message: MessageInfo<MessageParsedReportContent>) => boolean;
}

/**
 * 根据章节筛选消息
 *
 * @param messages 消息列表
 * @param chapters 章节列表
 * @returns 与章节相关的消息列表
 *
 * @example
 * ```typescript
 * const chapterMessages = filterMessagesByChapters(messages, chapters)
 * ```
 */
export const filterMessagesByChapters = (
  messages: MessageInfo<MessageParsedReportContent>[],
  chapters: RPChapter[] | undefined
): MessageInfo<MessageParsedReportContent>[] => {
  if (!chapters || chapters.length === 0) return [];

  const chapterIds = chapters.map((chapter) => String(chapter.chapterId));
  return filterMessagesByChapterIds(messages, chapterIds);
};

/**
 * 根据角色筛选消息
 *
 * @param messages 消息列表
 * @param role 消息角色
 * @returns 指定角色的消息列表
 *
 * @example
 * ```typescript
 * const suggestions = filterMessagesByRole(messages, 'suggestion')
 * ```
 */
export const filterMessagesByRole = <T extends MessageRoleType>(
  messages: MessageInfo<MessageParsedReportContent>[],
  role: T
): MessageInfo<RoleToMessageMap[T]>[] => {
  return messages.filter((msg) => msg.message.role === role) as MessageInfo<RoleToMessageMap[T]>[];
};

/**
 * 根据章节ID筛选消息
 *
 * @param messages 消息列表
 * @param chapterIds 章节ID列表
 * @returns 指定章节的消息列表
 *
 * @example
 * ```typescript
 * const chapterMessages = filterMessagesByChapterIds(messages, ['1', '2'])
 * ```
 */
export const filterMessagesByChapterIds = (
  messages: MessageInfo<MessageParsedReportContent>[],
  chapterIds: string[]
): MessageInfo<MessageParsedReportContent>[] => {
  if (chapterIds.length === 0) return [];
  return messages.filter((msg) => chapterIds.includes(msg.message.chapterId));
};

/**
 * 消息 ID 提取器接口
 */
interface MessageWithId {
  id: string | number;
}

/**
 * 记录多条消息找到时的警告日志
 * @param functionName 函数名
 * @param count 消息数量
 * @param latestMessageId 最新消息ID
 * @param additionalInfo 额外信息
 */
const logMultipleMessagesWarning = (
  functionName: string,
  count: number,
  latestMessageId: string | number,
  additionalInfo: Record<string, any> = {}
): void => {
  console.warn(`[${functionName}] 找到多条消息，已返回最新一条`, {
    count,
    latestMessageId: String(latestMessageId),
    ...additionalInfo,
  });
};

/**
 * 从具有 ID 的消息列表中获取最新的一条消息
 * @param messages 消息列表
 * @param functionName 调用函数名（用于日志）
 * @param additionalLogInfo 额外的日志信息
 * @returns 最新的消息，如果列表为空则返回 undefined
 */
const getLatestFromMessages = <T extends MessageWithId>(
  messages: T[],
  functionName: string,
  additionalLogInfo: Record<string, any> = {}
): T | undefined => {
  if (messages.length === 0) return undefined;

  const latestMessage = messages[messages.length - 1];

  if (messages.length > 1) {
    logMultipleMessagesWarning(functionName, messages.length, latestMessage.id, additionalLogInfo);
  }

  return latestMessage;
};

/**
 * 基础筛选函数（不涉及角色筛选）
 */
const applyBaseFilters = (
  messages: MessageInfo<MessageParsedReportContent>[],
  options: Omit<MessageFilterOptions, 'role'>
): MessageInfo<MessageParsedReportContent>[] => {
  let filteredMessages = messages;

  // 按章节ID筛选
  if (options.chapterIds && options.chapterIds.length > 0) {
    filteredMessages = filterMessagesByChapterIds(filteredMessages, options.chapterIds);
  }

  // 应用自定义筛选
  if (options.customFilter) {
    filteredMessages = filteredMessages.filter(options.customFilter);
  }

  return filteredMessages;
};

/**
 * 通用消息筛选函数
 * @param messages 消息列表
 * @param options 筛选选项
 * @returns 筛选后的消息列表
 *
 * @example
 * ```typescript
 * // 筛选特定章节的建议消息
 * const suggestions = filterMessages(messages, {
 *   chapterIds: ['1', '2'],
 *   role: 'suggestion'
 * })
 *
 * // 使用自定义筛选条件
 * const customMessages = filterMessages(messages, {
 *   customFilter: (msg) => msg.message.content.includes('关键词')
 * })
 * ```
 */

/**
 * 带角色筛选的消息筛选器
 */
function filterMessages<T extends MessageRoleType>(
  messages: MessageInfo<MessageParsedReportContent>[],
  options: Omit<MessageFilterOptions, 'latest'> & { role: T }
): MessageInfo<RoleToMessageMap[T]>[];

/**
 * 不含角色筛选的消息筛选器
 */
function filterMessages(
  messages: MessageInfo<MessageParsedReportContent>[],
  options?: Omit<MessageFilterOptions, 'latest' | 'role'>
): MessageInfo<MessageParsedReportContent>[];

/**
 * 通用消息筛选器实现
 */
function filterMessages<T extends MessageRoleType>(
  messages: MessageInfo<MessageParsedReportContent>[],
  options: Omit<MessageFilterOptions, 'latest'> & { role?: T } = {}
): MessageInfo<RoleToMessageMap[T]>[] | MessageInfo<MessageParsedReportContent>[] {
  try {
    let filteredMessages = applyBaseFilters(messages, options);

    // 按角色筛选
    if (options.role) {
      filteredMessages = filterMessagesByRole(filteredMessages, options.role);
    }

    return filteredMessages;
  } catch (error) {
    console.error('filterMessages error', error);
    return [];
  }
}

export { filterMessages };

/**
 * 获取最新的特定角色消息
 */
function getLatestMessage<T extends MessageRoleType>(
  messages: MessageInfo<MessageParsedReportContent>[],
  options: Omit<MessageFilterOptions, 'latest'> & { role: T }
): MessageInfo<RoleToMessageMap[T]> | undefined;

/**
 * 获取最新的通用消息
 */
function getLatestMessage(
  messages: MessageInfo<MessageParsedReportContent>[],
  options?: Omit<MessageFilterOptions, 'latest' | 'role'>
): MessageInfo<MessageParsedReportContent> | undefined;

/**
 * 获取最新消息的实现
 *
 * @example
 * ```typescript
 * // 获取特定章节的最新建议消息
 * const latestSuggestion = getLatestMessage(messages, {
 *   chapterIds: ['1', '2'],
 *   role: 'suggestion'
 * })
 *
 * // 使用自定义筛选条件获取最新消息
 * const latestCustomMessage = getLatestMessage(messages, {
 *   customFilter: (msg) => msg.message.content.includes('关键词')
 * })
 * ```
 */
function getLatestMessage<T extends MessageRoleType>(
  messages: MessageInfo<MessageParsedReportContent>[],
  options: Omit<MessageFilterOptions, 'latest'> & { role?: T } = {}
): MessageInfo<RoleToMessageMap[T]> | MessageInfo<MessageParsedReportContent> | undefined {
  if (options.role) {
    // 有角色筛选的情况
    const filteredMessages = filterMessages(messages, { ...options, role: options.role });
    return getLatestFromMessages(filteredMessages, 'getLatestMessage', { options });
  } else {
    // 无角色筛选的情况
    const filteredMessages = filterMessages(messages, options);
    return getLatestFromMessages(filteredMessages, 'getLatestMessage', { options });
  }
}

export { getLatestMessage };

/**
 * 获取指定章节和角色的最新消息
 *
 * @param messages 消息列表
 * @param chapters 章节列表
 * @param role 消息角色
 * @returns 最新的消息，如果没有找到则返回 undefined
 *
 * @example
 * ```typescript
 * const latestSuggestion = getLatestMessageByChapterRole(messages, chapters, 'suggestion')
 * ```
 */
export const getLatestMessageByChapterRole = <T extends MessageRoleType>(
  messages: MessageInfo<MessageParsedReportContent>[],
  chapters: RPChapter[] | undefined,
  role: T
): MessageInfo<RoleToMessageMap[T]> | undefined => {
  if (!chapters || chapters.length === 0) return undefined;

  const chapterIds = chapters.map((chapter) => String(chapter.chapterId));

  return getLatestMessage(messages, { chapterIds, role });
};

/**
 * 获取指定章节ID和角色的最新消息
 *
 * @param messages 消息列表
 * @param chapterId 章节ID
 * @param role 消息角色
 * @returns 最新的消息，如果没有找到则返回 undefined
 *
 * @example
 * ```typescript
 * const latestContent = getLatestMessageByChapterIdRole(messages, '1', 'aiReportContent')
 * ```
 */
export const getLatestMessageByChapterIdRole = <T extends MessageRoleType>(
  messages: MessageInfo<MessageParsedReportContent>[],
  chapterId: string,
  role: T
): MessageInfo<RoleToMessageMap[T]> | undefined => {
  return getLatestMessage(messages, { chapterIds: [chapterId], role });
};

/**
 * 从 Agent 消息列表中获取指定章节的最新 AI 消息
 * 用于状态判断，直接使用原始 Agent 消息而不是解析后的消息
 *
 * @param messages Agent 消息列表
 * @param chapterId 章节ID
 * @returns 最新的 AI Agent 消息，如果没有找到则返回 undefined
 *
 * @example
 * ```typescript
 * const latestAgentMsg = getLatestAgentMessageByChapterId(agentMessages, '1')
 * ```
 */
export const getLatestAgentMessageByChapterId = (
  messages: MessageInfo<RPContentAgentMsg>[],
  chapterId: string
): MessageInfo<RPContentAgentMsgAI> | undefined => {
  // 筛选出指定章节的 AI 消息
  const filteredMessages = messages.filter(
    (msg) => msg.message.role === 'ai' && msg.message.chapterId === chapterId
  ) as MessageInfo<RPContentAgentMsgAI>[];

  return getLatestFromMessages(filteredMessages, 'getLatestAgentMessageByChapterId', { chapterId });
};
