import React from 'react'
import Form from '@wind/wind-ui-form'
import { Input } from '@wind/wind-ui'
import { searchFormItemCommonProps } from './comp'
import intl from '@/utils/intl'

export const IdentityCardField: React.FC<{ maskedFields: { [key: string]: boolean } }> = ({ maskedFields }) => (
  <Form.Item
    {...searchFormItemCommonProps}
    name="identityCard"
    label={intl(414536, '身份证')}
    rules={[
      {
        validator: (_, value) => {
          if (maskedFields['identityCard'] && value) {
            return Promise.resolve()
          }
          if (!value) {
            return Promise.reject(intl(414537, '请输入查册人中国大陆身份证号码'))
          }
          if (!/(^\d{15}$)|(^\d{17}[\dXx]$)/.test(value)) {
            return Promise.reject(intl(414521, '请输入有效的中国大陆身份证号码'))
          }
          return Promise.resolve()
        },
      },
    ]}
  >
    <Input placeholder={intl(414537, '请输入查册人中国大陆身份证号码')} allowClear />
  </Form.Item>
)
