import React from 'react'
import Form from '@wind/wind-ui-form'
import { Checkbox } from '@wind/wind-ui'
import intl from '@/utils/intl'

export const NeedRecordField: React.FC = () => (
  <Form.Item name="needRecord" valuePropName="checked">
    <Checkbox data-uc-id="Kkw7ims42" data-uc-ct="checkbox">
      {intl(414522, '记住查册人信息')}
    </Checkbox>
  </Form.Item>
)
