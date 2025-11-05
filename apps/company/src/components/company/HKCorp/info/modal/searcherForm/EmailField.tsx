import React from 'react'
import Form from '@wind/wind-ui-form'
import { Input } from '@wind/wind-ui'
import intl from '@/utils/intl'
import { searchFormItemCommonProps } from './comp'

export const EmailField: React.FC<{ maskedFields: { [key: string]: boolean } }> = ({ maskedFields }) => (
  <Form.Item
    {...searchFormItemCommonProps}
    name="email"
    label={intl(16752, '邮箱')}
    rules={[
      {
        validator: (_, value) => {
          if (maskedFields['email'] && value) {
            return Promise.resolve()
          }
          if (!value) {
            return Promise.reject(intl('414534', '请输入查册人邮箱'))
          }
          if (!/\S+@\S+\.\S+/.test(value)) {
            return Promise.reject(intl('414518', '请输入有效的邮箱地址'))
          }
          return Promise.resolve()
        },
      },
    ]}
  >
    <Input placeholder={intl('414534', '请输入查册人邮箱')} allowClear />
  </Form.Item>
)
