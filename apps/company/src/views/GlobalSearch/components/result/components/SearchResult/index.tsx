import { DeleteCustomer } from '@/api/companyDynamic'
import Avatar from '@/components/common/Avatar'
import intl from '@/utils/intl'
import { GSTabsEnum } from '@/views/GlobalSearch/types'
import { AddStarO, StarF } from '@wind/icons'
import { Button, List, message, Modal } from '@wind/wind-ui'
import React, { useRef } from 'react'
import { PRIMARY_COLOR_1 } from '../../../forrm/common/select/type'
import More from '../More'
import './index.less'
import SearchResultCollectModal from './modal'
import SearchResultTag from './tag'

import {
  AddressInfo,
  CompanyNameInfo,
  CountryInfo,
  DomesticEntity,
  EnglishNameInfo,
  EstablishDateInfo,
  HighlightInfo,
  IndustryInfo,
  LegalPersonInfo,
  ProvinceInfo,
  RegisterCapitalInfo,
} from './info'
import { SearchResultItem } from './type'

interface Props<T> {
  data?: T[]
  total?: number
  loading?: boolean
  pagination?: {
    pageSize: number
    pageIndex: number
  }
  done?: boolean
  moreMessage?: string
  type?: GSTabsEnum
  next?: (reset?: boolean) => Promise<void>
  refresh?: () => void
  updateData?: React.Dispatch<React.SetStateAction<T[]>>
}

interface SearchResultCollectModalRef {
  open: (companyCode: string, callback: () => void) => void
}

const SearchResult = <T extends Record<string, any>>(props: Props<T>) => {
  const collectModalRef = useRef<SearchResultCollectModalRef>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const { data, total, loading, next, moreMessage, type, done, updateData } = props

  const handleCollect = (isCollect: boolean, companyCode: string) => {
    if (isCollect) {
      handleDelete(companyCode)
    } else {
      collectModalRef?.current?.open(companyCode, () => {})
    }
  }

  const handleDelete = (companyCode: string) => {
    Modal.confirm({
      title: intl('257736', '取消收藏后将不会再收到该企业相关动态的推送。'),
      onOk: () => {
        DeleteCustomer({ CompanyCode: companyCode }).then((res) => {
          if (res.ErrorCode === '0') {
            message.success(intl('261930', '已取消收藏'))
            if (updateData)
              updateData((prevData) =>
                prevData.map((item) => (item.corpId === companyCode ? { ...item, isCollect: false } : item))
              )
          }
        })
      },
    })
  }

  return (
    <>
      <List<SearchResultItem>
        className="search-result-list-container"
        loading={loading}
        itemLayout="vertical"
        size="large"
        dataSource={data as unknown as SearchResultItem[]}
        renderItem={(item, index) => {
          return (
            <List.Item key={(item.corpId as string) || index}>
              <div className="item-item">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginInlineEnd: 12 }}>
                    <Avatar src={item.logo} alt={item.corpName} width={60} height={60} />
                  </div>

                  <div style={{ width: '100%' }}>
                    <div
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <CompanyNameInfo item={item} type={type} />
                      <Button
                        //  @ts-expect-error ttt
                        icon={item.isCollect ? <StarF style={{ color: PRIMARY_COLOR_1 }} /> : <AddStarO />}
                        onClick={() => handleCollect(!!item.isCollect, item.corpId)}
                      >
                        {item.isCollect ? intl('138129', '已收藏') : intl('143165', '收藏')}
                      </Button>
                    </div>
                    <EnglishNameInfo item={item} type={type} />
                    <div style={{ marginBlockStart: 8 }}>
                      <SearchResultTag {...item} type={type} />
                    </div>
                  </div>
                </div>
                <div className="flex3">
                  <CountryInfo item={item} type={type} />

                  <ProvinceInfo item={item} type={type} />

                  <EstablishDateInfo item={item} type={type} />

                  <RegisterCapitalInfo item={item} type={type} />

                  <LegalPersonInfo item={item} type={type} />

                  <IndustryInfo item={item} type={type} />
                </div>

                <div style={{ marginInlineEnd: 12, marginBlockStart: 4 }}>
                  <AddressInfo item={item} type={type} />
                </div>
                <div className="flex3">
                  <DomesticEntity item={item} type={type} />
                </div>

                <HighlightInfo item={item} />
              </div>
            </List.Item>
          )
        }}
      />
      {!done && total ? (
        <More
          ref={moreRef}
          enable={data?.length > 0 && !loading && data?.length < total}
          onLoading={next}
          // message={moreMessage || (data?.length >= total ? '我是有底线的' : '上拉加载更多')}
        />
      ) : null}

      <SearchResultCollectModal
        // @ts-expect-error ttt
        ref={collectModalRef}
        onCollectSuccess={(companyCode) =>
          updateData((prevData) =>
            prevData.map((item) => (item.corpId === companyCode ? { ...item, isCollect: true } : item))
          )
        }
      />
    </>
  )
}

export default SearchResult
