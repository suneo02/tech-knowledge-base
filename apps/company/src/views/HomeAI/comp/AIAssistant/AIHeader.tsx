import { ApiO } from '@wind/icons'
import { Typography } from 'antd'
import { t } from 'gel-util/intl'
import React from 'react'
import styles from './style/AIHeader.module.less'

const { Title } = Typography

const intlMap = {
  assistant: t('466894', '商业查询智能助手'),
  AI_DISCLAIMER: t('453642', '内容由AI生成，请核查重要信息'),
}

const AIHeader: React.FC = () => {
  return (
    <div className={styles.header}>
      {/* <MyIcon className={styles.robotIcon} name="AIRobert" /> */}
      <ApiO
        className={styles.robotIcon}
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
        data-uc-id="SFmw5HOSH_"
        data-uc-ct="apio"
      />
      <Title level={4} className={styles.title}>
        {intlMap.assistant}
      </Title>
      <div className={styles.disclaimer}>{intlMap.AI_DISCLAIMER}</div>
    </div>
  )
}

export default AIHeader
