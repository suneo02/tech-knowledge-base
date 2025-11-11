import intl from '@/utils/intl'
import { Input } from '@wind/wind-ui'
import Form, { FormInstance, FormProps } from '@wind/wind-ui-form'
import React, { FC, useEffect } from 'react'
import { InfoCircleButton } from '../icons/InfoCircle'
import styles from './style/callHelpForm.module.less'

export interface CallHelpFormField {
  phone: string
  email: string
}

export type CallHelpFormProps = FormProps<CallHelpFormField>
export const CallHelpForm: FC<
  Pick<CallHelpFormProps, 'initialValues' | 'onFinish'> & {
    onFormInstanceChange: (form: FormInstance<CallHelpFormField>) => void
  }
> = ({ initialValues, onFinish, onFormInstanceChange }) => {
  const [form] = Form.useForm<CallHelpFormField>()

  useEffect(() => {
    // 如果 initialValues 变化，则设置表单的初始值
    if (form) {
      form.resetFields()
    }
  }, [initialValues, form])

  useEffect(() => {
    onFormInstanceChange(form)
  }, [form])

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const handleFinish: CallHelpFormProps['onFinish'] = async (values) => {
    await form.validateFields()
    // 调用上层传入的回调函数，传递表单值
    if (onFinish) {
      onFinish(values)
    }
  }

  return (
    <Form
      {...formItemLayout}
      initialValues={initialValues}
      labelAlign="left"
      onFinish={handleFinish}
      form={form} // 将表单实例传递给上层
    >
      <Form.Item
        name="phone"
        label={`${intl('149821', '手机号')}：`}
        rules={[
          { required: true, message: intl('149821', '手机号不能为空') },
          {
            pattern: /^1\d{10}$/, // 假设手机号格式为1开头的11位数字
            message: '请输入正确的手机号格式',
          },
        ]}
      >
        <Input data-uc-id="KuYkZxSuG0" data-uc-ct="input" />
      </Form.Item>
      <Form.Item
        name="email"
        label={`${intl('91283', '电子邮箱')}：`}
        rules={[
          { required: true, message: intl('91283', '电子邮箱不能为空') },
          {
            type: 'email',
            message: '请输入正确的邮箱格式',
          },
        ]}
      >
        <Input data-uc-id="l4WpIAUh9w" data-uc-ct="input" />
      </Form.Item>
      <div className={styles['call-help-form--tips']}>
        <InfoCircleButton />
        <div className={styles['call-help-form--tips--text']}>
          <div>电话和邮箱不能同时为空</div>
          <div>请确认您的联系方式，客户经理将及时与您联系</div>
        </div>
      </div>
    </Form>
  )
}
