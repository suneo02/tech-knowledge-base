import { createDownload } from '@/api/searchListApi.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { chinaSort, globalSort } from '@/views/GlobalSearch/config'
import { GSTabsEnum } from '@/views/GlobalSearch/types'
import { DownloadO } from '@wind/icons'
import { Button, Divider, Empty, Select } from '@wind/wind-ui'
import React, { useEffect, useState } from 'react'
import SearchResultList from '../components/SearchResult'
import useResultListData from '../useResultList'
import './index.less'
import { SearchResultItem } from '../components/SearchResult/type'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MultiResultList: React.FC<{ filterParams: any; data?: any; api?: [string, string]; type: GSTabsEnum }> = ({
  filterParams,
  data,
  api,
  type,
}) => {
  const sortOptions = type === GSTabsEnum.CHINA ? chinaSort : globalSort
  const [sort, setSort] = useState(sortOptions[0].value)
  const {
    data: fullData,
    total: fullTotal,
    loading: fullLoading,
    next: fullNext,
    refresh: fullRefresh,
    done: fullDone,
    setData: setFullData,
  } = useResultListData<SearchResultItem>(api[0], { ...filterParams, sort }, data, true)
  const {
    data: partData,
    total: partTotal,
    loading: partLoading,
    next: partNext,
    refresh: partRefresh,
    reset: partReset,
    done: partDone,
    setData: setPartData,
  } = useResultListData<SearchResultItem>(api[1], filterParams, undefined, true)

  const refresh = () => {
    fullRefresh()
  }

  useEffect(() => {
    refresh()
  }, [filterParams, sort])

  useEffect(() => {
    if (fullDone) {
      partRefresh()
    } else {
      partReset()
    }
  }, [fullDone])

  if (!fullLoading && !partLoading && fullData?.length === 0 && partData?.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
          height: '40vh',
          minHeight: 400,
          width: '100%',
        }}
      >
        <Empty
          status="no-data"
          description={
            window.en_access_config
              ? 'Sorry, no relevant data was found. Please change the keywords and try again.'
              : '抱歉，没有找到相关数据，请更换关键词重试'
          }
          direction={'horizontal'}
          data-uc-id="koypTuVSK"
          data-uc-ct="empty"
        />
      </div>
    )
  }

  return (
    <div className="result-list-container">
      {fullTotal ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingInline: 12 }}>
            <div
              dangerouslySetInnerHTML={{
                __html: intl('437222', '找到 % 家符合条件的企业').replace(
                  /%/,
                  `<strong> ${wftCommon.formatMoneyComma(fullTotal)}</strong>`
                ),
              }}
            ></div>
            <div>
              <Select
                style={{ minWidth: 120 }}
                value={sort}
                options={sortOptions}
                onChange={setSort}
                data-uc-id="XBEt1oFODx"
                data-uc-ct="select"
              ></Select>
              {type === GSTabsEnum.CHINA ? (
                <Button
                  // @ts-expect-error ttt
                  icon={<DownloadO data-uc-id="VCu4pemoT6" data-uc-ct="downloado" />}
                  style={{ marginLeft: 12 }}
                  onClick={() => {
                    createDownload({ ...filterParams, sort, companyname: filterParams.queryText }).then((res) => {
                      if (res.ErrorCode == '0') {
                        wftCommon.jumpJqueryPage('index.html#/customer?type=mylist')
                      }
                    })
                  }}
                  data-uc-id="kthqt5GcAn"
                  data-uc-ct="button"
                >
                  {intl('4698', '导出数据')}
                </Button>
              ) : null}
            </div>
          </div>
          <Divider style={{ marginBlockStart: 12, marginBlockEnd: 0 }} />
        </>
      ) : null}
      <SearchResultList
        data={fullData}
        total={fullTotal}
        loading={fullLoading}
        next={fullNext}
        moreMessage={fullData?.length >= fullTotal ? ' ' : '上拉加载更多'}
        type={type}
        done={fullDone}
        updateData={setFullData}
        data-uc-id="vgCPfgTR8T"
        data-uc-ct="searchresultlist"
      />
      {partTotal ? (
        <>
          {fullTotal ? <Divider style={{ marginBlock: 12 }} /> : null}
          <div style={{ textAlign: 'center' }}>{intl('406773', '以下是为您推荐的包含部分关键词的搜索结果')}</div>
          <Divider style={{ marginBlock: 12 }} />
        </>
      ) : null}
      <SearchResultList
        updateData={setPartData}
        done={partDone}
        data={partData}
        total={partTotal}
        loading={partLoading}
        next={partNext}
        type={type}
        data-uc-id="oQSCDlaCoh"
        data-uc-ct="searchresultlist"
      />
    </div>
  )
}

export default MultiResultList
