import { requestToChat } from '@/api';
import { downloadFileByItem } from '@/api/service';
import { FileEditModal, FileList, FilePreviewModal, UploadFileBtn } from '@/components/File';
import { useExpandedSidebar } from '@/hooks';
import { useFileList } from '@/hooks/useFileList';
import { selectSidebarCollapsed, useAppSelector } from '@/store';
import { isDev } from '@/utils';
import { Card, message, Modal } from '@wind/wind-ui';
import { GetApiData, RPFileListItem } from 'gel-api';
import { useIntl } from 'gel-ui';
import React, { useCallback, useState } from 'react';
import { FileSearchFormFields, SearchCard } from './SearchCard';
import styles from './index.module.less';

/**
 * 文件管理页面组件
 *
 * @description 文件管理的主页面，包含搜索筛选区域和文件列表区域
 * @since 1.0.0
 */
export const FileManagement: React.FC = () => {
  useExpandedSidebar();

  const t = useIntl();
  const isExpanded = useAppSelector(selectSidebarCollapsed);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<RPFileListItem | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [editFile, setEditFile] = useState<RPFileListItem | null>(null);

  // 搜索筛选状态 - 使用单个对象统一管理
  const [searchParams, setSearchParams] = useState<FileSearchFormFields>({});

  // 使用useFileList hook管理文件列表数据（已集成状态轮询功能）
  const {
    fileList,
    loading,
    total,
    current,
    pageSize,
    refresh,
    handlePageChange,
    isPolling,
    pendingCount,
    handleSearch,
    resetSearchParams,
  } = useFileList();

  // 文件上传成功后刷新列表
  const handleUploadSuccess = useCallback(() => {
    // 调用useFileList的refresh方法
    refresh();
  }, [refresh]);

  // 处理查看文件
  const handleViewFile = useCallback((record: RPFileListItem) => {
    setPreviewFile(record);
    setPreviewVisible(true);
  }, []);

  // 关闭预览
  const handleClosePreview = useCallback(() => {
    setPreviewVisible(false);
    setPreviewFile(null);
  }, []);

  // 处理下载文件
  const handleDownloadFile = useCallback(async (record: RPFileListItem) => {
    try {
      await downloadFileByItem(record);
      message.success(`文件 ${record.fileName} 下载成功`);
    } catch (error) {
      console.error('Download file error:', error);
      message.error(`文件 ${record.fileName} 下载失败`);
    }
  }, []);

  // 处理编辑文件
  const handleEditFile = useCallback((record: RPFileListItem) => {
    setEditFile(record);
    setEditVisible(true);
  }, []);

  // 关闭编辑
  const handleCloseEdit = useCallback(() => {
    setEditVisible(false);
    setEditFile(null);
  }, []);

  // 编辑成功回调
  const handleEditSuccess = useCallback(() => {
    refresh();
  }, [refresh]);

  // 应用筛选
  const handleApplyFilter = useCallback(() => {
    const apiSearchParams: Partial<GetApiData<'/wind.ent.chat/api/', 'report/fileList'>> = {};

    if (searchParams.fileName) {
      apiSearchParams.fileName = searchParams.fileName;
    }

    if (searchParams.dateRange) {
      const [startDate, endDate] = searchParams.dateRange;
      apiSearchParams.startDate = startDate.format('YYYYMMDD');
      apiSearchParams.endDate = endDate.format('YYYYMMDD');
    }

    if ((searchParams.tags || []).length > 0) {
      apiSearchParams.tags = searchParams.tags || [];
    }

    // 获取企业名称
    if (searchParams.corpName) {
      apiSearchParams.companyName = searchParams.corpName;
    }

    handleSearch(apiSearchParams);
  }, [searchParams, handleSearch]);

  // 重置搜索条件
  const handleResetSearch = useCallback(() => {
    setSearchParams({
      fileName: '',
      dateRange: null,
      tags: [],
      corpId: '',
      corpName: '',
    });
    resetSearchParams();
  }, [resetSearchParams]);

  // 处理删除文件
  const handleDeleteFile = useCallback(
    (record: RPFileListItem) => {
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除文件 "${record.fileName}" 吗？此操作不可恢复。`,
        okText: '确认删除',
        cancelText: '取消',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await requestToChat('report/fileDelete', {
              fileId: record.fileID,
            });
            message.success(`文件 ${record.fileName} 删除成功`);
            refresh();
          } catch (error) {
            console.error('Delete file error:', error);
            message.error(`文件 ${record.fileName} 删除失败`);
          }
        },
      });
    },
    [refresh]
  );

  return (
    <div className={`${styles.fileManagement} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>文件管理</h2>
      </div>

      <div className={styles.content}>
        {/* 搜索筛选区域 */}
        <div className={styles.searchSection}>
          <SearchCard
            searchParams={searchParams}
            onChange={setSearchParams}
            onReset={handleResetSearch}
            onApplyFilter={handleApplyFilter}
            loading={loading}
            isPolling={isPolling}
            isDev={isDev}
            pendingCount={pendingCount}
          />

          <Card className={styles.uploadCard}>
            <div className={styles.uploadControls}>
              <UploadFileBtn
                label={t('上传文件', { defaultValue: '上传文件' })}
                onUploadSuccess={handleUploadSuccess}
                extraFormData={searchParams.corpId ? { corpId: searchParams.corpId } : undefined}
              />
            </div>
          </Card>
        </div>

        {/* 文件列表区域 */}
        <div className={styles.listSection}>
          <FileList
            fileList={fileList}
            loading={loading}
            total={total}
            current={current}
            pageSize={pageSize}
            refresh={refresh}
            handlePageChange={handlePageChange}
            onView={handleViewFile}
            onDownload={handleDownloadFile}
            onEdit={handleEditFile}
            onDelete={handleDeleteFile}
          />
        </div>
      </div>

      {/* 文件预览模态框 */}
      <FilePreviewModal visible={previewVisible} file={previewFile} onClose={handleClosePreview} />

      {/* 文件编辑模态框 */}
      <FileEditModal visible={editVisible} file={editFile} onClose={handleCloseEdit} onSuccess={handleEditSuccess} />
    </div>
  );
};
