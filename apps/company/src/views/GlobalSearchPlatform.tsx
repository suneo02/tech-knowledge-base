import React, { useEffect, useState } from 'react'
import { getQueryCommonList } from '../api/searchListApi'
import SearchForm from '../components/searchForm'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'

import './SearchCommon.less'

export function GlobalSearchPlatform() {
  const [searchList, setSearchList] = useState([]) // 搜素结果

  useEffect(() => {
    document.title = intl('206094', '全球企业查询')
  }, [])

  const searchRequest = ({ key, country }) => {
    getQueryCommonList({
      url: '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx',
      cmd: 'getglobalcompanysearch',
      data: {
        type: country,
        country: country,
        pageSize: 5,
        pageNo: 0,
        companyname: key,
        source: 'cel',
        sort: '-1',
      },
    })
      .then((res) => {
        let list = []
        res.Data.list.map((item) => {
          list.push({
            ...item,
            name: item.corp_name,
            value: item.corp_id,
          })
        })
        setSearchList(list)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const goSearchListDetail = (item) => {
    if (item.searchFlag === 'btn') {
      return wftCommon.jumpJqueryPage(
        `index.html#/globalSearch?keyword=${item.name}&type=global&areaType=${item.country}`
      )
    } else {
      wftCommon.jumpJqueryPage(
        `Company.html?companycode=${item.value}&from=openBu3&country=${item.country}&inputItem=${
          item.name
        }&clickNum=1&fromModule=preSearch&funcType=preSearchCk&fromPageUId=${wftCommon.getPageUId()}#/`
      )
    }
    return
  }

  return (
    <React.Fragment>
      <div className="search-common global-search">
        <h3 className="main-title">{intl('206094', '全球企业查询')}</h3>
        <SearchForm
          placeHolder={intl('225183', '请输入公司名称')}
          searchList={searchList}
          searchRequest={searchRequest}
          goSearchListDetail={goSearchListDetail}
          showSelect={true}
          pageFlag="globePreSearch"
        />
      </div>
    </React.Fragment>
  )
}
