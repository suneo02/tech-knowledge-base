import { RPFileUnified } from '@/types/file';
import { DeleteO, DownloadO, EditO, FileTextO, MoreO } from '@wind/icons';
import { Button, Dropdown, Modal, message } from 'antd';
import { RPFileStatus } from 'gel-api';
import React from 'react';
import styles from './index.module.less';

/**
 * 文件操作项类型
 */
export interface FileAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

/**
 * 通用文件操作组件
 *
 * @description 提供文件的各种操作功能，支持自定义操作项
 * @param file - 文件信息
 * @param actions - 自定义操作项，如果不提供则使用默认操作
 * @param showViewButton - 是否显示查看按钮
 * @param className - 自定义样式类名
 */
export interface FileActionsProps {
  file: RPFileUnified;
  actions?: FileAction[];
  showViewButton?: boolean;
  className?: string;
  onView?: (file: RPFileUnified) => void;
  onDownload?: (file: RPFileUnified) => void;
  onEdit?: (file: RPFileUnified) => void;
  onDelete?: (file: RPFileUnified) => void;
}

export const FileActions: React.FC<FileActionsProps> = ({
  file,
  actions,
  showViewButton = true,
  className,
  onView,
  onDownload,
  onEdit,
  onDelete,
}) => {
  const [modal, modalContextHolder] = Modal.useModal();

  // 默认查看文件操作
  const handleView = () => {
    if (onView) {
      onView(file);
    } else {
      // 默认实现：在新窗口打开预览
      const url = getFilePreviewUrl(file.fileId);
      window.open(url, '_blank');
    }
  };

  // 默认下载文件操作
  const handleDownload = async () => {
    if (onDownload) {
      onDownload(file);
    } else {
      // 默认实现：模拟下载
      try {
        message.success('文件下载功能待实现');
      } catch (error) {
        message.error('下载失败');
      }
    }
  };

  // 默认编辑文件操作
  const handleEdit = () => {
    if (file.status !== RPFileStatus.FINISHED) {
      message.warning('只能编辑已完成的文件');
      return;
    }

    if (onEdit) {
      onEdit(file);
    } else {
      // 默认实现：提示功能待实现
      message.info('文件编辑功能待实现');
    }
  };

  // 默认删除文件操作
  const handleDelete = () => {
    if (onDelete) {
      onDelete(file);
    } else {
      // 默认实现：显示确认弹窗
      modal.confirm({
        title: '确认删除',
        content: `确定要删除文件"${file.fileName}"吗？此操作不可恢复。`,
        okText: '确认删除',
        cancelText: '取消',
        okButtonProps: {
          danger: true,
        },
        onOk: async () => {
          try {
            message.success('文件删除功能待实现');
          } catch (error) {
            message.error('删除失败');
          }
        },
      });
    }
  };

  // 默认操作菜单项
  const defaultActions: FileAction[] = [
    {
      key: 'view',
      label: '查看',
      icon: <FileTextO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
      onClick: handleView,
    },
    {
      key: 'download',
      label: '下载',
      icon: <DownloadO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
      onClick: handleDownload,
    },
  ];

  // 更多操作菜单项
  const moreActions: FileAction[] = [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
      onClick: handleEdit,
      disabled: file.status !== RPFileStatus.FINISHED,
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
      onClick: handleDelete,
      danger: true,
    },
  ];

  // 合并操作项
  const allActions = actions || [...defaultActions, ...moreActions];
  const primaryActions = allActions.slice(0, 1); // 第一个操作作为主要按钮
  const dropdownActions = allActions.slice(1); // 剩余操作作为下拉菜单

  return (
    <>
      <div className={`${styles.fileActions} ${className || ''}`}>
        {showViewButton && primaryActions.length > 0 && (
          <Button
            type="link"
            size="small"
            icon={primaryActions[0].icon}
            onClick={primaryActions[0].onClick}
            className={styles.actionButton}
          >
            {primaryActions[0].label}
          </Button>
        )}

        {dropdownActions.length > 0 && (
          <Dropdown
            menu={{
              items: dropdownActions.map((action) => ({
                key: action.key,
                label: action.label,
                icon: action.icon,
                onClick: action.onClick,
                disabled: action.disabled,
                danger: action.danger,
              })),
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="link"
              size="small"
              icon={<MoreO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              className={styles.moreButton}
            />
          </Dropdown>
        )}
      </div>

      {modalContextHolder}
    </>
  );
};

// 工具函数：获取文件预览URL
function getFilePreviewUrl(fileId: string): string {
  // TODO: 根据实际API实现
  return `/api/files/preview/${fileId}`;
}
