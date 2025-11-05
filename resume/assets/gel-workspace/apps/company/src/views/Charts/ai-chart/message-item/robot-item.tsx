import React from 'react'

import { Avatar } from '@wind/wind-ui'
import { UserO } from '@wind/icons'
import styles from './index.module.less'
import CarouselItem from './carousel-item'
import { ROBOT_THING_MESSAGE_ID } from '../constant'

interface RobotItemProps {
  content: string
  fetching: boolean
  id: string
}

const defaultThinkingList = [
  { id: 1, content: '正在全面分析您的问题...' },
  { id: 2, content: '正在深入思考...' },
  { id: 3, content: '正在连接数据库...' },
  { id: 4, content: '正在提取所需数据...' },
  { id: 5, content: '正在整理数据...' },
  { id: 6, content: '正在迅速合成回答...' },
  { id: 7, content: '这些提示语按照等待时长均分展示...' },
]

const RobotItem: React.FC<RobotItemProps> = (props) => {
  const { fetching, content = '', id } = props

  return (
    <div className={styles.robotRoot}>
      <Avatar shape="square" src="/static/media/icon-alice.a99e391c85e82f3f872c.png" style={{ width: 42 }} />
      <div className={styles.robotRootContent}>
        {fetching && id === ROBOT_THING_MESSAGE_ID ? (
          <CarouselItem list={defaultThinkingList} />
        ) : (
          <p style={{ fontSize: 14, color: '#333' }}>{content}</p>
        )}

        {/* <div style={{ display: 'flex', marginTop: 16 }}>
          <CopyO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          <CopyO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          <CopyO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        </div> */}
      </div>
    </div>
  )
}

export default RobotItem
