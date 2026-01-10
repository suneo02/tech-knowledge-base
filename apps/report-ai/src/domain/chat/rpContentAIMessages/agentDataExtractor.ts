/**
 * Agent 消息数据提取工具
 *
 * 从 Agent 消息中提取各种数据字段，用于更新章节内容
 */

import { RPContentAgentMsgAI } from '@/types';
import type { ChatEntityRecognize, ChatTraceItem, RPFileTraced, WithDPUList, WithRAGList } from 'gel-api';

/**
 * 从 Agent 消息中提取的数据
 */
export interface ExtractedAgentData {
  /** 消息内容 */
  content: string;
  /** DPU 列表 */
  dpuList?: WithDPUList['dpuList'];
  /** RAG 列表 */
  ragList?: WithRAGList['ragList'];
  /** 实体识别结果 */
  entities?: ChatEntityRecognize[];
  /** 追踪数据 */
  traces?: ChatTraceItem[];
  /** 引用文件 */
  files?: RPFileTraced[];
}

/**
 * 从 Agent AI 消息中提取所有相关数据
 *
 * @param message Agent AI 消息
 * @returns 提取的数据
 *
 * @example
 * ```typescript
 * const data = extractDataFromAgentMessage(aiMessage);
 * chapter.content = data.content;
 * chapter.entities = data.entities;
 * ```
 */
export const extractDataFromAgentMessage = (message: RPContentAgentMsgAI): ExtractedAgentData => {
  const data: ExtractedAgentData = {
    content: message.content || '',
  };

  // 提取 DPU 数据
  if ('dpuList' in message && message.dpuList) {
    data.dpuList = message.dpuList;
  }

  // 提取 RAG 数据
  if ('ragList' in message && message.ragList) {
    data.ragList = message.ragList;
  }

  // 提取实体数据
  if ('entity' in message && message.entity) {
    data.entities = message.entity;
  }

  // 提取追踪数据
  if ('traces' in message && message.traces) {
    data.traces = message.traces;
  }

  // 提取文件数据
  if ('reportData' in message && message.reportData?.file) {
    data.files = message.reportData.file;
  }

  return data;
};

/**
 * 检查提取的数据是否包含引用数据
 *
 * @param data 提取的数据
 * @returns 是否包含引用数据
 */
export const hasRefData = (data: ExtractedAgentData): boolean => {
  return !!(data.dpuList || data.ragList || data.entities || data.traces || data.files);
};
