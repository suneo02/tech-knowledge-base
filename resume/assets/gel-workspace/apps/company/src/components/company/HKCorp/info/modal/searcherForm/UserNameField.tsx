import intl from '@/utils/intl'
import { Input } from '@wind/wind-ui'
import Form from '@wind/wind-ui-form'
import React from 'react'
import { searchFormItemCommonProps } from './comp'
export const UserNameField: React.FC<{ maskedFields: { [key: string]: boolean } }> = ({ maskedFields }) => (
  <Form.Item
    {...searchFormItemCommonProps}
    name="userName"
    label={intl(34979, '姓名')}
    rules={[
      {
        validator: (_, value) => {
          if (maskedFields['userName'] && value) {
            return Promise.resolve()
          }
          if (!value) {
            return Promise.reject(intl(414539, '请输入查册人中文姓名'))
          }
          return Promise.resolve()
        },
      },
    ]}
  >
    <Input placeholder={intl(414539, '请输入查册人中文姓名')} allowClear data-uc-id="ZNmvUKy77J" data-uc-ct="input" />
  </Form.Item>
)
