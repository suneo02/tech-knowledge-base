import { PointsChangeType } from 'gel-api'
import styles from './index.module.less'
import { Tabs, List, Result, Pagination, Tag } from '@wind/wind-ui'
import { useState } from 'react'
import { requestToSuperlistFcs } from '@/api'
import { usePagination } from 'ahooks'
import dayjs from 'dayjs'

const PREFIX = 'credits-records'
const tabs = [
  {
    label: '全部',
    key: PointsChangeType.ALL,
  },
  {
    label: '消耗',
    key: PointsChangeType.CONSUME,
  },
  {
    label: '赠送',
    key: PointsChangeType.GIVE,
  },
  {
    label: '充值',
    key: PointsChangeType.RECHARGE,
  },
]
const CreditsRecords = () => {
  const [activeTab, setActiveTab] = useState<PointsChangeType>(PointsChangeType.ALL)

  const getPointsChangeList = async ({
    current,
    pageSize,
    changeType,
  }: {
    current: number
    pageSize: number
    changeType: PointsChangeType
  }) => {
    const res = await requestToSuperlistFcs('points/getPointsChangeList', {
      pageNo: current,
      pageSize,
      changeType: changeType == 0 ? undefined : changeType,
    })
    return {
      total: res.Data?.page?.total || 0,
      list: res.Data?.list || [],
    }
  }

  const { data, loading, pagination } = usePagination(
    ({ current, pageSize }) => getPointsChangeList({ current, pageSize, changeType: activeTab }),
    {
      defaultPageSize: 10,
      refreshDeps: [activeTab],
    }
  )

  const getTypeTag = (type: PointsChangeType) => {
    switch (type) {
      case PointsChangeType.ADMIN_CONSUME:
      case PointsChangeType.CONSUME:
        return (
          // @ts-expect-error wind-ui Tag 似乎不支持 label，尝试使用 children
          <Tag color="color-4" type="primary">
            消耗
          </Tag>
        )
      case PointsChangeType.ADMIN_GIVE:
      case PointsChangeType.GIVE:
        return (
          // @ts-expect-error wind-ui Tag 似乎不支持 label，尝试使用 children
          <Tag color="color-2" type="primary">
            赠送
          </Tag>
        )
      case PointsChangeType.RECHARGE:
        return (
          // @ts-expect-error wind-ui Tag 似乎不支持 label，尝试使用 children
          <Tag color="color-2" type="primary">
            充值
          </Tag>
        )
      default:
        return <Tag>未知</Tag>
    }
  }

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {/* @ts-expect-error wind-ui */}
      <Tabs
        className={styles[`${PREFIX}-tabs`]}
        activeKey={String(activeTab)}
        onChange={(key) => setActiveTab(Number(key) as PointsChangeType)}
      >
        {tabs.map((res) => {
          return <Tabs.TabPane key={String(res.key)} tab={res.label} />
        })}
      </Tabs>

      {data?.list?.length ? (
        <>
          <div>
            <List
              className={styles[`${PREFIX}-list`]}
              loading={loading}
              dataSource={data?.list}
              renderItem={(item) => {
                const isConsume =
                  item.changeType === PointsChangeType.CONSUME || item.changeType === PointsChangeType.ADMIN_CONSUME
                const changeCountText = `${isConsume ? '-' : '+'} ${item.changeCount.toLocaleString()}`
                const changeCountClassName = `${styles[`${PREFIX}-change-count`]} ${isConsume ? styles.danger : styles.success}`
                const timeClassName = `${styles[`${PREFIX}-time`]} ${styles.secondary}`

                return (
                  <List.Item key={item.id} className={styles[`${PREFIX}-list-item`]}>
                    <div className={styles[`${PREFIX}-left-column`]}>
                      <div className={styles[`${PREFIX}-left-line-1`]}>
                        {getTypeTag(item.changeType)}
                        <span title={item.changeInfo} className={styles[`${PREFIX}-change-info`]}>
                          {item.changeInfo}
                        </span>
                      </div>
                      <div className={styles[`${PREFIX}-left-line-2`]}>
                        <span className={timeClassName}>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm')}</span>
                      </div>
                    </div>

                    <div className={styles[`${PREFIX}-right-column`]}>
                      <span className={changeCountClassName}>{changeCountText}</span>
                      {!!item.endTime && (
                        <span className={styles[`${PREFIX}-right-line-1`]}>
                          有效期至：{dayjs(item.endTime).format('YYYY-MM-DD')}
                        </span>
                      )}
                    </div>
                  </List.Item>
                )
              }}
            />
          </div>
          {data?.total > pagination.pageSize && (
            <Pagination
              className={styles[`${PREFIX}-pagination`]}
              total={data?.total}
              current={pagination.current}
              pageSize={pagination.pageSize}
              onChange={pagination.onChange}
            />
          )}
        </>
      ) : (
        <Result className={styles[`${PREFIX}-result`]} status={'no-data'} title={'暂无数据'} />
      )}
    </div>
  )
}

export default CreditsRecords
