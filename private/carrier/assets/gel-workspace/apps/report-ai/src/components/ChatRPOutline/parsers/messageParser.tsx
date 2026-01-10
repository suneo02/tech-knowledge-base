/**
 * RPOutline 聊天消息解析器
 *
 * @description 提供 RPOutline 聊天消息的解析功能，将原始消息转换为可渲染的消息组件
 * @since 1.0.0
 */

import { createUserMessageWithFiles } from '@/domain/chat';
import { RPOutlineAgentMsg, RPOutlineAgentMsgAI } from '@/types';
import { RPOutlineMsgParsed, RPOutlineProgressMessage } from '@/types/chat/RPOutline';
import {
  createAIContentMessage,
  createAIHeaderMessage,
  createSubQuestionMessage,
  createSuggestionMessage,
} from 'gel-ui';
import { RPOutlineAIFooter } from '../AIFooter';
import { createOutlineMessage } from './outline';

/**
 * 创建进度消息
 *
 * @description 用于展示 AIGC 生成进度
 * @param agentMessage AI 消息对象
 * @returns 进度消息对象，如果没有进度信息则返回 null
 */
function createProgressMessage(agentMessage: RPOutlineAgentMsgAI): RPOutlineProgressMessage | null {
  if (!agentMessage.progress) {
    return null;
  }

  // 只在 pending 状态展示进度
  if (agentMessage.status !== 'pending') {
    return null;
  }

  return {
    role: 'progress',
    content: agentMessage.progress,
    status: 'pending',
  };
}

/**
 * RPOutline 聊天消息解析器
 *
 * @description 解析 RPOutline 聊天消息，将原始消息转换为可渲染的消息组件
 * @param agentMessage 原始消息对象
 * @returns 解析后的消息列表
 */
export const parseRPOutlineMessage = (agentMessage: RPOutlineAgentMsg): RPOutlineMsgParsed[] => {
  // 处理用户消息
  if (agentMessage.role === 'user') {
    return [createUserMessageWithFiles(agentMessage)];
  }

  // 处理 AI 消息
  const messageList: RPOutlineMsgParsed[] = [createAIHeaderMessage(agentMessage)];

  // 处理子问题
  const subQuestionMessage = createSubQuestionMessage(agentMessage);
  if (subQuestionMessage) {
    messageList.push(subQuestionMessage);
  }

  // 处理进度信息
  const progressMessage = createProgressMessage(agentMessage);
  if (progressMessage) {
    messageList.push(progressMessage);
  }

  // 处理AI内容
  const aiContentMessage = createAIContentMessage(agentMessage, RPOutlineAIFooter);
  if (aiContentMessage) {
    messageList.push(aiContentMessage);
  }

  // 处理建议
  const suggestionMessage = createSuggestionMessage(agentMessage);
  if (suggestionMessage) {
    messageList.push(suggestionMessage);
  }

  // 处理完成状态的消息
  if (agentMessage.status === 'stream_finish' || agentMessage.status === 'finish') {
    // 处理大纲消息：统一创建 outline 消息，由组件内部根据 context 判断是否为最后一条
    if (agentMessage.reportData?.outline) {
      const outlineMessage = createOutlineMessage(agentMessage);
      if (outlineMessage) {
        messageList.push(outlineMessage);
      }
    }
  }

  return messageList;
};
