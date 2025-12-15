import { createRequest } from '@/api/request'
import { BreadCrumbItemDef, BreadCrumbProps } from '@/components/breadCrumb'
import PageContainer from '@/components/layout/container/PageContainer'
import { useTranslateService } from '@/hook'
import intl from '@/utils/intl'
import { hashParams } from '@/utils/links'
import { Empty } from '@wind/wind-ui'
import { useInViewport, useRequest } from 'ahooks'
import React, { useCallback, useMemo, useRef } from 'react'
import IcLayoutBasicInfo from './components/BasicInfo'
import IcLayoutCategory from './components/Category'
import IcLayoutEntriesChangeRecords from './components/EntriesChangeRecords'
import IcLayoutExclusiveTransfer from './components/ExclusiveTransfer'
import styles from './index.module.less'

const PREFIX = 'ic-layout'
const STRINGS = {
  IC_LAYOUT: intl('452482', '集成电路布图'),
  IC_LAYOUT_CATEGORY: intl('452504', '布图设计类别'),
  IC_LAYOUT_EXCLUSIVE_TRANSFER: intl('452505', '专有权转移'),
  IC_LAYOUT_ENTRIES_CHANGE_RECORDS: intl('452506', '著录项目变更'),
  NO_DATA: intl('17235', '暂无数据'),
}

const getIcLayoutDetail = (id: string) => {
  const api = createRequest({ id })

  return api('detail/icLayout/getIntegratedCircuitLayoutDetail', { params: { exclusiveRightId: id } })
}

const IcLayout = () => {
  const id = hashParams().getParamValue('id')
  const titleRef = useRef<HTMLDivElement>(null)
  const [inViewport] = useInViewport(titleRef)

  const {
    data: response,
    error,
    loading,
  } = useRequest(() => getIcLayoutDetail(id!), {
    ready: !!id,
    cacheKey: `ic-layout-${id}`,
  })

  const [allIndustriesIntl] = useTranslateService(response, true, true)

  const data = allIndustriesIntl?.Data

  const handleScrollToTitle = useCallback(() => {
    titleRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const breadCrumbOptions: BreadCrumbProps = useMemo(() => {
    if (inViewport) {
      return {
        items: [{ title: STRINGS.IC_LAYOUT }],
      }
    }
    const items: BreadCrumbItemDef[] = [{ title: STRINGS.IC_LAYOUT, onClick: handleScrollToTitle }]
    if (data?.baseInfo?.name) {
      items.push({ title: data.baseInfo.name })
    }
    return { items }
  }, [inViewport, data, handleScrollToTitle])

  return (
    <PageContainer loading={loading} error={error} isEmpty={!data && !loading && !error} breadCrumb={breadCrumbOptions}>
      <div className={styles[`${PREFIX}-content`]}>
        <div>
          <h2 ref={titleRef}>{data?.baseInfo?.name}</h2>
          <IcLayoutBasicInfo data={data?.baseInfo} /> {/* 基本信息 */}
          <h2 style={{ marginBlockStart: 12 }}>{STRINGS.IC_LAYOUT_CATEGORY}</h2>
          <IcLayoutCategory data={data?.category} /> {/* 种类 */}
        </div>
        <div>
          <h2>{STRINGS.IC_LAYOUT_EXCLUSIVE_TRANSFER}</h2>
          {data?.exclusiveTransferRecords?.length ? (
            <IcLayoutExclusiveTransfer data={data?.exclusiveTransferRecords} />
          ) : (
            <Empty description={STRINGS.NO_DATA} data-uc-id="lFiXrMnd24" data-uc-ct="empty" />
          )}
        </div>
        <div>
          <h2>{STRINGS.IC_LAYOUT_ENTRIES_CHANGE_RECORDS}</h2>
          {data?.entriesChangeRecords?.length ? (
            <IcLayoutEntriesChangeRecords data={data?.entriesChangeRecords} />
          ) : (
            <Empty description={STRINGS.NO_DATA} data-uc-id="12XzMPJfZ5" data-uc-ct="empty" />
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export default IcLayout
