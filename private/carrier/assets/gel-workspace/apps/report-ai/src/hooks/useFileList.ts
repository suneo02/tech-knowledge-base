import { createChatRequest } from '@/api';
import { isReportFileStatusMutable } from '@/domain/file';
import { useDebounceFn, useRequest } from 'ahooks';
import { GetApiData, RPFileListItem, RPFileStatus } from 'gel-api';
import { useCallback, useMemo, useState } from 'react';
import { useFileStatusPolling } from './useFileStatusPolling';

const request = createChatRequest('report/fileList');
/**
 * 文件列表Hook返回值
 */
export interface UseFileListResult {
  /** 文件列表数据 */
  fileList: RPFileListItem[];
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error?: Error;
  /** 总数 */
  total: number;
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  pageSize: number;
  /** 搜索参数 */
  searchParams: GetApiData<'/wind.ent.chat/api/', 'report/fileList'>;
  /** 更新搜索参数 */
  updateSearchParams: (params: Partial<GetApiData<'/wind.ent.chat/api/', 'report/fileList'>>) => void;
  /** 重置搜索参数 */
  resetSearchParams: () => void;
  /** 刷新列表 */
  refresh: () => void;
  /** 处理页码变化 */
  handlePageChange: (page: number, size?: number) => void;
  /** 处理搜索（防抖） */
  handleSearch: (params: Partial<GetApiData<'/wind.ent.chat/api/', 'report/fileList'>>) => void;
  /** 更新文件状态 */
  updateFileStatus: (fileId: string, newStatus: RPFileStatus) => void;
  /** 是否正在轮询状态 */
  isPolling: boolean;
  /** 待轮询文件数量 */
  pendingCount: number;
}

/**
 * 默认搜索参数
 */
const DEFAULT_SEARCH_PARAMS: GetApiData<'/wind.ent.chat/api/', 'report/fileList'> = {
  pageNo: 1,
  pageSize: 10,
};

/**
 * 文件列表Hook
 *
 * @description 管理文件列表的获取、搜索、分页等逻辑
 *
 * @see [../../../docs/specs/file-management/spec-design-v1.md](../../../docs/specs/file-management/spec-design-v1.md) - 文件管理页面设计
 * @see [../../../docs/specs/file-management/spec-implementation-v1.md](../../../docs/specs/file-management/spec-implementation-v1.md) - 文件管理实施拆解
 * @see [./FileList/index.tsx](./FileList/index.tsx) - 使用此Hook的组件
 * @see [../../../../packages/gel-api/src/chat/report/file.ts](../../../../packages/gel-api/src/chat/report/file.ts) - API接口定义
 */
export const useFileList = (): UseFileListResult => {
  // 搜索参数状态
  const [searchParams, setSearchParams] =
    useState<GetApiData<'/wind.ent.chat/api/', 'report/fileList'>>(DEFAULT_SEARCH_PARAMS);

  // 文件状态映射表，用于临时更新文件状态
  const [fileStatusMap, setFileStatusMap] = useState<Map<string, RPFileStatus>>(new Map());

  // 获取文件列表
  const { data, loading, error, refresh } = useRequest(
    async () => {
      const response = await request(searchParams);
      return {
        list: response.Data || [],
        total: response.Page?.Records || 0, // TODO: Fix type when API response structure is clear
        current: searchParams.pageNo || 1,
        pageSize: searchParams.pageSize || 10,
      };
    },
    {
      ready: true,
      refreshDeps: [searchParams],
      onError: (error) => {
        console.error('Failed to fetch file list:', error);
      },
      onSuccess: () => {
        // 刷新成功时重置状态映射表
        setFileStatusMap(new Map());
      },
    }
  );

  // 获取待轮询的文件ID列表
  const pendingFileIds = useMemo(() => {
    return (data?.list || [])
      .filter((file) => {
        const currentStatus = fileStatusMap.get(file.fileID) || file.status;
        // 检查状态是否为可变状态（需要轮询的状态）
        return isReportFileStatusMutable(currentStatus);
      })
      .map((file) => file.fileID);
  }, [data?.list, fileStatusMap]);

  // 使用文件状态轮询Hook
  const { isPolling, pendingCount } = useFileStatusPolling({
    pendingFileIds,
    onStatusUpdate: (statusUpdates) => {
      // 更新状态映射表
      statusUpdates.forEach(({ fileId, status }) => {
        setFileStatusMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(fileId, status);
          return newMap;
        });
      });
    },
    config: {
      pollingInterval: 3000, // 每3秒轮询一次
    },
  });

  // 防抖搜索
  const { run: debouncedSearch } = useDebounceFn(
    (params: Partial<GetApiData<'/wind.ent.chat/api/', 'report/fileList'>>) => {
      setSearchParams((prev) => ({
        ...DEFAULT_SEARCH_PARAMS, // 从默认参数开始，避免保留旧的筛选条件
        ...params,
        pageNo: 1, // 搜索时重置到第一页
      }));
    },
    { wait: 500 }
  );

  // 更新搜索参数
  const updateSearchParams = useCallback((params: Partial<GetApiData<'/wind.ent.chat/api/', 'report/fileList'>>) => {
    setSearchParams((prev) => ({
      ...prev,
      ...params,
    }));
  }, []);

  // 重置搜索参数
  const resetSearchParams = useCallback(() => {
    setSearchParams(DEFAULT_SEARCH_PARAMS);
  }, []);

  // 处理页码变化
  const handlePageChange = useCallback((page: number, size?: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageNo: page,
      pageSize: size || prev.pageSize,
    }));
  }, []);

  // 处理搜索
  const handleSearch = useCallback(
    (params: Partial<GetApiData<'/wind.ent.chat/api/', 'report/fileList'>>) => {
      debouncedSearch(params);
    },
    [debouncedSearch]
  );

  /** 更新文件状态 */
  const updateFileStatus = useCallback((fileId: string, newStatus: RPFileStatus) => {
    setFileStatusMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(fileId, newStatus);
      return newMap;
    });
  }, []);

  // 格式化文件列表数据
  const fileList = useMemo(() => {
    return (data?.list || []).map((item) => ({
      ...item,
      // 应用状态覆盖
      status: fileStatusMap.get(item.fileID) || item.status,
    }));
  }, [data?.list, fileStatusMap]);

  return {
    fileList,
    loading,
    error,
    total: data?.total || 0,
    current: data?.current || 1,
    pageSize: data?.pageSize || 10,
    searchParams,
    updateSearchParams,
    resetSearchParams,
    refresh,
    handlePageChange,
    handleSearch,
    updateFileStatus,
    isPolling,
    pendingCount,
  };
};
