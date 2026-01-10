/**
 * 大纲文件状态轮询 Hook
 *
 * @description
 * 集成 useFileStatusPolling，为大纲会话提供文件状态轮询功能
 * 自动从消息中提取待解析文件，并更新文件状态到 Context
 *
 * @see [../../docs/specs/outline-file-status-polling/spec-design-v1.md](../../docs/specs/outline-file-status-polling/spec-design-v1.md)
 * @see [../../src/hooks/useFileStatusPolling.ts](../../src/hooks/useFileStatusPolling.ts)
 *
 * @example
 * ```tsx
 * const OutlineFilePollingController = () => {
 *   useOutlineFilePolling();
 *   return null;
 * };
 * ```
 */

import { useRPOutlineContext } from '@/context';
import { extractPollingFileIdsFromOutlineMessages } from '@/domain/file';
import { useCallback, useMemo } from 'react';
import { FileStatusUpdate, useFileStatusPolling } from '../useFileStatusPolling';

/**
 * 大纲文件轮询 Hook
 *
 * @description
 * 自动从大纲消息中提取待解析文件并进行轮询
 * 轮询结果会自动更新到 Context 中的消息状态
 */
export const useOutlineFilePolling = () => {
  const { agentMessages, updateFileStatus } = useRPOutlineContext();

  // 从消息中提取需要轮询的文件 ID
  const pendingFileIds = useMemo(() => {
    return extractPollingFileIdsFromOutlineMessages(agentMessages);
  }, [agentMessages]);

  /**
   * 处理文件状态更新
   *
   * @description
   * 通过 Context 提供的方法批量更新文件状态
   */
  const handleStatusUpdate = useCallback(
    (statusUpdates: FileStatusUpdate[]) => {
      // 创建状态映射表
      const statusMap = new Map(statusUpdates.map((update) => [update.fileId, update.status]));

      // 通过 Context 方法更新文件状态
      updateFileStatus(statusMap);
    },
    [updateFileStatus]
  );

  // 使用文件状态轮询 Hook
  const pollingResult = useFileStatusPolling({
    pendingFileIds,
    onStatusUpdate: handleStatusUpdate,
    config: {
      pollingInterval: 3000,
      pollingWhenHidden: true,
      retryCount: 3,
      debounceWait: 300,
    },
  });

  return pollingResult;
};
