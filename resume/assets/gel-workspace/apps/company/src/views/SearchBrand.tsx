import React, { useState } from 'react'
import { getQueryCommonList } from '../api/searchListApi'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'

import { request } from '@/api/request'
import { addSearchHistory, getSearchHistoryAndSlice } from '@/api/services/history'
import { SearchFormSingle } from '@/components/searchForm'
import { usePageTitle } from '../handle/siteTitle'
import './SearchCommon.less'

function SearchBrand(_props) {
  usePageTitle('TrademarkSearch')
  const [searchList, setSearchList] = useState([]) // 搜素结果

  const searchRequest = ({ key, callback }) => {
    getQueryCommonList({
      url: '/Wind.WFC.Enterprise.Web/Enterprise/gel/search/company/trademarkSearchLenovo',
      data: {
        key,
        type: 'trademark',
        queryText: key,
      },
    })
      .then((res) => {
        callback(res.Data)
        setSearchList(res.Data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const goSearchListDetail = (item) => {
    wftCommon.jumpJqueryPage(`SearchHomeList.html?keyword=${item.name}&type=trademark_search#/intelluctalSearch`)
  }

  return (
    <React.Fragment>
      <div className="search-common">
        <h3 className="main-title">{intl('225084', '商标查询')}</h3>
        <SearchFormSingle
          placeHolder={intl('149699', '请输入商标名称、注册号或申请人名称')}
          searchList={searchList}
          searchRequest={searchRequest}
          goSearchListDetail={goSearchListDetail}
          onFetchHistory={async () => {
            return await getSearchHistoryAndSlice('TRADEMARK_SEARCH')
          }}
          onAddHistoryItem={async (name: string, value?: string) => {
            await addSearchHistory('TRADEMARK_SEARCH', { name, value })
          }}
          onClearHistory={async () => {
            await request('operation/delete/searchhistorydeleteall', {
              params: {
                type: 'TRADEMARK_SEARCH',
              },
            })
          }}
        />
      </div>
    </React.Fragment>
  )
}

export default SearchBrand
