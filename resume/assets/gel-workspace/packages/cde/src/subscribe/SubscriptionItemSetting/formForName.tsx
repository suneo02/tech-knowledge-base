import { Input } from '@wind/wind-ui'
import styles from './style/form.module.less'
import { SubscriptionFormConfig, SubscriptionFormData } from './types'

import { Form, FormInstance } from 'antd'
import { Rule } from 'antd/es/form'
import { intl } from 'gel-util/intl'

interface SubscriptionFormProps {
  form: FormInstance<SubscriptionFormData>
  config: SubscriptionFormConfig
}

const emailPattern = /^([A-Za-z0-9_\-\.*])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

const formRules: Record<string, Rule[]> = {
  subscriptionName: [
    { required: true, message: intl('237985', '订阅名称不能为空') },
    { max: 30, message: intl('261078', '请输入名称，30个字符以内') },
  ],
  emailAddress: [
    { required: true, message: intl('257723', '请输入邮箱地址') },
    { pattern: emailPattern, message: intl('283268', '邮箱地址格式不正确！') },
  ],
}

/**
 * 订阅名称表单组件
 *
 * 用于创建和编辑订阅名称
 */
export const SubscriptionFormForName: React.FC<SubscriptionFormProps> = ({ form }) => {
  return (
    <Form<SubscriptionFormData>
      form={form}
      layout="vertical"
      requiredMark={false}
      className={styles['subscription-form']}
    >
      {/* 订阅名称 */}
      <Form.Item
        name="subscriptionName"
        label={<>{intl('5026', '订阅名称')}</>}
        rules={formRules.subscriptionName}
        className={styles['subscription-form--name-input']}
      >
        <Input placeholder={intl('261078', '请输入名称，30个字符以内')} />
      </Form.Item>
    </Form>
  )
}
