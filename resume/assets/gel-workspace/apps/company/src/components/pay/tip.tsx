import React, { FC } from 'react'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { Button, Tooltip } from '@wind/wind-ui'
import classNames from 'classnames'
import invoiceImg from '../../assets/imgs/tick.jpg'
import styles from './style/invoiceSample.module.less'
import tipBtnStyles from './style/tipBtn.module.less'

export const tipBtnClassNames = classNames('p-0', 'border-0', tipBtnStyles.payTipBtn)
// 用户协议组件
export const UserAgreementBtn: FC<{
  text?: string
}> = ({ text }) => {
  return (
    <Button
      type={'link'}
      onClick={() => wftCommon.jumpJqueryPage('index.html#/customer?type=usernote')}
      className={tipBtnClassNames}
    >
      {text || intl('209659', '用户协议')}
    </Button>
  )
}

// 隐私协议组件
export const PrivacyPolicyBtn: FC<{
  text?: string
}> = ({ text }) => {
  return (
    <Button
      type={'link'}
      onClick={() => wftCommon.jumpJqueryPage('index.html#/customer?type=userpolicy')}
      className={tipBtnClassNames}
    >
      {text || intl('392541', '隐私协议')}
    </Button>
  )
}

export const InvoiceSample: FC = () => {
  return (
    <Tooltip
      overlayClassName={styles.invoiceSampleOverlay}
      title={<img className={styles.invoiceSampleImg} src={invoiceImg} />}
    >
      <Button type={'link'} className={tipBtnClassNames}>
        {intl('392562', '查看发票样例')}
      </Button>
    </Tooltip>
  )
}
