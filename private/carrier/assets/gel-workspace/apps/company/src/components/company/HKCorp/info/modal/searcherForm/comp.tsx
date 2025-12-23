import { IHKSearcherInfo } from '@/api/corp/HKCorp/pay'
import { FormItemProps } from '@wind/wind-ui-form'
import React, { FC } from 'react'
import styles from '../style/searcherForm.module.less'
import intl from '@/utils/intl'
export const ConfirmDeclaration: FC = () => (
  // TODO: 翻译
  <div>
    <p>{intl(414535, '当本人按下面的「接受并提交」键，即表示')}</p>
    <p>
      (1){intl(414519, '本人确认已细读和明白上述使用公司注册处电子查册服务的条款及条件和私隐声明，并同意受其约束。')}
    </p>
    <p>(2){intl(414520, '本人现提交上述有关查册的目的声明，本人明白，查册所得的个人资料只能作本人所声明的用途。')}</p>
  </div>
)

export const searchFormItemCommonProps: FormItemProps<IHKSearcherInfo> = {
  className: styles.formItemRow,
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 12,
  },
  required: true,
}
