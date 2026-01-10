/**
 * 消息合并工具
 *
 * 负责将 AI 生成完成后的 Agent 消息合并到章节的 Canonical Layer
 * 实现"流式显示 → 消息合并 → 闸门注水"数据流的关键环节
 */

import { RPContentAgentMsg } from '@/types';
import type { MessageInfo } from '@ant-design/x/es/use-x-chat';
import type { RPDetailChapter } from 'gel-api';
import { extractDataFromAgentMessage } from './agentDataExtractor';
import { getLatestAgentMessageByChapterId } from './messageFilter';

/**
 * 处理单个章节的消息合并
 *
 * @param chapter 章节数据（会被原地修改）
 * @param messages Agent 消息列表（原始消息，包含 entity 和 traces）
 * @returns 是否合并成功
 */
export const mergeMessagesToChapter = (
  chapter: RPDetailChapter,
  messages: MessageInfo<RPContentAgentMsg>[]
): boolean => {
  const chapterId = String(chapter.chapterId);

  // 使用 domain 层的工具函数获取最新 AI Agent 消息
  const latestAIMessage = getLatestAgentMessageByChapterId(messages, chapterId);

  if (!latestAIMessage) {
    return false;
  }

  const aiMessage = latestAIMessage.message;

  // 检查消息是否已完成
  if (aiMessage.status !== 'finish') {
    return false;
  }

  // 使用 domain 层的工具函数提取数据
  const extractedData = extractDataFromAgentMessage(aiMessage);

  // 更新章节内容
  chapter.content = extractedData.content;
  chapter.contentType = 'markdown';

  // 更新引用数据
  if (extractedData.dpuList) {
    chapter.refData = extractedData.dpuList;
  }
  if (extractedData.ragList) {
    chapter.refSuggest = extractedData.ragList;
  }

  // 更新实体和追踪数据
  if (extractedData.entities) {
    chapter.entities = extractedData.entities;
  }
  if (extractedData.traces) {
    chapter.traceContent = extractedData.traces;
  }

  // 更新文件数据
  if (extractedData.files) {
    chapter.files = extractedData.files;
  }

  return true;
};
