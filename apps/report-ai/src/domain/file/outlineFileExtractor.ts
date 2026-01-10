/**
 * 大纲文件提取领域逻辑
 *
 * @description
 * 从大纲消息中提取待解析的文件 ID 列表
 * 支持 files 和 refFiles 两种类型
 *
 * @see [../../docs/specs/outline-file-status-polling/spec-design-v1.md](../../docs/specs/outline-file-status-polling/spec-design-v1.md)
 */

import { RPOutlineAgentMsg } from '@/types/chat/RPOutline';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { isReportFileStatusMutable } from './fileStatus';

/**
 * 从大纲消息列表中提取需要轮询状态的文件 ID
 *
 * @description
 * 遍历消息列表，提取所有处于可变状态（需要轮询）的文件 ID
 * 包括 files 和 refFiles 两种类型
 *
 * @param messages - 大纲消息列表
 * @returns 需要轮询的文件 ID 列表（去重）
 */
export const extractPollingFileIdsFromOutlineMessages = (messages: MessageInfo<RPOutlineAgentMsg>[]): string[] => {
  const pendingFileIds = new Set<string>();

  messages.forEach((messageInfo) => {
    const message = messageInfo.message;

    // 处理消息中的文件
    if ('files' in message && message.files) {
      message.files.forEach((file) => {
        // 如果文件没有 status 或状态可变，则需要轮询
        const status = 'status' in file ? file.status : undefined;
        if (isReportFileStatusMutable(status)) {
          pendingFileIds.add(file.fileId);
        }
      });
    }

    // 处理消息中的引用文件
    if ('refFiles' in message && message.refFiles) {
      message.refFiles.forEach((file) => {
        // 如果文件没有 status 或状态可变，则需要轮询
        const status = 'status' in file ? file.status : undefined;
        if (isReportFileStatusMutable(status)) {
          pendingFileIds.add(file.fileId);
        }
      });
    }
  });

  return Array.from(pendingFileIds);
};
