import { requestToChat } from '@/api';
import { useRequest } from 'ahooks';
import { ApiCodeForWfc, RPFile, TRequestToChat } from 'gel-api';
import { useMemo } from 'react';

type FuncGetReportFiles = TRequestToChat<'report/files'>;

/**
 * 报告文件数据管理 Hook
 *
 * @description 获取与报告关联的文件列表（非章节关联文件）
 * @param reportId 报告ID
 * @returns 报告文件数据、加载状态和刷新方法
 */
export interface UseReportFilesOptions {
  /** 报告ID */
  reportId?: string;
  /** 是否启用自动请求 */
  enabled?: boolean;
}

export interface UseReportFilesResult {
  /** 报告文件列表 */
  files: RPFile[];
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error?: Error;
  /** 手动刷新方法 */
  refresh: () => void;
}

/**
 * 使用报告文件数据的 Hook
 *
 * @param options 配置选项
 * @returns 报告文件数据和状态
 */
export const useReportRelatedFiles = (options: UseReportFilesOptions): UseReportFilesResult => {
  const { reportId, enabled = true } = options;

  const { data, loading, error, run } = useRequest<
    Awaited<ReturnType<FuncGetReportFiles>>,
    Parameters<FuncGetReportFiles>
  >((_data, options) => requestToChat('report/files', undefined, { appendUrl: reportId, ...options }), {
    ready: enabled && !!reportId,
    refreshDeps: [reportId],
    onError: (error) => {
      console.error('[useReportFiles] 获取报告文件失败:', error);
    },
  });

  // 提取文件列表
  const files = useMemo<RPFile[]>(() => {
    try {
      if (!data || data.ErrorCode !== ApiCodeForWfc.SUCCESS) {
        return [];
      }
      return (
        data.Data?.map((f) => {
          return {
            fileId: f.fileID,
            fileName: f.fileName,
            createTime: f.createTime,
            status: f.status,
            docId: f.docId,
          };
        }) || []
      );
    } catch (e) {
      console.error('[useReportFiles] 处理报告文件数据失败:', e);
      return [];
    }
  }, [data]);

  return {
    files,
    loading,
    error,
    refresh: run,
  };
};
