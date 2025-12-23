import React, { useState } from 'react'
import { getQueryCommonList } from '../api/searchListApi'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'

import { request } from '@/api/request'
import { addSearchHistory, getSearchHistoryAndSlice } from '@/api/services/history'
import { SearchFormSingle } from '@/components/searchForm'
import { pointBuriedByModule } from '../api/pointBuried/bury'
import { usePageTitle } from '../handle/siteTitle'
import './SearchCommon.less'

function SearchPatent(_props) {
  usePageTitle('PatentSearch')
  const [searchList, setSearchList] = useState([]) // 搜素结果

  const searchRequest = ({ key, callback }) => {
    getQueryCommonList({
      url: '/Wind.WFC.Enterprise.Web/Enterprise/gel/search/company/patentSearchLenovo',
      data: {
        key,
        type: 'patent',
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
    pointBuriedByModule(922602101066)
    wftCommon.jumpJqueryPage(`SearchHomeList.html?keyword=${item.name}&type=patent_search#/intelluctalSearch`)
  }

  return (
    <React.Fragment>
      <div className="search-common">
        <h3 className="main-title">{intl('225083', '专利查询')}</h3>
        <SearchFormSingle
          placeHolder={intl('149700', '请输入专利名称、申请号或申请人名称')}
          searchList={searchList}
          searchRequest={searchRequest}
          goSearchListDetail={goSearchListDetail}
          historyAddTiming="click"
          onFetchHistory={async () => {
            return await getSearchHistoryAndSlice('PATENT_SEARCH')
          }}
          onAddHistoryItem={async (name: string, value?: string) => {
            await addSearchHistory('PATENT_SEARCH', { name, value })
          }}
          onClearHistory={async () => {
            await request('operation/delete/searchhistorydeleteall', {
              params: {
                type: 'PATENT_SEARCH',
              },
            })
          }}
          data-uc-id="PySP1k5CEgJ"
          data-uc-ct="searchformsingle"
        />
      </div>
    </React.Fragment>
  )
}

export default SearchPatent
