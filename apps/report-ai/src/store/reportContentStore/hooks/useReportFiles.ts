/**
 * 报告文件管理 Hook
 *
 * @description
 * 负责获取报告关联的文件列表并同步到 Redux
 * 提供刷新方法用于文件上传后更新文件列表
 *
 * @see {@link ../../../hooks/useReportRelatedFiles.ts | 文件获取 Hook}
 * @see {@link ../reducers/reportFilesReducers.ts | 报告文件 Reducers}
 */

import { useReportRelatedFiles } from '@/hooks/useReportRelatedFiles';
import { useEffect } from 'react';
import { useRPDetailDispatch, useRPDetailSelector } from '../hooksRedux';
import { selectReportId } from '../selectors';
import { rpDetailActions } from '../slice';

export interface UseReportFilesParams {
  /** 是否启用自动请求 */
  enabled?: boolean;
}

export interface UseReportFilesReturn {
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error?: Error;
  /** 手动刷新文件列表 */
  refreshFiles: () => void;
}

/**
 * 报告文件管理 Hook
 *
 * 职责：
 * - 自动获取报告关联的文件列表
 * - 将文件列表同步到 Redux
 * - 提供刷新方法用于文件上传后更新
 *
 * 使用示例：
 * ```tsx
 * const { loading, refreshFiles } = useReportFiles({
 *   reportId: '123',
 * });
 *
 * // 文件上传成功后刷新
 * const handleFileUploadSuccess = () => {
 *   refreshFiles();
 * };
 * ```
 */
export const useReportFiles = (params: UseReportFilesParams = {}): UseReportFilesReturn => {
  const { enabled = true } = params;

  const dispatch = useRPDetailDispatch();

  // 从 Redux 获取报告 ID（如果没有通过 props 传入）
  const reportId = useRPDetailSelector(selectReportId);

  // 使用现有的文件获取 Hook
  const { files, loading, error, refresh } = useReportRelatedFiles({
    reportId,
    enabled: enabled && !!reportId,
  });

  // 将获取到的文件列表同步到 Redux
  useEffect(() => {
    if (files && Array.isArray(files)) {
      dispatch(rpDetailActions.setReportFiles(files));
    }
  }, [dispatch, files]);

  return {
    loading,
    error,
    refreshFiles: refresh,
  };
};
