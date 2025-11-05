import intl from '@/utils/intl'
import { Col, Row } from '@wind/wind-ui'
import React, { FC } from 'react'
import styles from './index.module.less'

export const VipForbidden: FC<{
  title: string
  description: string
}> = ({ title }) => {
  return (
    <div className={styles.container}>
      <Row gutter={12} className={styles.header}>
        <Col className={styles.title}>{title}</Col>
        <Col
          className={styles.description}
        >{`${intl('245503', '该功能暂未开放')}, ${intl('245504', '如有疑问请联系客户经理')}`}</Col>
        <Col className={styles.thirdPartyNotice}>{intl('437745', '该数据由第三方提供')}</Col>
      </Row>
    </div>
  )
}
