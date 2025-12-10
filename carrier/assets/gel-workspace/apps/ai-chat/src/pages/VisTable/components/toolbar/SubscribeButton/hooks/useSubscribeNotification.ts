import { createWFCSuperlistRequestFcs } from '@/api'
import { showMessage } from '@/utils/message'
import { GetCDENewCompanyResponse } from 'gel-api'
import { t } from 'gel-util/intl'
import { useCallback, useEffect } from 'react'

const STRINGS = {
  TOAST_MESSAGE: (total: number) => t('464128', '当前订阅筛选下的新增企业有{{total}}行', { total }),
  IMMEDIATE_VIEW: t('371154', '立即查看')
}

/** 标记通知为已读 */
const disableCdeNewCompanyNoticeApi = createWFCSuperlistRequestFcs('superlist/excel/disableCdeNewCompanyNotice')

interface UseSubscribeNotificationOptions {
  /** 表格 ID */
  tableId: string
  /** 查看新企业数据的回调 */
  onViewNews?: () => void
  /** 是否自动检查通知 */
  autoCheck?: boolean

  subscribeInfo: GetCDENewCompanyResponse
}
/**
 * 订阅通知管理 Hook
 * 专门负责通知消息的显示、检查和标记已读
 */
export const useSubscribeNotification = ({
  tableId,
  subscribeInfo,
  onViewNews,
  autoCheck = true,
}: UseSubscribeNotificationOptions) => {
  /** 标记通知为已读 */
  const markNotificationAsRead = useCallback(async () => {
    if (!tableId) return
    try {
      await disableCdeNewCompanyNoticeApi({ tableId })
    } catch (error) {
      console.error('标记通知已读失败:', error)
    }
  }, [tableId])

  /** 检查并显示通知 */
  const checkAndShowNotification = useCallback(async () => {
    console.log('🚀 ~checkAndShowNotification ~subscribeInfo:', subscribeInfo)
    if (!subscribeInfo?.disableToast && subscribeInfo.totalNewCompany > 0 && subscribeInfo.subPush) {
      showMessage({
        content: STRINGS.TOAST_MESSAGE(subscribeInfo.totalNewCompany),
        showActionButton: true,
        // @ts-expect-error ttt
        actionButtonText: STRINGS.IMMEDIATE_VIEW,
        onActionClick: () => {
          markNotificationAsRead()
          onViewNews?.()
        },
        onClose: () => {
          markNotificationAsRead()
        },
        duration: 5,
      })
    }
  }, [subscribeInfo])

  useEffect(() => {
    if (autoCheck && tableId) {
      checkAndShowNotification()
    }
  }, [autoCheck, tableId, subscribeInfo])

  return {
    markNotificationAsRead,
    checkAndShowNotification,
  }
}
