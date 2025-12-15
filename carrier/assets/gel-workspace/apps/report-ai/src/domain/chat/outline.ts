import { RPOutlineAgentMsg, RPOutlineMsgParsed } from '@/types';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { ReportOutlineData } from 'gel-api';

/**
 * 从解析消息中获取大纲数据
 * @param parsedMessages 解析后的消息数组
 * @returns 大纲树数据，如果没有找到则返回 undefined
 */
export function getOutlineTreeByParsedMessages(
  parsedMessages: MessageInfo<RPOutlineMsgParsed>[] | undefined
): ReportOutlineData | undefined {
  try {
    if (!parsedMessages || parsedMessages.length === 0) return undefined;

    // 查找最新的大纲编辑器消息
    for (let i = parsedMessages.length - 1; i >= 0; i--) {
      const message = parsedMessages[i];
      if (message.message.role === 'outlineEditor' && message.message.content) {
        return message.message.content;
      }
    }

    return undefined;
  } catch (error) {
    console.error('getOutlineTreeByParsedMessages error', error);
    return undefined;
  }
}

/**
 * 检查解析消息中是否包含大纲数据
 * @param parsedMessages 解析后的消息数组
 * @returns 是否包含大纲数据
 */
export function hasOutlineByAgentMessages(parsedMessages: MessageInfo<RPOutlineAgentMsg>[] | undefined): boolean {
  try {
    if (!parsedMessages || parsedMessages.length === 0) return false;

    // 检查是否有大纲结构
    return parsedMessages.some(
      (message) =>
        message.message.role === 'ai' &&
        (message.message.status === 'stream_finish' || message.message.status === 'finish') &&
        message.message.reportData?.outline
    );
  } catch (error) {
    console.error('hasOutlineByParsedMessages error', error);
    return false;
  }
}

/**
 * 从解析消息中获取大纲名称
 * @param parsedMessages 解析后的消息数组
 * @returns 大纲名称，如果没有找到则返回空字符串
 */
export function getOutlineNameByParsedMessages(parsedMessages: MessageInfo<RPOutlineMsgParsed>[] | undefined): string {
  try {
    const outlineTree = getOutlineTreeByParsedMessages(parsedMessages);
    return outlineTree?.outlineName || '';
  } catch (error) {
    console.error('getOutlineNameByParsedMessages error', error);
    return '';
  }
}

/**
 * 从解析消息中获取大纲章节列表
 * @param parsedMessages 解析后的消息数组
 * @returns 章节列表，如果没有找到则返回空数组
 */
export function getOutlineChaptersByParsedMessages(
  parsedMessages: MessageInfo<RPOutlineMsgParsed>[] | undefined
): ReportOutlineData['chapters'] {
  try {
    const outlineTree = getOutlineTreeByParsedMessages(parsedMessages);
    return outlineTree?.chapters || [];
  } catch (error) {
    console.error('getOutlineChaptersByParsedMessages error', error);
    return [];
  }
}
