import { useRequest } from 'ahooks'
import { FileItem, FileStatus } from './useFileData'

// 模拟轮询获取文件状态的接口
const fetchFileStatus = (fileIds: string[]): Promise<Array<{ id: string; status: FileStatus }>> => {
  // 这里应该是真实的API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = fileIds.map((id) => {
        // 模拟随机状态变化
        const random = Math.random()
        let status: FileStatus

        if (random < 0.2) {
          status = FileStatus.FAILED
        } else if (random < 0.5) {
          status = FileStatus.RUNNING
        } else {
          status = FileStatus.SUCCESS
        }

        return { id, status }
      })
      resolve(result)
    }, 1000)
  })
}

interface UseFilePollingProps {
  files: FileItem[]
  hasProcessingFiles: boolean
  onFileStatusChange: (fileId: string, status: FileStatus) => void
}

interface UseFilePollingReturn {
  pollFileStatus: () => void
  cancelPolling: () => void
}

export const useFilePolling = ({
  files,
  hasProcessingFiles,
  onFileStatusChange,
}: UseFilePollingProps): UseFilePollingReturn => {
  // 获取需要轮询的文件ID列表
  const getPollingFileIds = () => {
    return files
      .filter((file) => file.status === FileStatus.RUNNING || file.status === FileStatus.PENDING)
      .map((file) => file.id)
  }

  // 使用ahooks的useRequest进行轮询
  const { run: pollFileStatus, cancel: cancelPolling } = useRequest(
    async () => {
      const fileIds = getPollingFileIds()
      if (fileIds.length === 0) return []
      return await fetchFileStatus(fileIds)
    },
    {
      pollingInterval: 3000, // 每3秒轮询一次
      manual: true, // 手动触发
      pollingWhenHidden: false, // 页面隐藏时暂停轮询
      onSuccess: (data) => {
        if (!data || data.length === 0) return

        // 处理每个文件的状态更新
        data.forEach((updatedFile) => {
          onFileStatusChange(updatedFile.id, updatedFile.status)
        })

        // 如果没有处理中的文件，取消轮询
        if (!hasProcessingFiles) {
          cancelPolling()
        }
      },
    }
  )

  return {
    pollFileStatus,
    cancelPolling,
  }
}
