import { MyIcon } from '@/components/Icon'
import { Typography } from 'antd'
import React from 'react'
import styles from './style/AIHeader.module.less'

const { Title } = Typography

const AIHeader: React.FC = () => {
  return (
    <div className={styles.header}>
      <MyIcon className={styles.robotIcon} name="AIRobert" />
      <Title level={4} className={styles.title}>
        全球企业库AI智能助手
      </Title>
    </div>
  )
}

export default AIHeader
