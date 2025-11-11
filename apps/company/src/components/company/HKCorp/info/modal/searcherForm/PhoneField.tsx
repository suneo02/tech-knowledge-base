import React from 'react'
import Form from '@wind/wind-ui-form'
import { Input } from '@wind/wind-ui'
import intl from '@/utils/intl'
import { searchFormItemCommonProps } from './comp'

export const PhoneField: React.FC<{ maskedFields: { [key: string]: boolean } }> = ({ maskedFields }) => (
  <Form.Item
    {...searchFormItemCommonProps}
    name="phone"
    label={intl(51994, '手机')}
    rules={[
      {
        validator: (_, value) => {
          if (maskedFields['phone'] && value) {
            return Promise.resolve()
          }
          if (!value) {
            return Promise.reject(intl(414523, '请输入查册人手机号'))
          }
          if (!/^(1[3-9]\d{9})$/.test(value)) {
            return Promise.reject(intl(414524, '请输入有效的11位手机号码'))
          }
          return Promise.resolve()
        },
      },
    ]}
  >
    <Input placeholder={intl(414523, '请输入查册人手机号')} allowClear data-uc-id="MRcI46h_UI" data-uc-ct="input" />
  </Form.Item>
)
