import { useState, useEffect } from 'react'
import { requestToWFCSecure } from '@/api'
import { DocTaskStatus, type getDocTaskListResponse, type DocTaskItem } from 'gel-api'
import dayjs from 'dayjs'
import { t } from 'gel-util/intl'

// 保留原始的 FileStatus 用于兼容现有代码
export const FileStatus = {
  PENDING: 1,
  RUNNING: 2,
  SUCCESS: 3,
  FAILED: 4,
} as const

export type FileStatus = (typeof FileStatus)[keyof typeof FileStatus]

// 添加一个状态映射函数，将接口的 DocTaskStatus 映射到组件的 FileStatus
export const mapDocTaskStatusToFileStatus = (status: DocTaskStatus): FileStatus => {
  switch (status) {
    case DocTaskStatus.CREATED:
      return FileStatus.PENDING
    case DocTaskStatus.GENERATING:
      return FileStatus.RUNNING
    case DocTaskStatus.SUCCESS:
      return FileStatus.SUCCESS
    case DocTaskStatus.FAILED:
      return FileStatus.FAILED
    case DocTaskStatus.DOWNLOADED:
      return FileStatus.SUCCESS // 已下载的文件显示为成功状态
    default:
      return FileStatus.SUCCESS
  }
}

export interface FileItem {
  id: string
  name: string
  exportTime: string
  status: FileStatus
  progress?: number
  downloadFileName: string
}

// 获取文件数据
const getDataSource = async (page = 0, pageSize = 10): Promise<{ dataSource: FileItem[]; total: number }> => {
  try {
    const res = await requestToWFCSecure(
      { cmd: 'getdoctasklist' },
      { pageno: page, pageSize },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          sourceId: 'superlist',
        },
      }
    )
    const list = res?.Data as getDocTaskListResponse
    const total = (res?.Page?.Records as number) || 0
    // 将接口数据转换为组件需要的格式
    if (list && Array.isArray(list)) {
      const dataSource = list.map((item: DocTaskItem) => ({
        id: item.id,
        name: item.displayName || t('464241', '未命名'),
        exportTime: item.created ? dayjs(item.created).format('YYYY-MM-DD HH:mm:ss') : '',
        status: mapDocTaskStatusToFileStatus(item.status),
        downloadFileName: item.downloadFileName,
      }))
      return {
        dataSource,
        total,
      }
    }
    return {
      dataSource: [],
      total,
    }
  } catch (error) {
    console.error('获取文件列表失败:', error)
    return {
      dataSource: [],
      total: 0,
    }
  }
}

interface UseFileDataProps {
  folderId: string
  pageSize?: number
}

interface UseFileDataReturn {
  files: FileItem[]
  loading: boolean
  currentPage: number
  setCurrentPage: (page: number) => void
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
  updateFileStatus: (fileId: string, status: FileStatus, progress?: number) => void
  retryFile: (fileId: string) => void
  hasProcessingFiles: boolean
  total: number
}

export const useFileData = ({ folderId, pageSize = 10 }: UseFileDataProps): UseFileDataReturn => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [total, setTotal] = useState(0)

  // 加载文件数据
  useEffect(() => {
    setLoading(true)
    getDataSource(currentPage, pageSize).then((data) => {
      setFiles(data.dataSource)
      setLoading(false)
      // 这里模拟获取总数，实际应该从接口返回
      setTotal(data.total)
    })
  }, [folderId, currentPage, pageSize])

  // 更新文件状态
  const updateFileStatus = (fileId: string, status: FileStatus, progress?: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === fileId ? { ...file, status, ...(progress !== undefined ? { progress } : {}) } : file
      )
    )
  }

  // 重试生成文件
  const retryFile = (fileId: string) => {
    updateFileStatus(fileId, FileStatus.RUNNING, 0)
  }

  // 检查是否有处理中的文件
  const hasProcessingFiles = files.some(
    (file) => file.status === FileStatus.RUNNING || file.status === FileStatus.PENDING
  )

  return {
    files,
    loading,
    currentPage,
    setCurrentPage,
    setFiles,
    updateFileStatus,
    retryFile,
    hasProcessingFiles,
    total,
  }
}
