/**
 * RPOutline 聊天消息解析器
 *
 * @description 提供 RPOutline 聊天消息的解析功能，将原始消息转换为可渲染的消息组件
 * @since 1.0.0
 */

import { createUserMessageWithFiles } from '@/domain/chat';
import { RPOutlineAgentMsg, RPOutlineAgentMsgAI } from '@/types';
import { RPOutlineMsgParsed, RPOutlineSendInput } from '@/types/chat/RPOutline';
import { XChatConfig } from '@ant-design/x/es/use-x-chat';
import {
  createAIContentMessage,
  createAIHeaderMessage,
  createSubQuestionMessage,
  createSuggestionMessage,
} from 'gel-ui';
import { FC } from 'react';
import { RPOutlineAIFooter } from '../AIFooter';
import { createOutlineEditorMessage, createOutlinePreviewMessage } from './outline';

/**
 * 创建 AI Footer 组件
 *
 * @description 创建包含发送消息功能的 AI Footer 组件
 * @param sendMessage 发送消息的回调函数
 * @param isLastMessage 是否为最后一条消息
 * @returns AI Footer 组件
 */
function createAIFooterComponent(
  sendMessage?: (messageInput: RPOutlineSendInput) => void,
  isLastMessage: boolean = true
): FC<{ content: string; agentMessage: RPOutlineAgentMsgAI }> {
  return (props: { content: string; agentMessage: RPOutlineAgentMsgAI }) => (
    <RPOutlineAIFooter
      {...props}
      isLastMessage={isLastMessage}
      sendMessage={(message, options) =>
        sendMessage?.({
          content: message,
          clientType: 'aireport',
          agentId: options?.agentId,
          think: options?.think,
          entityCode: options?.entityCode,
        })
      }
    />
  );
}

/**
 * 创建 RPOutline 聊天消息解析器
 *
 * @description 创建用于解析 RPOutline 聊天消息的解析器函数
 * @param sendMessage 发送消息的回调函数，用于实现重试功能
 * @param getIsLastMessage 获取是否为最后一条消息的函数
 * @returns 消息解析器函数
 */
export function createRPOutlineMessageParser(
  sendMessage?: (messageInput: RPOutlineSendInput) => void,
  getIsLastMessage?: (agentMessage: RPOutlineAgentMsgAI) => boolean
): NonNullable<XChatConfig<RPOutlineAgentMsg, RPOutlineMsgParsed>['parser']> {
  // 返回解析器函数
  return (agentMessage: RPOutlineAgentMsg): RPOutlineMsgParsed[] => {
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

    // 处理AI内容
    const isLastMessage = getIsLastMessage?.(agentMessage) ?? true;
    const AIFooterComponent = createAIFooterComponent(sendMessage, isLastMessage);
    const aiContentMessage = createAIContentMessage(agentMessage, AIFooterComponent);
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
      // 处理大纲消息：只有最后一条 agent msg 显示编辑模式，其余显示预览模式
      if (agentMessage.reportData?.outline) {
        if (isLastMessage) {
          // 最后一条消息：使用编辑器模式
          const outlineEditorMessage = createOutlineEditorMessage(agentMessage);
          if (outlineEditorMessage) {
            messageList.push(outlineEditorMessage);
          }
        } else {
          // 非最后一条消息：使用预览模式
          const outlinePreviewMessage = createOutlinePreviewMessage(agentMessage);
          if (outlinePreviewMessage) {
            messageList.push(outlinePreviewMessage);
          }
        }
      }
    }

    return messageList;
  };
}
