import { Modal } from '@wind/wind-ui'
import Form from '@wind/wind-ui-form'
import React, { useContext, useEffect } from 'react'
import { BindContactModalCtx, BindContactModalProvider } from './handle/Ctx'
import { message } from 'antd'
import intl from '../../../../utils/intl'

const ModalLocal = ({ title, visible, onClose, children }) => {
  const { dispatch, confirmLoading, captchaRes } = useContext(BindContactModalCtx)
  const [form] = Form.useForm()

  useEffect(() => {
    dispatch({
      type: 'setForm',
      payload: form,
    })
  }, [form])

  const onOk = async () => {
    try {
      if (captchaRes == null) {
        message.error(intl('417576', '请先发送验证码'))
        console.error('captcha res if null')
        return
      }
      await form.validateFields()
      await form.submit()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onClose}
      confirmLoading={confirmLoading}
      okText={intl('286726', '确认绑定')}
    >
      {children}
    </Modal>
  )
}

export const BindContactModal = ({ title, visible, onClose, children }) => {
  return (
    <BindContactModalProvider>
      <ModalLocal title={title} visible={visible} onClose={onClose}>
        {children}
      </ModalLocal>
    </BindContactModalProvider>
  )
}
