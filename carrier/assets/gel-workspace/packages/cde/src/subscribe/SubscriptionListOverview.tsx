import { RightOutlined } from '@/assets/icons'
import { Button, Card, List, Typography } from '@wind/wind-ui'
import classNames from 'classnames'
import { CDESubscribeItem } from 'gel-api'
import { intl } from 'gel-util/intl'
import { isEmpty } from 'lodash'
import { FC } from 'react'
import styles from './style/overview.module.less'
import { CloseCircleF } from '@wind/icons'

export const CDESubscriptionListOverview: FC<{
  className?: string
  loading: boolean
  onClickLoadMore: () => void
  onItemClick: (item: CDESubscribeItem) => void
  onClickDel: (item: CDESubscribeItem) => void
  getCDESubscribeText: (item: CDESubscribeItem) => string
  subscriptions: CDESubscribeItem[]
  subEmail: string
}> = ({ loading, onClickLoadMore, onItemClick, onClickDel, className, getCDESubscribeText, subscriptions }) => {
  return (
    <Card className={classNames(styles.overviewWrapper, className)} size="small" title={intl('272478', '我的保存')}>
      <List
        itemLayout="horizontal"
        dataSource={subscriptions}
        loading={loading}
        loadMore={
          loading || !subscriptions || isEmpty(subscriptions) ? null : (
            <Button className="loadMore" type="link" onClick={onClickLoadMore}>
              {intl('138650', '查看全部')}
              <RightOutlined />
            </Button>
          )
        }
        renderItem={(item) => {
          const text = getCDESubscribeText(item)
          return (
            <List.Item className={styles.overviewListItem} style={{ padding: 0 }}>
              <div
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  cursor: 'pointer',
                }}
                onClick={() => onItemClick(item)}
              >
                <List.Item.Meta
                  title={<span>{item.subName || intl('283404', '无标题')}</span>}
                  description={
                    // @ts-expect-error wind ui
                    <Typography className={styles.overviewListItemDesc} ellipsis={{ tooltip: text }}>
                      {text}
                    </Typography>
                  }
                />
              </div>
              {/* @ts-expect-error wind icon */}
              <Button type="text" icon={<CloseCircleF />} onClick={() => onClickDel(item)} style={{ marginRight: 8 }} />
            </List.Item>
          )
        }}
      />
    </Card>
  )
}
