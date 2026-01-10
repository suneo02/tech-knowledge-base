/**
 * 文件状态轮询 Hook
 *
 * @description
 * 使用 ahooks 的 useRequest 实现文件解析状态的轮询功能。
 * 当有文件正在解析时（status !== FINISHED），自动轮询获取最新状态。
 *
 * 这是一个抽象的 Hook，不直接依赖 Redux，通过参数和回调与外部状态管理集成。
 *
 * @see [../../docs/shared/file-status-polling.md](../../docs/shared/file-status-polling.md) - 文件状态轮询设计文档
 * @see [../../apps/report-ai/docs/specs/file-management/spec-design-v1.md](../../apps/report-ai/docs/specs/file-management/spec-design-v1.md) - 文件管理页面设计
 * @see [../../src/domain/file/fileStatus.ts](../../src/domain/file/fileStatus.ts) - 文件状态判断逻辑
 *
 * @example
 * ```tsx
 * const { isPolling, pendingCount } = useFileStatusPolling({
 *   pendingFileIds: ['file1', 'file2'],
 *   onStatusUpdate: (statuses) => {
 *     // 更新状态到 Redux 或其他状态管理
 *   }
 * });
 * ```
 */

import { useRequest } from 'ahooks';
import { RPFileStatus } from 'gel-api';
import { useCallback, useEffect } from 'react';
import { createChatRequest } from '../api';

export interface FileStatusUpdate {
  fileId: string;
  status: RPFileStatus;
}

/**
 * 轮询配置选项
 */
export interface FileStatusPollingConfig {
  /** 轮询间隔（毫秒），默认 3000 */
  pollingInterval?: number;
  /** 是否在页面隐藏时停止轮询，默认 false */
  pollingWhenHidden?: boolean;
  /** 错误重试次数，默认 3 */
  retryCount?: number;
  /** 防抖等待时间（毫秒），默认 300 */
  debounceWait?: number;
}

/**
 * 轮询 Hook 参数
 */
export interface UseFileStatusPollingOptions {
  /** 待处理的文件 ID 列表 */
  pendingFileIds: string[];
  /** 状态更新回调 */
  onStatusUpdate?: (statuses: FileStatusUpdate[]) => void;
  /** 轮询配置 */
  config?: FileStatusPollingConfig;
}

/**
 * 默认轮询配置
 */
const DEFAULT_POLLING_CONFIG: Required<FileStatusPollingConfig> = {
  pollingInterval: 3000,
  pollingWhenHidden: false,
  retryCount: 3,
  debounceWait: 300,
};

/**
 * 文件状态轮询 Hook
 *
 * @param options - 轮询选项
 * @returns 轮询状态和控制方法
 */
export const useFileStatusPolling = (options: UseFileStatusPollingOptions) => {
  const { pendingFileIds, onStatusUpdate, config = {} } = options;
  const pollingConfig = { ...DEFAULT_POLLING_CONFIG, ...config };

  /**
   * 获取文件状态的 API 调用
   *
   * @description
   * 只查询未完成的文件状态，解析完成的文件会自动从轮询列表中移除。
   * 这样可以减少不必要的 API 请求，提高性能。
   */
  const fetchFileStatus = useCallback(async () => {
    // 如果没有待处理文件，直接返回
    if (pendingFileIds.length === 0) {
      return null;
    }

    try {
      const getTaskStatus = createChatRequest('report/getTaskStatus');
      // 只查询待处理的文件 ID
      const response = await getTaskStatus({
        fileIds: pendingFileIds,
      });

      if (response.Data) {
        // 批量更新文件状态

        // 转换为 FileStatusUpdate 格式，过滤掉 status 为 undefined 的项
        const statusUpdates: FileStatusUpdate[] = response.Data.filter((item) => item.status !== undefined).map(
          (item) => ({
            fileId: item.fileID,
            status: item.status!,
          })
        );

        // 通过回调通知外部更新状态
        // 外部（容器组件）会根据状态更新 Redux
        // Redux selector 会自动过滤掉已完成的文件
        // 下次轮询时 pendingFileIds 会自动减少
        if (statusUpdates.length > 0) {
          onStatusUpdate?.(statusUpdates);
        }

        return statusUpdates;
      }

      return null;
    } catch (error) {
      console.error('[useFileStatusPolling] Error fetching file status:', error);
      throw error;
    }
  }, [pendingFileIds, onStatusUpdate]);

  /**
   * 使用 ahooks 的 useRequest 进行轮询
   */
  const { data, loading, error, run, cancel } = useRequest(fetchFileStatus, {
    // 只有当有待处理文件时才启用轮询
    pollingInterval: pendingFileIds.length > 0 ? pollingConfig.pollingInterval : undefined,
    pollingWhenHidden: pollingConfig.pollingWhenHidden,
    // 手动触发，不自动执行
    manual: true,
    // 错误重试
    retryCount: pollingConfig.retryCount,
    // 防抖，避免频繁请求
    debounceWait: pollingConfig.debounceWait,
  });

  /**
   * 当有待处理文件时，启动轮询
   */
  useEffect(() => {
    if (pendingFileIds.length > 0) {
      run();
    } else {
      cancel();
    }

    // 组件卸载时取消轮询
    return () => {
      cancel();
    };
  }, [pendingFileIds.length, run, cancel]);

  return {
    /** 是否正在轮询 */
    isPolling: pendingFileIds.length > 0,
    /** 待处理文件数量 */
    pendingCount: pendingFileIds.length,
    /** 待处理文件 ID 列表 */
    pendingFileIds,
    /** 最新的文件状态数据 */
    fileStatuses: data,
    /** 是否正在加载 */
    loading,
    /** 错误信息 */
    error,
    /** 手动触发轮询 */
    refresh: run,
    /** 停止轮询 */
    stopPolling: cancel,
  };
};
