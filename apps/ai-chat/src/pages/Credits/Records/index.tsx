import { requestToSuperlistFcs } from '@/api'
import { postPointBuried } from '@/utils/common/bury'
import { List, Pagination, Radio, Result } from '@wind/wind-ui'
import { usePagination } from 'ahooks'
import dayjs from 'dayjs'
import { PointsChangeType } from 'gel-api'
import { t } from 'gel-util/intl'
import { useState } from 'react'
import styles from './index.module.less'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const PREFIX = 'credits-records'

const STRINGS = {
  ALL: t('420196', '全部'),
  CONSUME: t('464232', '消耗'),
  GIVE: t('464233', '赠送'),
  RECHARGE: t('464239', '充值'),
  NO_DATA: t('422032', '暂无数据'),
  EFFECTIVE_TIME: t('454242', '有效期至'),
}

const tabs = [
  {
    label: STRINGS.ALL,
    key: PointsChangeType.ALL,
  },
  {
    label: STRINGS.CONSUME,
    key: PointsChangeType.CONSUME,
  },
  {
    label: STRINGS.GIVE,
    key: PointsChangeType.GIVE,
  },
  {
    label: STRINGS.RECHARGE,
    key: PointsChangeType.RECHARGE,
  },
]
const CreditsRecords = () => {
  const [activeTab, setActiveTab] = useState<string>(String(PointsChangeType.ALL))

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
    // @ts-expect-error
    ({ current, pageSize }) => getPointsChangeList({ current, pageSize, changeType: activeTab }),
    {
      defaultPageSize: 10,
      refreshDeps: [activeTab],
    }
  )

  // const getTypeTag = (type: PointsChangeType) => {
  //   switch (type) {
  //     case PointsChangeType.ADMIN_CONSUME:
  //     case PointsChangeType.CONSUME:
  //       return (
  //         <Tag color="color-4" type="primary">
  //           消耗
  //         </Tag>
  //       )
  //     case PointsChangeType.ADMIN_GIVE:
  //     case PointsChangeType.GIVE:
  //       return (
  //         <Tag color="color-2" type="primary">
  //           赠送
  //         </Tag>
  //       )
  //     case PointsChangeType.RECHARGE:
  //       return (
  //         <Tag color="color-2" type="primary">
  //           充值
  //         </Tag>
  //       )
  //     default:
  //       return <Tag>未知</Tag>
  //   }
  // }

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {/* <Tabs
        className={styles[`${PREFIX}-tabs`]}
        activeKey={String(activeTab)}
        onChange={(key) => {
          postPointBuried('922604570320', { click: tabs.find((res) => res.key === Number(key))?.label })
          setActiveTab(Number(key) as PointsChangeType)
        }}
      >
        {tabs.map((res) => {
          return <Tabs.TabPane key={String(res.key)} tab={res.label} />
        })}
      </Tabs> */}
      <RadioGroup
        defaultValue={activeTab}
        size="large"
        onChange={(ev) => {
          const key = ev.target.value
          postPointBuried('922604570320', { click: tabs.find((res) => res.key === Number(key))?.label })
          setActiveTab(String(key))
        }}
      >
        {tabs.map((res) => {
          return (
            <RadioButton key={String(res.key)} value={String(res.key)} style={{ padding: '0 20px' }}>
              {res.label}
            </RadioButton>
          )
        })}
      </RadioGroup>

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
                        {/* {getTypeTag(item.changeType)} */}
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
                          {STRINGS.EFFECTIVE_TIME}：{dayjs(item.endTime).format('YYYY-MM-DD HH:mm')}
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
        <Result className={styles[`${PREFIX}-result`]} status={'no-data'} title={STRINGS.NO_DATA} />
      )}
    </div>
  )
}

export default CreditsRecords
