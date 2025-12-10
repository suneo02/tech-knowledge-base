import { useSubscribeModal as useBaseSubscribeModal } from '@/components/Subscribe'
import { postPointBuried } from '@/utils/common/bury'
import { useCallback } from 'react'

interface UseSubscribeModalOptions {
  tableId: string
  onSubscribeSuccess?: () => void
  onSubscribeCancel?: () => void
}

/**
 * 订阅弹窗管理 Hook
 * 专门负责弹窗的显示、隐藏和模式切换
 */
export const useSubscribeModal = ({ tableId, onSubscribeSuccess, onSubscribeCancel }: UseSubscribeModalOptions) => {
  const [subscribeModal, subscribeModalContextHolder] = useBaseSubscribeModal()

  /** 显示订阅设置弹窗 */
  const showSubscribeSetting = useCallback(() => {
    postPointBuried('922604570311')
    subscribeModal.show({
      tableId,
      onOk: () => {
        subscribeModal.hide()
        onSubscribeSuccess?.()
      },
      onDismiss: onSubscribeCancel,
      preview: false,
    })
  }, [subscribeModal, tableId, onSubscribeSuccess, onSubscribeCancel])

  /** 显示订阅预览弹窗 */
  const showSubscribePreview = useCallback(() => {
    postPointBuried('922604570314')
    subscribeModal.show({
      tableId,
      onOk: () => {
        subscribeModal.hide()
      },
      onGoToSetting: () => {
        // 从预览模式跳转到设置模式
        subscribeModal.hide()
        showSubscribeSetting()
      },
      preview: true,
      onDismiss: onSubscribeCancel,
    })
  }, [subscribeModal, tableId, showSubscribeSetting])

  /** 隐藏弹窗 */
  const hideModal = useCallback(() => {
    subscribeModal.hide()
  }, [subscribeModal])

  return {
    subscribeModalContextHolder,
    showSubscribeSetting,
    showSubscribePreview,
    hideModal,
  }
}
