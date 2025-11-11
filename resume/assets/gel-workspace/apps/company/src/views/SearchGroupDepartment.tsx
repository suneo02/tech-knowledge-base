import React, { useEffect, useState } from 'react'
import { getQueryCommonList } from '../api/searchListApi.ts'
import HotItems from '../components/hotItems'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'

import { SearchFormSingle } from '@/components/searchForm/index.tsx'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { FireO, RefreshO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { useTranslateService } from '../hook'
import './SearchCommon.less'
import './SearchHotGroup.less'

let hotPageNo = 0

function SearchGroupDepartment(_props) {
  const { run: runGetQueryCommonList, loading: hotLoading } = useRequest(
    () => {
      return getQueryCommonList({
        url: '/Wind.WFC.Enterprise.Web/Enterprise/gel/search/group/getgrouprecommendcards',
        data: {
          pageNo: hotPageNo,
        },
      })
    },
    {
      onSuccess: (res) => {
        setHotList(res.Data)
        hotPageNo++
      },
      onError: console.error,
      manual: true,
    }
  )
  const [searchList, setSearchList] = useState([]) // 搜素结果
  const [hotList, setHotList] = useState([]) // 搜素结果
  const [hotListIntl] = useTranslateService(hotList)

  useEffect(() => {
    document.title = intl('224508', '集团系查询')
    runGetQueryCommonList()
  }, [])

  const searchRequest = ({ key }) => {
    getQueryCommonList({
      url: '/Wind.WFC.Enterprise.Web/Enterprise/gel/search/group/getgroupsystempresearch',
      data: {
        queryText: key,
        pageno: 0,
        pagesize: 5,
      },
    })
      .then((res) => {
        const list = []
        res.Data.list.map((item) => {
          list.push({
            ...item,
            name: item.groupsystem_name,
            value: item.groupsystem_id,
          })
        })
        setSearchList(list)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const goSearchListDetail = (item) => {
    // 点击跳转：点击搜索结果和点击搜一下按钮
    if (item.searchFlag === 'btn') {
      wftCommon.jumpJqueryPage(`SearchHomeList.html#/groupSearchList?linksource=CEL&type=group&keyword=${item.name}`)
    } else {
      window.open(
        getUrlByLinkModule(LinksModule.GROUP, {
          id: item.value,
        })
      )
    }
  }

  return (
    <React.Fragment>
      <div className="search-group-department search-common">
        <h3 className="main-title">{intl('224508', '集团系查询')}</h3>
        <SearchFormSingle
          placeHolder={intl('437323', '请输入集团系、公司、人名、品牌等关键词')}
          searchList={searchList}
          searchRequest={searchRequest}
          goSearchListDetail={goSearchListDetail}
        />

        <div className="hot-group-search">
          <div className="hot-wrap">
            <div className="hot-group">
              <FireO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="UDxQlVUPG"
                data-uc-ct="fireo"
              />
              <span>{intl('286619', '热门集团系')}</span>
            </div>
            <div className="hot-change">
              <Button
                type="text"
                icon={
                  <RefreshO
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    data-uc-id="QOTydXGfIN"
                    data-uc-ct="refresho"
                  />
                }
                onClick={runGetQueryCommonList}
                loading={hotLoading}
                data-uc-id="_P19F8GqE7"
                data-uc-ct="button"
              >
                <span>{intl('437752', '换一换')}</span>
              </Button>
            </div>
          </div>
          <HotItems hotFlag="department" hotList={hotListIntl} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default SearchGroupDepartment
