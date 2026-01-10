import { TaskStatus } from 'gel-api'
import { CheckCircleO, CloseCircleO, LoadingO, StopCircleO } from '@wind/icons'
import { t } from 'gel-util/intl'

// 任务状态相关工具函数
export const getTaskStatusInfo = (status: TaskStatus) => {
  const statusMap = {
    [TaskStatus.SUCCESS]: {
      icon: CheckCircleO,
      className: 'status-icon-success',
      text: t('203596', '已完成'),
    },
    [TaskStatus.FAILED]: {
      icon: CloseCircleO,
      className: 'status-icon-error',
      text: t('', '失败'),
    },
    [TaskStatus.TERMINATED]: {
      icon: StopCircleO,
      className: 'status-icon-error',
      text: t('416885', '已终止'),
    },
    [TaskStatus.PENDING]: {
      icon: LoadingO,
      className: '',
      text: t('481501', '排队中'),
    },
    [TaskStatus.RUNNING]: {
      icon: LoadingO,
      className: '',
      text: t('482258', '运行中'),
    },
  }

  return statusMap[status] || { icon: null, className: '', text: t('417397', '未知') }
}

export const formatTaskProgress = (progress: number): string => {
  return progress > 0 ? `${progress}%` : t('481501', '排队中')
}
