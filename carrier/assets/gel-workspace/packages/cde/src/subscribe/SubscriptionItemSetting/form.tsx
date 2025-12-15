import { EditOutlined } from '@/assets/icons'
import { Checkbox, Input, Radio } from '@wind/wind-ui'
import { useState } from 'react'
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

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ form, config }) => {
  const { isEmailEditable } = config
  // 添加本地状态来控制邮箱是否可编辑
  const [localEmailEditable, setLocalEmailEditable] = useState(isEmailEditable)

  // 使用 Form.useWatch 监听表单值变化
  const isPushEnabled = form.getFieldValue('isPushEnabled')
  const isEmailEnabled = form.getFieldValue('isEmailEnabled')

  // 处理编辑图标点击事件
  const handleEditClick = () => {
    setLocalEmailEditable(true)
  }

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

      {/* 推送设置 */}
      <Form.Item name="isPushEnabled" className={styles['subscription-form--push-group']}>
        <Radio.Group className={styles['subscription-form--radio-group']}>
          <Radio value={false}>{intl('', '不推送')}</Radio>
          <Radio value={true}>{intl('', '开启推送')}</Radio>
        </Radio.Group>
      </Form.Item>
      {/* 邮件通知设置 - 仅在开启推送时显示 */}
      {isPushEnabled && (
        <div className={styles['subscription-form--push-sub-options']}>
          {/* 邮件通知行 */}
          <div className={styles['subscription-form--email-container']}>
            {/* 邮件通知复选框 */}
            <Form.Item
              name="isEmailEnabled"
              valuePropName="checked"
              className={styles['subscription-form--email-checkbox']}
            >
              <Checkbox>{intl('283267', '邮件提醒，发送至：')}</Checkbox>
            </Form.Item>

            {/* 邮箱地址 - 仅在开启邮件通知时显示 */}
            {isEmailEnabled && (
              <>
                {/* 可编辑状态 - 使用本地状态控制 */}
                {localEmailEditable ? (
                  <Form.Item
                    name="emailAddress"
                    rules={formRules.emailAddress}
                    className={styles['subscription-form--email-input']}
                  >
                    <Input placeholder={intl('257723', '请输入邮箱地址')} />
                  </Form.Item>
                ) : (
                  /* 不可编辑状态 */
                  <div className={styles['subscription-form--email-readonly']}>
                    <span className={styles['subscription-form--email-readonly-text']}>
                      {form.getFieldValue('emailAddress')}
                    </span>
                    <EditOutlined
                      onClick={handleEditClick}
                      className={styles['subscription-form--email-readonly-icon']}
                    />
                    <Form.Item name="emailAddress" hidden>
                      <Input />
                    </Form.Item>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 邮箱提示信息 */}
          {isEmailEnabled && localEmailEditable && (
            <div className={styles['subscription-form--email-hint']}>
              {intl('', '此邮箱将作为全部订阅推送邮件的接收邮箱')}
            </div>
          )}
        </div>
      )}
    </Form>
  )
}
