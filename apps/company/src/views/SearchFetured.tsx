import React, { useEffect, useState } from 'react'
import { getQueryCommonList } from '../api/searchListApi.ts'
import HotItems from '../components/hotItems'
import { numberFormat } from '../lib/utils'
import intl, { getLang } from '../utils/intl'
import { wftCommon } from '../utils/utils'

import { request } from '@/api/request.ts'
import { addSearchHistory, getSearchHistoryAndSlice } from '@/api/services/history.ts'
import { SearchFormSingle } from '@/components/searchForm/index.tsx'
import { FireO } from '@wind/icons'
import { pointBuriedNew } from '../api/configApi'
import { usePageTitle } from '../handle/siteTitle'
import './SearchCommon.less'
import './SearchHotGroup.less'

type SearchItem = {
  name: string
  value: string
  searchFlag?: 'btn' | 'history'
}
function SearchFetured(_props) {
  usePageTitle('RankHome')
  const [hotList, setHotList] = useState([]) // 搜素结果
  const [searchList, setSearchList] = useState<SearchItem[]>([]) // 搜素结果
  const [records, setRecords] = useState(0) // 搜素结果

  useEffect(() => {
    pointBuriedNew('922602100854')
    getQueryCommonList({
      url: '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx',
      cmd: 'corplistrecommend',
      data: {
        PageNo: 0,
      },
    })
      .then((res) => {
        setHotList(res.Data)
        setRecords(res?.Page?.Records)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  const searchRequest = ({ key, callback }) => {
    getQueryCommonList({
      url: '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx',
      cmd: 'corplistpresearch',
      data: {
        keyword: key,
        pageno: 0,
        pagesize: 5,
      },
    })
      .then((res) => {
        callback(res.Data)
        const list = []
        res.Data.map((item) => {
          list.push({
            name: item.objectName,
            value: item.objectId,
          })
        })
        setSearchList(list)
      })
      .catch((e) => {
        console.log('error:', e)
      })
  }

  const goSearchListDetail = (item: SearchItem) => {
    pointBuriedNew('922602100855')
    if (item.searchFlag === 'btn' || item.searchFlag === 'history') {
      wftCommon.jumpJqueryPage(`#feturedlist?search=${item.name.replace(/(<([^>]+)>)/gi, '')}`)
    } else {
      wftCommon.jumpJqueryPage(`#feturedcompany?id=${item.value}`)
    }
  }

  return (
    <React.Fragment>
      <div className={`search-fetured search-common ${getLang() === 'en' ? 'search-fetured-en' : ''}`}>
        <h3 className="main-title">{intl('252965', '企业榜单名录')}</h3>

        <SearchFormSingle
          placeHolder={intl('437773', '搜索榜单名录')}
          searchList={searchList}
          searchRequest={searchRequest}
          goSearchListDetail={goSearchListDetail}
          historyAddTiming="click"
          onFetchHistory={async () => {
            return await getSearchHistoryAndSlice('FEATURE_SEARCH')
          }}
          onAddHistoryItem={async (name: string, value?: string) => {
            await addSearchHistory('FEATURE_SEARCH', { name, value })
          }}
          onClearHistory={async () => {
            await request('operation/delete/searchhistorydeleteall', {
              params: {
                type: 'FEATURE_SEARCH',
              },
            })
          }}
        />

        <div className="hot-feture-Search">
          <div className="hot-wrap">
            <div className="hot-Group">
              <FireO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              <span>{intl('437747', '热门推荐')}</span>
            </div>
            <a className="show-more-fetured" onClick={() => wftCommon.jumpJqueryPage('#feturedlist?id=01010100')}>
              {intl('138737', '查看更多')}
            </a>
          </div>
          <HotItems hotFlag="fetured" hotList={hotList} />
          <div className="all-fetures">
            <a onClick={() => wftCommon.jumpJqueryPage('#feturedlist?id=01010100')}>
              {intl('315080', '查看全部{num}个榜单名录').replace('{num}', numberFormat(records - 2, true))}
            </a>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SearchFetured
