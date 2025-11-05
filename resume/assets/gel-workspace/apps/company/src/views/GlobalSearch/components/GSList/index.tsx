import { Card } from '@wind/wind-ui'
import React from 'react'
// @ts-ignore
import styles from './index.module.less'

enum ListTypeEnum {
  LIST = 'list',
  CARD = 'card',
}

export default ({ type = 'list' }) => {
  return type === ListTypeEnum.CARD ? <CardContainer /> : <ListContainer />
}

const CardContainer = () => {
  return (
    <div className={styles.cardContainer}>
      {Array.from({ length: 40 }).map((_, index) => (
        <Card key={index}>{index}</Card>
      ))}
    </div>
  )
}

const ListContainer = () => {
  return (
    <div className={styles.listContainer}>
      {Array.from({ length: 40 }).map((_, index) => (
        <Card key={index}>{index}</Card>
      ))}
    </div>
  )
}
