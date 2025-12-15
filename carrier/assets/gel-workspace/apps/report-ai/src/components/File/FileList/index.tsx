import { getFileTagConfig } from '@/components/File';
import { FileStatusBadge } from '@/components/File/StatusBadge';
import { RPFileUnified } from '@/types/file';
import { DeleteO, DownloadO, EditO, EyeO } from '@wind/icons';
import { Button, Tag, Tooltip } from '@wind/wind-ui';
import Table from '@wind/wind-ui-table';
import classNames from 'classnames';
import { RPFileListItem, RPFileStatus } from 'gel-api';
import { EMPTY_PLACEHOLDER } from 'gel-util/format';
import { FC, useCallback } from 'react';
import styles from './index.module.less';
/**
 * 文件列表组件属性
 */
export interface FileListProps {
  className?: string;
  /** 额外的类名 */
  extraClassName?: string;
  /** 文件列表数据 */
  fileList: RPFileListItem[];
  /** 加载状态 */
  loading: boolean;
  /** 总数 */
  total: number;
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  pageSize: number;
  /** 刷新文件列表 */
  refresh: () => void;
  /** 处理页码变化 */
  handlePageChange: (page: number, size?: number) => void;
  /** 查看文件回调 */
  onView?: (record: RPFileListItem) => void;
  /** 下载文件回调 */
  onDownload?: (record: RPFileListItem) => void;
  /** 编辑文件回调 */
  onEdit?: (record: RPFileListItem) => void;
  /** 删除文件回调 */
  onDelete?: (record: RPFileListItem) => void;
}

/**
 * 文件列表组件
 *
 * @description 展示文件列表表格，包含分页、排序和文件操作功能
 *
 * @see [../../../../docs/specs/file-management/spec-design-v1.md](../../../../docs/specs/file-management/spec-design-v1.md) - 文件管理页面设计
 * @see [../../../../docs/specs/file-management/spec-implementation-v1.md](../../../../docs/specs/file-management/spec-implementation-v1.md) - 文件管理实施拆解
 */
export const FileList: FC<FileListProps> = ({
  className,
  extraClassName,
  fileList,
  loading,
  total,
  current,
  pageSize,
  handlePageChange,
  onView,
  onDownload,
  onEdit,
  onDelete,
}) => {
  // 处理查看文件
  const handleView = useCallback(
    (record: RPFileListItem) => {
      onView?.(record);
    },
    [onView]
  );

  // 处理下载文件
  const handleDownload = useCallback(
    (record: RPFileListItem) => {
      onDownload?.(record);
    },
    [onDownload]
  );

  // 处理编辑文件
  const handleEdit = useCallback(
    (record: RPFileListItem) => {
      if (record.status === RPFileStatus.FINISHED) {
        onEdit?.(record);
      }
    },
    [onEdit]
  );

  // 处理删除文件
  const handleDelete = useCallback(
    (record: RPFileListItem) => {
      onDelete?.(record);
    },
    [onDelete]
  );

  // 表格列定义
  const columns = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
      ellipsis: {
        showTitle: false,
      },
      render: (fileName: string) => (
        <Tooltip placement="topLeft" title={fileName}>
          {fileName}
        </Tooltip>
      ),
      sorter: true,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: RPFileListItem['tags']) => {
        if (!tags) return EMPTY_PLACEHOLDER;

        return (
          <div className={styles['tag-container']}>
            {tags.map((tag, index) => {
              const tagConfig = getFileTagConfig(tag);
              return (
                <Tag key={index} type="secondary" size="small" color={tagConfig.color} className={styles['tag-item']}>
                  {tagConfig.text}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    {
      title: '关联公司',
      dataIndex: 'fileRelateName',
      key: 'fileRelateName',
      ellipsis: {
        showTitle: false,
      },
      render: (companyName: string) => (
        <Tooltip placement="topLeft" title={companyName}>
          {companyName || EMPTY_PLACEHOLDER}
        </Tooltip>
      ),
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record: RPFileListItem) => {
        // 转换为 RPFileUnified 类型以兼容 FileStatusBadge
        const fileForStatus: RPFileUnified = {
          fileId: record.fileID,
          fileName: record.fileName,
          status: record.status,
          docId: record.docId,
        };
        return <FileStatusBadge file={fileForStatus} />;
      },
      sorter: true,
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: RPFileListItem) => (
        <div className={styles['action-container']}>
          <Tooltip title="查看">
            <Button
              type="text"
              size="small"
              icon={<EyeO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={() => handleView(record)}
              className={styles['action-button']}
            />
          </Tooltip>

          <Tooltip title="下载">
            <Button
              type="text"
              size="small"
              icon={<DownloadO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={() => handleDownload(record)}
              className={styles['action-button']}
            />
          </Tooltip>

          <Tooltip title={record.status === RPFileStatus.FINISHED ? '编辑' : '仅支持编辑已完成文件'}>
            <Button
              type="text"
              size="small"
              icon={<EditO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={() => handleEdit(record)}
              disabled={record.status !== RPFileStatus.FINISHED}
              className={styles['action-button']}
            />
          </Tooltip>

          <Tooltip title="删除">
            <Button
              type="text"
              size="small"
              icon={<DeleteO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={() => handleDelete(record)}
              className={styles['action-button']}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  // 分页配置
  const paginationConfig = {
    current,
    pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    pageSizeOptions: ['10', '20', '50', '100'],
    onChange: handlePageChange,
    onShowSizeChange: handlePageChange,
  };

  return (
    <div className={classNames(styles['file-list'], className, extraClassName)}>
      <Table
        columns={columns}
        dataSource={fileList}
        rowKey="fileID"
        loading={loading}
        pagination={paginationConfig}
        size="middle"
        className={styles.table}
      />
    </div>
  );
};

FileList.displayName = 'FileList';
