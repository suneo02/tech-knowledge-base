import React, { useRef, useState } from 'react'

import { Avatar, Button } from '@wind/wind-ui'
import { DisLikeO, LikeO, RefreshO } from '@wind/icons'
import styles from './index.module.less'
import CarouselItem from './carousel-item'
import {
  ROBOT_INITIAL_MESSAGE_ID,
  ROBOT_LONG_WAIT_MESSAGE_ID,
  ROBOT_SUMMARY_PREFIX,
  ROBOT_THINKING_MESSAGE_ID,
} from '../constant'
import { useUpdateEffect } from 'ahooks'
import AliceLogo from '@/assets/icons/icon-alice.png'
import SummaryItem from './summary-item'

interface RobotItemProps {
  content: string
  fetching: boolean
  id: string
  isActiveVersion?: boolean
  version?: number
  thumbnail?: string // 添加缩略图属性
  handleVersionImgClick: () => void
  handleRefreshClick: () => void
  handleLikeClick: () => void
  handleDislikeClick: () => void
  questionSource?: 'user' | 'modify' | 'upload' | 'summary' // 问题来源（用户提问、数据表格编辑修改）
  summarizing: boolean
}

const defaultThinkingList = [
  { id: 1, content: '正在全面分析您的问题...' },
  { id: 2, content: '正在深入思考...' },
  { id: 3, content: '正在连接数据库...' },
  { id: 4, content: '正在提取所需数据...' },
  { id: 5, content: '正在整理数据...' },
  { id: 6, content: '正在迅速合成回答...' },
]

const longWaitThinkingList = [
  { id: 1, content: '数据量有点大，我们正在加班加点地为您处理，请喝杯咖啡稍等片刻！' },
  { id: 2, content: '稍安勿躁，我们正在努力处理您的数据，就像辛勤的小蜜蜂一样忙碌中...' },
  { id: 3, content: '正在为您生成图谱，这可能需要一些时间，因为好的结果值得等待哦！' },
]

const RobotItem: React.FC<RobotItemProps> = (props) => {
  const {
    fetching,
    content = '',
    id,
    isActiveVersion,
    version,
    thumbnail, // 使用传入的缩略图
    handleVersionImgClick,
    handleRefreshClick,
    handleLikeClick,
    handleDislikeClick,
    questionSource,
    summarizing,
  } = props
  const robotMsgRef = useRef<HTMLDivElement | null>()
  const [likeType, setLikeType] = useState(0)

  useUpdateEffect(() => {
    if (robotMsgRef.current && isActiveVersion) {
      robotMsgRef.current.scrollIntoView({
        behavior: 'smooth', // 平滑滚动
        block: 'center', // 垂直居中
      })
    }
  }, [isActiveVersion])

  function renderContent() {
    if (id === ROBOT_INITIAL_MESSAGE_ID) {
      return <p className={styles.robotMessage}>{content}</p>
    }
    // AI总结分析
    if (id && id.includes(ROBOT_SUMMARY_PREFIX) && summarizing) {
      return <SummaryItem content={content} />
    }
    if (fetching && [ROBOT_THINKING_MESSAGE_ID, ROBOT_LONG_WAIT_MESSAGE_ID].includes(id)) {
      return <CarouselItem list={id === ROBOT_THINKING_MESSAGE_ID ? defaultThinkingList : longWaitThinkingList} />
    }

    return (
      <div ref={robotMsgRef}>
        <p className={styles.robotMessage}>
          {questionSource === 'summary' ? <SummaryItem content={content} /> : content}
        </p>
        {!!version && (
          <div
            className={styles.snapshotBox}
            style={{ borderColor: !thumbnail ? 'transparent' : isActiveVersion ? '#00aec7' : '#ccc' }}
            onClick={handleVersionImgClick}
          >
            <span className={styles.snapshotVersion}>{`G${version}`}</span>
            {thumbnail && <img src={thumbnail} alt="" />}
          </div>
        )}
        <div className={styles.iconBox}>
          {questionSource === 'user' && (
            <Button
              type="text"
              style={{ padding: 0, color: '#707680' }}
              icon={<RefreshO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={handleRefreshClick}
              //  @ts-ignore
              title="重试"
            />
          )}
          {!!version && ['user', 'upload', 'summary'].includes(questionSource) && (
            <>
              <Button
                type="text"
                icon={
                  <LikeO
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    style={likeType === 1 ? { color: '#0596b3' } : {}}
                  />
                }
                onClick={() => {
                  handleLikeClick()
                  setLikeType(1)
                }}
                //  @ts-ignore
                title="点赞"
              />
              <Button
                type="text"
                icon={
                  <DisLikeO
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    style={likeType === 2 ? { color: '#0596b3' } : {}}
                  />
                }
                onClick={() => {
                  handleDislikeClick()
                  setLikeType(2)
                }}
                //  @ts-ignore
                title="点踩"
              />
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.robotRoot}>
      <img className={styles.aliceLogo} src={AliceLogo} alt="aliceChatLogo" />
      {/* <Avatar
        shape="square"
        src="/static/media/icon-alice.a99e391c85e82f3f872c.png"
        style={{ width: 42 }}
        data-uc-id="ySFqJSzZKw"
        data-uc-ct="avatar"
      /> */}
      <div className={styles.robotRootContent}>{renderContent()}</div>
    </div>
  )
}

export default RobotItem
