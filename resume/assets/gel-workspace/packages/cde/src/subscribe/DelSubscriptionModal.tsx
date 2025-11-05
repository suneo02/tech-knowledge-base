import { Button, Modal } from '@wind/wind-ui'
import { intl } from 'gel-util/intl'
import { FC } from 'react'

interface DeleteSubscriptionModalProps {
  open: boolean

  onCancel: () => void
  confirmLoading: boolean
  onConfirm: () => void
}

export const DeleteSubscriptionModal: FC<DeleteSubscriptionModalProps> = ({
  open,
  onCancel,
  onConfirm,
  confirmLoading,
}) => {
  return (
    // @ts-expect-error wind ui
    <Modal
      title={intl(272478, '温馨提示')}
      visible={open}
      onCancel={onCancel}
      width={500}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {intl('19405', '取消')}
        </Button>,
        <Button key="confirm" type="primary" onClick={onConfirm} loading={confirmLoading}>
          {intl('138836', '确定')}
        </Button>,
      ]}
    >
      <div>是否删除订阅，确认将删除保存的条件以及不再收到推送邮件。</div>
    </Modal>
  )
}
