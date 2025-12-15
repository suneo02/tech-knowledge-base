import { useCallback } from 'react';
import { RPOutlineChatSenderCB, SendMessageData } from '../type';
import { useFileReferenceParser } from './useFileReferenceParser';

/**
 * 消息发送Hook配置
 */
export interface UseSendMessageConfig {
  /** 发送消息回调 */
  sendMessage: RPOutlineChatSenderCB;
  /** 取消回调 */
  onCancel?: () => void;
  /** 是否加载中 */
  isLoading?: boolean;
}

/**
 * 消息发送Hook返回值
 */
export interface UseSendMessageResult {
  /** 发送消息处理函数 */
  handleSend: (data: SendMessageData) => void;
}

/**
 * 消息发送Hook
 * 封装消息发送的业务逻辑
 */
export const useSendMessage = ({
  sendMessage,
  onCancel,
  isLoading = false,
}: UseSendMessageConfig): UseSendMessageResult => {
  const { validateFileReferences } = useFileReferenceParser();

  const handleSend = useCallback(
    ({ message, files, refFiles }: SendMessageData) => {
      try {
        const messageContent = message.trim();

        if (!isLoading && messageContent) {
          // 发送所有上传的文件和引用的文件信息
          sendMessage({ content: messageContent, files, refFiles });
        } else {
          onCancel?.();
        }
      } catch (error) {
        console.error('Error sending message:', error);
        onCancel?.();
      }
    },
    [isLoading, sendMessage, onCancel, validateFileReferences]
  );

  return {
    handleSend,
  };
};
