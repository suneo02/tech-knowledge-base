import React, { useEffect, useState } from 'react'
import { getQueryCommonList } from '../api/searchListApi.ts'
import HotItems from '../components/hotItems'
import { numberFormat } from '../lib/utils'
import intl, { getLang } from '../utils/intl'

import { request } from '@/api/request.ts'
import { addSearchHistory, getSearchHistoryAndSlice } from '@/api/services/history.ts'
import { SearchFormSingle } from '@/components/searchForm/index.tsx'
import { GELSearchParam, getUrlByLinkModule, LinksModule, TLinkOptions } from '@/handle/link/index.ts'
import { hashParams } from '@/utils/links/index.ts'
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

// 跳转到榜单列表
export const routerToFeaturedList = ({
  id,
  search,
  linksource,
}: {
  id?: string
  search?: string
  linksource?: string
}) => {
  const params: Record<string, string> = {
    ...(linksource ? { linksource } : {}),
    ...(search ? { search } : {}),
    [GELSearchParam.NoSearch]: 1,
  }

  const options: TLinkOptions = {
    ...(id ? { id } : {}),
    ...(Object.keys(params).length > 0 ? { params } : {}),
  }

  const url = getUrlByLinkModule(LinksModule.FEATURED_LIST, options)
  window.open(url)
}

// 跳转到榜单详情
export const routerToFeaturedCompany = ({ id, linksource }: { id: string; linksource?: string }) => {
  const params: Record<string, string> = {
    ...(linksource ? { linksource } : {}),
    [GELSearchParam.NoSearch]: 1,
  }
  const options: TLinkOptions = {
    ...(id ? { id } : {}),
    ...(Object.keys(params).length > 0 ? { params } : {}),
  }
  const url = getUrlByLinkModule(LinksModule.FEATURED, options)

  window.open(url)
}

function SearchFetured() {
  const { getParamValue } = hashParams()
  const linksource = getParamValue('linksource')
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
        if (res?.Data) {
          setHotList(res.Data)
          setRecords(res?.Page?.Records)
        }
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
      // wftCommon.jumpJqueryPage(`#feturedlist?search=${item.name.replace(/(<([^>]+)>)/gi, '')}`, {
      //   from,
      // })
      routerToFeaturedList({ search: item.name.replace(/(<([^>]+)>)/gi, ''), linksource })
    } else {
      routerToFeaturedCompany({ id: item.value, linksource })
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
          data-uc-id="cFkqf5Akj8A"
          data-uc-ct="searchformsingle"
        />

        <div className="hot-feture-Search">
          <div className="hot-wrap">
            <div className="hot-Group">
              <FireO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="0emhKgWnn0w"
                data-uc-ct="fireo"
              />
              <span>{intl('437747', '热门推荐')}</span>
            </div>
            <a
              className="show-more-fetured"
              // onClick={() => wftCommon.jumpJqueryPage(`#feturedlist?id=01010100${from ? `&from=${from}` : ''}`)}
              onClick={() => routerToFeaturedList({ id: '01010100', linksource })}
              data-uc-id="c7LP-_sxgzi"
              data-uc-ct="a"
            >
              {intl('138737', '查看更多')}
            </a>
          </div>
          <HotItems hotFlag="fetured" hotList={hotList} />
          <div className="all-fetures">
            <a
              onClick={() => routerToFeaturedList({ id: '01010100', linksource })}
              data-uc-id="34rF18akrwU"
              data-uc-ct="a"
            >
              {intl('315080', '查看全部{num}个榜单名录').replace('{num}', numberFormat(records - 2, true))}
            </a>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SearchFetured
