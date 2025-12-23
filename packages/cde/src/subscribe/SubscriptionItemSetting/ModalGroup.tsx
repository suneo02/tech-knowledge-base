import { CDESubscribeItem } from 'gel-api'
import { FC } from 'react'
import { handleSubscriptionSubmit } from '../handle'
import { SubscriptionItemSettingModal } from './modal'
import { SubscriptionFormApi, SubscriptionFormData } from './types'

// 保存操作的状态，必须包含superQueryLogic
interface SaveModalState {
  type: 'save'
  item: Pick<CDESubscribeItem, 'superQueryLogic'> & {
    subName?: string
  }
}

// 编辑操作的状态，必须包含完整的CDESubscribeItem
interface EditModalState {
  type: 'edit'
  item: CDESubscribeItem
}

// 联合类型
type ActionModalState = SaveModalState | EditModalState

interface CDESubscribeModalsProps extends SubscriptionFormApi {
  actionModal: ActionModalState | null
  close: () => void
  fetchCDESubscriptions: () => void
  handleClickApply: (item: CDESubscribeItem) => void
  subEmail: string | undefined
}
export const CDESubscribeModals: FC<CDESubscribeModalsProps> = ({
  actionModal,
  close,
  fetchCDESubscriptions,
  subEmail,
  updateSubFunc,
  addSubFunc,
}) => {
  // 处理表单提交
  const handleFormSubmit = async (
    formData: SubscriptionFormData,
    info?:
      | (Pick<CDESubscribeItem, 'superQueryLogic'> & {
          subName?: string
        })
      | CDESubscribeItem
  ) => {
    await handleSubscriptionSubmit({
      formData,
      info,
      onSuccess: () => {
        fetchCDESubscriptions()
        close()
      },
      updateSubFunc,
      addSubFunc,
    })
  }
  if (!actionModal) {
    return null
  }
  // 编辑模式
  if (actionModal.type === 'edit') {
    return (
      <SubscriptionItemSettingModal
        open={true}
        close={close}
        info={actionModal.item}
        handleSubmit={(formData) => handleFormSubmit(formData, actionModal.item)}
        subEmail={subEmail}
      />
    )
  }

  // 保存模式
  if (actionModal.type === 'save') {
    return (
      <SubscriptionItemSettingModal
        open={true}
        close={close}
        handleSubmit={(formData) => handleFormSubmit(formData, actionModal.item)}
        subEmail={subEmail}
      />
    )
  }

  return null
}
