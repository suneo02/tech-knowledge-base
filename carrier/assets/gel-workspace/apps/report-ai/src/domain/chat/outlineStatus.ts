/**
 * 大纲状态检测工具函数
 *
 * @description 用于检测大纲是否存在、是否已确认等状态
 * @since 1.0.0
 */

import { RPOutlineMsgParsed } from '@/types/chat/RPOutline';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';

/**
 * 检查消息列表中是否存在大纲
 *
 * @description 遍历解析后的消息，查找是否有大纲预览或编辑器消息
 * @param parsedMessages 解析后的消息列表
 * @returns 是否存在大纲
 */
export const hasOutlineInMessages = (parsedMessages: MessageInfo<RPOutlineMsgParsed>[]): boolean => {
  return parsedMessages.some((message) => {
    const content = message.message;

    // 检查是否为大纲预览消息且有内容
    if (content?.role === 'outlinePreview' && content.content) {
      return true;
    }

    // 检查是否为大纲编辑器消息且有内容
    if (content?.role === 'outlineEditor' && content.content) {
      return true;
    }

    return false;
  });
};

/**
 * 检查大纲是否已确认
 *
 * @description 检查消息中的大纲是否已经被用户确认
 * 目前基于消息状态判断，后续可能需要扩展为专门的确认状态
 * @param parsedMessages 解析后的消息列表
 * @returns 是否已确认
 */
export const getIsOutlineConfirmed = (parsedMessages: MessageInfo<RPOutlineMsgParsed>[]): boolean => {
  // 查找最后一个大纲相关消息
  const lastOutlineMessage = [...parsedMessages].reverse().find((message) => {
    const content = message.message;
    return content?.role === 'outlinePreview' || content?.role === 'outlineEditor';
  });

  if (!lastOutlineMessage) {
    return false;
  }

  // 检查消息状态是否为完成状态
  // 这里假设完成状态表示用户已确认
  const content = lastOutlineMessage.message;
  if (content && 'status' in content) {
    return content.status === 'finish' || content.status === 'stream_finish';
  }

  return false;
};
