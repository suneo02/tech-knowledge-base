import { Modal } from '@wind/wind-ui'
import { CDESubscribeItem } from 'gel-api'
import { SubscriptionFormForName } from './formForName'
import styles from './style/modal.module.less'
import { SubscriptionFormData } from './types'
import { useSubscriptionForm } from './useSubscriptionForm'
/**
 * 订阅设置弹窗组件
 *
 * 处理三种订阅场景：
 * 1. 新建订阅 - 可编辑所有字段
 * 2. 更新已启用推送的订阅 - 邮箱只读
 * 3. 更新未启用推送的订阅 - 可编辑所有字段
 */
export const SubscriptionItemSettingModal: React.FC<{
  open: boolean
  close: () => void
  info?: CDESubscribeItem
  fromAdd?: boolean
  handleSubmit: (data: SubscriptionFormData) => Promise<void>
  subEmail: string | undefined
}> = ({ open, close, handleSubmit, ...props }) => {
  const { form, formConfig, handleModalClose, handleFormValidate } = useSubscriptionForm({
    open,
    close,
    ...props,
  })

  return (
    // @ts-expect-error wind ui
    <Modal
      title={'保存条件'}
      visible={open}
      onCancel={handleModalClose}
      onOk={async () => {
        const formData = await handleFormValidate()
        handleSubmit(formData)
      }}
      width={600}
      destroyOnClose
    >
      <span className={styles['subscription-modal-hint']}>
        保存筛选条件并订阅。订阅后，我们将根据保存的筛选条件，定期推送最新符合条件的企业给您
      </span>
      <SubscriptionFormForName form={form} config={formConfig} />
    </Modal>
  )
}
