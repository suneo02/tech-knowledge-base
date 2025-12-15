import { Button } from '@wind/wind-ui'
import { SmartPaginationTable, SmartProgress, SmartProgressStatus } from 'gel-ui'
import React, { useEffect } from 'react'
import './index.less'

// 导入拆分出来的hooks和组件
import { postPointBuried } from '@/utils/common/bury'
import dayjs from 'dayjs'
import { usedInClient } from 'gel-util/env'
import { t } from 'gel-util/intl'
import FileIcon from './components/FileIcon'
import { FileItem, FileStatus, useFileData } from './hooks/useFileData'
import { useFilePolling } from './hooks/useFilePolling'

interface FileTableProps {
  folderId: string
}

const STRINGS = {
  FILE_NAME: t('31717', '文件名称'),
  EXPORT_TIME: t('425478', '导出时间'),
  STATUS: t('32098', '状态'),
  OPERATION: t('114232', '操作'),
  DOWNLOAD: t('432908', '下载'),
  RETRY: t('313393', '重试'),
}

const PREFIX = 'my-file-table'

const PAGE_SIZE = 10

export const FileTable: React.FC<FileTableProps> = ({ folderId }) => {
  // 使用拆分出来的hooks
  const { files, loading, setCurrentPage, updateFileStatus, retryFile, hasProcessingFiles, currentPage, total } =
    useFileData({
      folderId,
      pageSize: PAGE_SIZE,
    })

  // 处理文件状态变化
  const onFileStatusChange = (fileId: string, status: FileStatus) => {
    updateFileStatus(fileId, status)
  }

  // 使用轮询hooks
  const { pollFileStatus, cancelPolling } = useFilePolling({
    files,
    hasProcessingFiles,
    onFileStatusChange,
  })

  // 初始化轮询
  useEffect(() => {
    // 检查是否有处理中的文件，如果有则开始轮询
    if (files.length > 0 && hasProcessingFiles) {
      pollFileStatus()
    }
  }, [files.length, hasProcessingFiles, pollFileStatus])

  // 组件卸载时取消轮询
  useEffect(() => {
    return () => {
      cancelPolling()
    }
  }, [cancelPolling])

  // 翻页时检查处理中的文件并处理轮询
  const handlePageChange = (page: number) => {
    // page从1开始，需要转换为从0开始
    setCurrentPage(page - 1)

    // 取消当前的轮询
    cancelPolling()

    // 检查当前页是否有处理中的文件，如果有则重新开始轮询
    if (hasProcessingFiles) {
      pollFileStatus()
    }
  }

  const handleDownload = (record: FileItem) => {
    postPointBuried('922604570303', {
      tablename: record.downloadFileName,
    })
    // console.log('🚀 ~ handleDownload ~ record:', record)
    const baseUrl = import.meta.env.DEV ? 'https://gel.wind.com.cn' : window.location.origin
    const url = `${baseUrl}/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=${record.id}&filename=${record.downloadFileName}`
    if (usedInClient()) {
      window.open(url, '_blank')
    } else {
      location.href = url
    }
  }

  const handleRetry = (fileId: string) => {
    // console.log('重试生成文件:', fileId)
    postPointBuried('922604570304')
    // 重试文件
    retryFile(fileId)

    // 更新状态为运行中
    updateFileStatus(fileId, FileStatus.RUNNING)

    // 开始轮询
    pollFileStatus()
  }

  // 定义表格列
  const columns = [
    {
      title: STRINGS.FILE_NAME,
      key: 'name',
      dataIndex: 'name',
      render: (name: string) => (
        <div className={`${PREFIX}-file`}>
          <div className={`${PREFIX}-file-icon`}>
            <FileIcon fileName={name} />
          </div>
          <div className={`${PREFIX}-file-name`}>
            <div className={`${PREFIX}-file-text`}>{name}</div>
          </div>
        </div>
      ),
    },
    {
      title: STRINGS.EXPORT_TIME,
      key: 'exportTime',
      width: '30%',
      dataIndex: 'exportTime',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
      align: 'center',
    },
    {
      title: STRINGS.STATUS,
      width: '20%',
      key: 'status',
      dataIndex: 'status',
      render: (_: string, record: FileItem) => {
        const progressStatus = record.status as unknown as SmartProgressStatus
        return (
          <SmartProgress
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            status={progressStatus}
          />
        )
      },
      align: 'center',
    },
    {
      title: STRINGS.OPERATION,
      key: 'action',
      width: 120,
      render: (_: unknown, record: FileItem) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {record.status !== FileStatus.FAILED && (
            <Button onClick={() => handleDownload(record)} disabled={record.status !== FileStatus.SUCCESS} type="text">
              {STRINGS.DOWNLOAD}
            </Button>
          )}
          {record.status === FileStatus.FAILED && (
            <Button onClick={() => handleRetry(record.id)} type="text">
              {STRINGS.RETRY}
            </Button>
          )}
        </div>
      ),
      align: 'center',
    },
  ]

  return (
    <SmartPaginationTable
      size="large"// @ts-expect-error
      columns={columns}
      dataSource={files}
      loading={loading}
      rowKey="id"
      locale={{ emptyText: '该文件夹下没有文件' }}
      total={total}
      pagination={{
        pageSize: PAGE_SIZE,
        current: currentPage + 1, // 转换回从1开始的页码
        onChange: handlePageChange,
        total: total,
        showSizeChanger: false,
      }}
    />
  )
}

export default FileTable
